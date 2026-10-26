
export default defineBackground(() => {
  browser.runtime.onInstalled.addListener(async ({ reason }) => {
    const existingContexts = await browser.runtime.getContexts({
      contextTypes: ["OFFSCREEN_DOCUMENT"],
    });

    if (existingContexts.length === 0) {
      await browser.offscreen.createDocument({
        url: "offscreen.html",
        reasons: ["USER_MEDIA"],
        justification: "Capture YouTube audio",
      });
    }

    console.info('Angen installed', { reason });
  });

  browser.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.target !== "background") {
      return;
    }

    if (message.type !== "START_CAPTURE") {
      return;
    }

    // Only the intended recipient keeps the response channel open.
    void (async () => {
      try {
        const existingContexts = await browser.runtime.getContexts({
          contextTypes: ["OFFSCREEN_DOCUMENT"],
        });

        if (existingContexts.length === 0) {
          await browser.offscreen.createDocument({
            url: "offscreen.html",
            reasons: ["USER_MEDIA"],
            justification: "Capture YouTube audio",
          });
        }

        const streamId = await browser.tabCapture.getMediaStreamId({
          targetTabId: message.tabId,
        });

        console.log("Stream ID:", streamId);

        const response = await browser.runtime.sendMessage({
          target: "offscreen",
          type: "START_CAPTURE",
          streamId: streamId,
        });

        return response ?? {
          success: false,
          error: 'Offscreen document returned no response',
        };
      } catch (error) {
        console.error(error);

        return {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    })().then(sendResponse);

    return true;
  });
});

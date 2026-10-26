let capturedAudioStream: MediaStream | null = null;
let audioContext: AudioContext | null = null;


browser.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.target !== "offscreen") {
    return;
  }

  if (message.type !== "START_CAPTURE") {
    return;
  }

  void (async () => {
    try {
        capturedAudioStream = await navigator.mediaDevices.getUserMedia({
            audio: {
            mandatory: {
                chromeMediaSource: "tab",
                chromeMediaSourceId: message.streamId,
            },
            } as MediaTrackConstraints,
            video: false,
        });

        audioContext = new AudioContext();

        await audioContext.audioWorklet.addModule(browser.runtime.getURL("/audio-processor.js"));

        const audioWorkletNode = new AudioWorkletNode(
            audioContext,
            "my-audio-processor"
        );
        const audioSource = audioContext.createMediaStreamSource(
            capturedAudioStream,
        );
            audioWorkletNode.port.onmessage = (event) => {
                // console.log("Received audio samples:", event.data);
            };
        const audioAnalyser = audioContext.createAnalyser();
        audioSource.connect(audioAnalyser);
        audioAnalyser.connect(audioWorkletNode);
        
        audioAnalyser.connect(audioContext.destination);

        await audioContext.resume();
        
        console.log("Audio connected:", capturedAudioStream);

        const audioSamples = new Float32Array(audioAnalyser.fftSize);
          setInterval(() => {
            audioAnalyser.getFloatTimeDomainData(audioSamples);

            let sumOfSquares = 0;

            for (const audioSample of audioSamples) {
                sumOfSquares += audioSample * audioSample;
            }

            const rootMeanSquare = Math.sqrt(
                sumOfSquares / audioSamples.length
            );

            console.log("Audio level:", rootMeanSquare);
        }, 500);
            


        return { success: true };
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


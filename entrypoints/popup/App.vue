<script lang="ts" setup>
import { ref } from 'vue';

const connectionStatus = ref("Not Connected")


const connectToYoutubeAudio = async () => {
  const [tab] = await browser.tabs.query({
    active: true,
    currentWindow: true
  });

  if (!tab) {
    console.error("Active tabs not found");
    return;
  }

    if (tab.id === undefined || !tab.url?.startsWith("https://www.youtube.com/")) {
      console.error("Can not find Youtube");
      return;
    }

  const result = await browser.runtime.sendMessage({
    target: "background",
    type: "START_CAPTURE",
    tabId: tab.id
  }).then((response) => {
    if (!response?.success) {
      throw new Error(response?.error ?? "Audio capture failed");
    }

    connectionStatus.value = "Connected";
    return response;
  }).catch((error) => {
    console.log(error);
  });
};


</script>


<template>
  <main class="w-90 bg-[#10131b] p-6 font-sans text-lime-100 antialiased">
    <header class="flex items-center justify-between">
      <span class="grid size-10 place-items-center rounded-xl bg-lime-300 text-2xl font-extrabold text-lime-950" aria-hidden="true">A</span>
      <span class="text-[11px] text-lime-400">Vue 3 + TypeScript</span>
    </header>
    <h1 class="mt-6 text-[32px] font-bold tracking-tight">Angen</h1>
    <section class="mt-6 flex flex-col gap-3 rounded-2xl border border-lime-700/70 p-4.5">
      <p>Статус подлючения: {{ connectionStatus }}</p>
      <button
        type="button"
        v-on:click="connectToYoutubeAudio"
        class="w-full cursor-pointer rounded-xl border border-lime-700 px-4 py-3 text-[13px] font-semibold text-lime-200 transition-colors hover:border-lime-400 hover:bg-lime-800 active:bg-lime-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime-300 disabled:cursor-not-allowed disabled:opacity-50"
      >Подключить аудио</button>
    </section>
    <footer class="mt-5 text-[11px] text-lime-400">Chromium · Manifest V3</footer>
  </main>
</template>

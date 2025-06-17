<template>
  <div
    class="container mx-auto p-4 dark:bg-gray-950 bg-gray-50 h-screen dark:text-gray-200 text-gray-800 flex flex-col gap-4"
  >
    <div class="h-full grow overflow-scroll" id="output">
      <div
        v-if="outputValue === ''"
        class="h-full flex items-center justify-center"
      >
        <LandingImage theme="dark" />
      </div>
      <p v-html="parsedOutputValue" class="prose dark:prose-invert prose-sm" />
    </div>
    <div
      class="rounded-sm flex items-center border-gray-100 p-2 shadow-md shadow-gray-800 ring ring-gray-800 ring-offset-0"
    >
      <input
        class="w-full outline-0 text-sm dark:text-gray-200 text-gray-800"
        type="text"
        placeholder="ask anything"
        :value="inputValue"
        @input="(event) => (inputValue = (event.target as HTMLInputElement).value)"
        v-on:keyup.enter="sendMessage(inputValue)"
      />

      <button @click="sendMessage(inputValue)" class="cursor-pointer">
        <div v-if="loading">
          <LoaderCircle
            class="stroke-gray-800 dark:stroke-gray-200 w-4 animate-spin"
          />
        </div>
        <div v-else>
          <SendHorizonal class="stroke-gray-800 dark:stroke-gray-200 w-4" />
        </div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { marked } from 'marked';
import { SendHorizonal, LoaderCircle } from 'lucide-vue-next';
import LandingImage from './components/LandingImage.vue';

marked.setOptions({
  gfm: true,
  breaks: true,
});

const inputValue = ref<string>('');
const outputValue = ref<string>('');
const parsedOutputValue = computed(() => marked.parse(outputValue.value));
const loading = ref<boolean>(false);

const sendMessage = async (message: string) => {
  if (!message) return;

  loading.value = true;

  window.electronAPI.onChatStreamChunk((chunk: string) => {
    loading.value = false;
    outputValue.value += chunk;
    console.log('🚀 ~ outputValue:', outputValue);
  });

  window.electronAPI.onChatStreamEnd(() => {
    console.log('Chat stream ended.');
  });

  try {
    inputValue.value = '';
    await window.electronAPI.startChatStream(message);
  } catch (error) {
    console.error('Error starting chat stream:', error);
  }
};
</script>

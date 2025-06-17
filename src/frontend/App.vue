<template>
  <div
    class="container mx-auto p-4 dark:bg-gray-950 min-h-screen dark:text-gray-200 text-gray-800"
  >
    <div
      class="rounded-sm flex items-center border-gray-100 p-2 shadow-md shadow-gray-500 ring ring-gray-800 ring-offset-0"
    >
      <input
        class="w-full outline-0 text-sm dark:text-gray-200 text-gray-800"
        type="text"
        placeholder="ask anything"
        :value="inputValue"
        @input="(event) => (inputValue = (event.target as HTMLInputElement).value)"
      />

      <button @click="sendMessage(inputValue)" class="cursor-pointer">
        <SendHorizonal class="stroke-gray-800 dark:stroke-gray-50 w-4" />
      </button>
    </div>

    <div class="mt-10">
      <p v-html="parsedOutputValue" class="prose dark:prose-invert prose-sm" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { marked } from 'marked';
import { SendHorizonal } from 'lucide-vue-next';

marked.setOptions({
  gfm: true,
  breaks: true,
});

const inputValue = ref<string>('');
const outputValue = ref<string>('');
const parsedOutputValue = computed(() => marked.parse(outputValue.value));

const sendMessage = async (message: string) => {
  console.log(message);

  window.electronAPI.onChatStreamChunk((chunk: string) => {
    outputValue.value += chunk;
    console.log('🚀 ~ outputValue:', outputValue);
  });

  window.electronAPI.onChatStreamEnd(() => {
    console.log('Chat stream ended.');
  });

  try {
    await window.electronAPI.startChatStream(message);
  } catch (error) {
    console.error('Error starting chat stream:', error);
  }
};
</script>

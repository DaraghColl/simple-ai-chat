import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  // Function to initiate the chat stream from renderer
  startChatStream: (prompt: string) =>
    ipcRenderer.invoke('stream-chat', prompt),

  // Function to register a listener for chat stream chunks
  onChatStreamChunk: (callback: (chunk: string) => void) => {
    ipcRenderer.on('chat-stream-chunk', (_event, chunk) => callback(chunk));
  },

  // Function to register a listener for the end of the chat stream
  onChatStreamEnd: (callback: () => void) => {
    ipcRenderer.on('chat-stream-end', callback);
  },
});

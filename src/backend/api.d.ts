// This file will be imported by both preload and renderer
export interface IElectronAPI {
  startChatStream: (prompt: string) => Promise<string>;
  onChatStreamChunk: (callback: (chunk: string) => void) => void;
  onChatStreamEnd: (callback: () => void) => void;
}

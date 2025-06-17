import { IElectronAPI } from '../backend/api.d.ts';

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}

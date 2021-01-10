import { WindowSizeInterface } from "@/plugins/windowManager";

export declare global {
  interface Window {
    electronApi: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      addStore(key: string, value: any): void;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      getStore(key: string, defaultValue?: any): any;
      clearStore(): void;
      closeWindow(name: string): void;
      reloadWindow(name: string): void;
      resizeWindow(id: number, size: WindowSizeInterface): void;
      logger: Logger;
    };
  }
}

interface Logger {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  info(arg: any): void;
}

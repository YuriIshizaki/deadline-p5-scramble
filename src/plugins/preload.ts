import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";
import {
  WindowMapInterface,
  WindowSizeInterface
} from "@/plugins/windowManager";
import Store from "electron-store";
import log from "electron-log";

const store = new Store({
  name: "config"
});

contextBridge.exposeInMainWorld("electronApi", {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addStore: (key: string, value: any): void => {
    store.set(key, value);
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getStore: (key: string, defaultValue?: any): any => {
    return store.get(key, defaultValue);
  },
  clearStore: (): void => {
    store.clear();
  },
  closeWindow: (name: string): void => {
    ipcRenderer.send("Main:WindowManager:Close", name);
  },
  reloadWindow: (name: string): void => {
    ipcRenderer.send("Main:WindowManager:Reload", name);
  },
  resizeWindow: (id: number, size: WindowSizeInterface): void => {
    ipcRenderer.send("Main:WindowManager:Resize", id, size);
  },
  setAlwaysOnTop: (id: number, alwaysOnTop: boolean): void => {
    ipcRenderer.send("Main:WindowManager:SetAlwaysOnTop", id, alwaysOnTop);
  },
  logger: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    info: (arg: any): void => {
      log.info(arg);
    }
  }
});

// レンダープロセスからメインプロセスへメッセージング
ipcRenderer.on(
  "WindowManager:Add",
  (event: IpcRendererEvent, data: WindowMapInterface) => {
    ipcRenderer.send("Main:WindowManager:Add", data);
  }
);

ipcRenderer.on(
  "WindowManager:Remove",
  (event: IpcRendererEvent, id: number) => {
    ipcRenderer.send("Main:WindowManager:Remove", id);
  }
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
ipcRenderer.on("PreferenceWindow:Show", (event: IpcRendererEvent) => {
  ipcRenderer.send("Main:PreferenceWindow:Show");
});

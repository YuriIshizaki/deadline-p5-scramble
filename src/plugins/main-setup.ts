import { ipcMain, IpcMainEvent } from "electron";
import { createPreferenceWindow } from "@/plugins/preference";
import {
  windowManager,
  WindowMapInterface,
  WindowSizeInterface
} from "@/plugins/windowManager";
import { WindowNames } from "@/constants/window-name";

/**
 * メインプロセスのイベントリスナー登録
 */
export const mainEventSetup = () => {
  ipcMain.on(
    "Main:WindowManager:Add",
    (event: IpcMainEvent, data: WindowMapInterface) => {
      windowManager.addWindow(data.name, data.id);
    }
  );

  ipcMain.on("Main:WindowManager:Remove", (event: IpcMainEvent, id: number) => {
    windowManager.removeWindow(id);
  });

  // eslint-disable-next-line
  ipcMain.on("Main:PreferenceWindow:Show", (event: IpcMainEvent) => {
    if (windowManager.existPreferenceWindow()) {
      const preferenceWindow = windowManager.getWindow(
        windowManager.getWindowIdByName(WindowNames.Preference)
      );
      if (preferenceWindow) {
        preferenceWindow.focus();
      }
    } else {
      createPreferenceWindow();
    }
  });

  ipcMain.on(
    "Main:WindowManager:Close",
    (event: IpcMainEvent, name: string) => {
      const targetWindow = windowManager.getWindow(
        windowManager.getWindowIdByName(name)
      );
      if (targetWindow) {
        targetWindow.close();
      }
    }
  );

  ipcMain.on(
    "Main:WindowManager:Reload",
    (event: IpcMainEvent, name: string) => {
      const targetWindow = windowManager.getWindow(
        windowManager.getWindowIdByName(name)
      );
      if (targetWindow) {
        targetWindow.reload();
      }
    }
  );

  ipcMain.on(
    "Main:WindowManager:Resize",
    (event: IpcMainEvent, id: number, size: WindowSizeInterface) => {
      windowManager.resizeWindow(id, size);
    }
  );
};

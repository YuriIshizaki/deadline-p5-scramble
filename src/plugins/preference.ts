import { BrowserWindow } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import { WindowNames } from "@/constants/window-name";
import path from "path";

export const createPreferenceWindow = async () => {
  const win = new BrowserWindow({
    width: 800,
    height: 400,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: true,
      preload: path.join(__dirname, "/preload.js")
    },
    transparent: false,
    frame: true,
    resizable: true,
    alwaysOnTop: true,
    title: "Preference"
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL + "#/preference");
    if (!process.env.IS_TEST) {
      win.webContents.openDevTools({
        mode: "undocked"
      });
    }
  } else {
    createProtocol("app");
    await win.loadURL("app://./index.html/#/preference");
  }

  win.on("close", () => {
    win.webContents.send("WindowManager:Remove", win.id);
  });

  win.webContents.send("WindowManager:Add", {
    name: WindowNames.Preference,
    id: win.id
  });
};

"use strict";

import { app, protocol, BrowserWindow, Menu } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
import { WindowNames } from "@/constants/window-name";
import { mainEventSetup } from "@/plugins/main-setup";
import path from "path";
import log from "electron-log";

mainEventSetup();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
process.on("uncaughtException", function(err) {
  log.error(err.message);
  log.error(err.stack);
});

const isDevelopment = process.env.NODE_ENV !== "production";

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } }
]);

let scrambleWindow: BrowserWindow;

async function createWindow() {
  // TODO 複数window対応
  scrambleWindow = new BrowserWindow({
    useContentSize: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: true,
      preload: path.join(__dirname, "preload.js")
    },
    transparent: true,
    frame: false,
    resizable: false,
    hasShadow: false
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    await scrambleWindow.loadURL(
      process.env.WEBPACK_DEV_SERVER_URL + "#/?index=1"
    );
    if (!process.env.IS_TEST) {
      scrambleWindow.webContents.openDevTools({
        mode: "undocked"
      });
    }
  } else {
    createProtocol("app");
    await scrambleWindow.loadURL("app://./index.html/#/?index=1");
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  scrambleWindow.on("close", (event: Electron.Event) => {
    scrambleWindow.webContents.send("WindowManager:Remove", scrambleWindow.id);
  });

  scrambleWindow.webContents.send("WindowManager:Add", {
    name: WindowNames.Main,
    id: scrambleWindow.id
  });
}

app.setAboutPanelOptions({
  applicationName: app.name,
  applicationVersion: app.getVersion(),
  copyright: "Copyright © 2020 Yuri Ishizaki.",
  authors: ["Yuri Ishizaki"],
  website: "https://untitled-diary.net/",
  iconPath: ""
});

// メニュー作成
const template = Menu.buildFromTemplate([
  {
    label: app.name,
    submenu: [
      { role: "about", label: `${app.name}について` },
      { type: "separator" },
      {
        label: "Preference",
        accelerator: "Command+,",
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        click(menuItem, browserWindow, event) {
          if (browserWindow) {
            browserWindow.webContents.send("PreferenceWindow:Show");
          }
        }
      },
      { type: "separator" },
      {
        role: "services",
        label: "サービス",
        submenu: []
      },
      {
        role: "hide",
        label: `${app.name}を隠す`,
        accelerator: "Command+H"
      },
      {
        role: "unhide",
        label: "すべて表示"
      },
      { type: "separator" },
      { role: "quit", label: `${app.name}を終了` }
    ]
  }
]);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on("ready", async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS);
    } catch (e) {
      console.error("Vue Devtools failed to install:", e.toString());
    }
  }
  Menu.setApplicationMenu(template);
  createWindow();
});

if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", data => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}

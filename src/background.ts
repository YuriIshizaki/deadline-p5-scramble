"use strict";

import { app, protocol, BrowserWindow, Menu } from "electron";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
import { createScrambleWindow, defaultAppMenu } from "@/plugins/window";
import { setupMainEvent } from "@/plugins/main-event";
import log from "electron-log";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
process.on("uncaughtException", function(err) {
  log.error(err.message);
  log.error(err.stack);
});

setupMainEvent();

const isDevelopment = process.env.NODE_ENV !== "production";

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } }
]);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let scrambleWindow: BrowserWindow;

app.setAboutPanelOptions({
  applicationName: app.name,
  applicationVersion: app.getVersion(),
  copyright: "Copyright © 2021 Yuri Ishizaki.",
  authors: ["Yuri Ishizaki"],
  website: "https://untitled-diary.net/",
  iconPath: ""
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createScrambleWindow(1).then(createdWindow => {
      scrambleWindow = createdWindow;
    });
  }
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

  Menu.setApplicationMenu(defaultAppMenu);
  createScrambleWindow(1).then(createdWindow => {
    scrambleWindow = createdWindow;
  });
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

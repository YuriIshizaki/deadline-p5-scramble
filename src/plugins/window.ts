import { app, BrowserWindow, Menu, Rectangle } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import { WindowNames } from "@/constants/window-name";
import { scrambleWindowMinSize } from "@/constants/window-size";
import Store from "electron-store";
import path from "path";

const store = new Store<Rectangle>({
  name: "setting"
});

/**
 * Scrambleモードのウィンドウ生成
 * @param {number|string} index
 */
export const createScrambleWindow = async (index: number | string = 0) => {
  const bounds: Rectangle = store.get("scrambleWindowBounds", {
    x: 0,
    y: 0,
    width: scrambleWindowMinSize.width,
    height: scrambleWindowMinSize.height
  });

  // TODO 複数window対応
  const scrambleWindow = new BrowserWindow({
    x: bounds.x,
    y: bounds.y,
    width:
      bounds.width < scrambleWindowMinSize.width
        ? scrambleWindowMinSize.width
        : bounds.width,
    height:
      bounds.height < scrambleWindowMinSize.height
        ? scrambleWindowMinSize.height
        : bounds.height,
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
      process.env.WEBPACK_DEV_SERVER_URL + `#/?index=${index}`
    );
    if (!process.env.IS_TEST) {
      scrambleWindow.webContents.openDevTools({
        mode: "undocked"
      });
    }
  } else {
    createProtocol("app");
    await scrambleWindow.loadURL(`app://./index.html/#/?index=${index}`);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  scrambleWindow.on("close", (event: Electron.Event) => {
    const currentBounds = scrambleWindow.getBounds();
    store.set("scrambleWindowBounds", currentBounds);

    scrambleWindow.webContents.send("WindowManager:Remove", scrambleWindow.id);
  });

  scrambleWindow.webContents.send("WindowManager:Add", {
    name: WindowNames.Main,
    id: scrambleWindow.id
  });

  return scrambleWindow;
};

/**
 * デフォルトのアプリケーションバーのメニュー定義
 */
export const defaultAppMenu: Menu = Menu.buildFromTemplate([
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

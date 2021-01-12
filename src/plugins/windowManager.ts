import { BrowserWindow } from "electron";

export interface WindowMapInterface {
  name: string;
  id: number;
}

export interface WindowSizeInterface {
  height: number;
  width: number;
}

class WindowManager {
  private _allWindows: WindowMapInterface[] = [];

  addWindow(name: string, id: number) {
    this._allWindows.push({
      name: name,
      id: id
    });
  }

  removeWindow(id: number): void {
    for (let i = 0; i < this.allWindows.length; i++) {
      if (this.allWindows[i].id === id) {
        this.allWindows.splice(i, 1);
        break;
      }
    }
  }

  getWindow(id: number): BrowserWindow | null {
    let result = null;

    const windows = BrowserWindow.getAllWindows();
    windows.forEach(openedWindow => {
      if (openedWindow.id === id) {
        result = openedWindow;
      }
    });

    return result;
  }

  getWindowIdByName(name: string): number {
    let result = 0;
    this.allWindows.forEach(openedWindow => {
      if (openedWindow.name === name) {
        result = openedWindow.id;
      }
    });

    return result;
  }

  get allWindows() {
    return this._allWindows;
  }
}

export const windowManager = new WindowManager();

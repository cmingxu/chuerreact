import Store from "electron-store";
import "@babel/polyfill";

// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

// main window instance, default null
let mainWindow = null;
let store = new Store();

// envrionment setup
process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";

// create main window
const createWindow = async () => {
  const { screen } = require("electron");
  const height = screen.getPrimaryDisplay().bounds.height;
  const width = screen.getPrimaryDisplay().bounds.width;
  mainWindow = new BrowserWindow({
    width: height,
    height: width,
    title: store.get("title"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      contextIsolation: true,
      enableRemoteModule: true,
      nodeIntegrationInWorker: true,
      partition: store.get("sessionKey"),
      webSecurity: false
    }
  });

  await mainWindow.loadURL(store.get("firstLaunchPageURL"));

  mainWindow.webContents.openDevTools();
  const filters = {urls: [
    "https://fxg.jinritemai.com/ffa/g/comment*"
  ]};

  mainWindow.webContents.session.webRequest.onCompleted(filters, (details, callback) => {
    mainWindow.webContents.send("OnOrderListRequest", details)
  });
};

const initStore = () => {
  store.set(
    "firstLaunchPageURL",
    "https://fxg.jinritemai.com/ffa/g/comment" // 评论页面地址
  );
  store.set("debug", true);
  store.set("title", "花红绿色");
  store.set("version", "v0.0.1");
  store.set("sessionKey", "persist:chuyiweithreact");
};

const main = async () => {
  // ensure initial default setting
  initStore();

  app.whenReady().then(() => {
    createWindow();

    app.on("activate", function () {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });

  app.on("window-all-closed", function () {
    if (process.platform !== "darwin") app.quit();
  });

};

main().catch(err => {});

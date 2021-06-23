import Store from "electron-store";

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
      title: "订单快速提取",
      partition: store.get("sessionKey"),
      webSecurity: false
    }
  });

  await mainWindow.loadURL(store.get("firstLaunchPageURL"));

  mainWindow.webContents.openDevTools();
  const filters = {
    urls: ["https://fxg.jinritemai.com/product/tcomment/commentList*"]
  };

  mainWindow.webContents.session.webRequest.onCompleted(
    filters,
    (details, callback) => {
      mainWindow.webContents.send("OnCommentListRequest", details);
    }
  );

  // Modify the user agent for all requests to the following urls.
  const filter = {
    urls: ["*://*/*"]
  };
  const defaultUA =
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.13; rv:88.0) Gecko/20100101 Firefox/88.0";
  session.defaultSession.webRequest.onBeforeSendHeaders(
    filter,
    (details, callback) => {
      details.requestHeaders["User-Agent"] = defaultUA;
      callback({ requestHeaders: details.requestHeaders });
    }
  );
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

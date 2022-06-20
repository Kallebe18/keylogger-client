const { app, BrowserWindow, globalShortcut } = require("electron");
const { GlobalKeyboardListener } = require("node-global-key-listener");

const { io } = require("socket.io-client");
const keyboardListener = new GlobalKeyboardListener();

function createWindow() {
  const window = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      enableRemoteModule: true,
    },
  });
  window.setMenuBarVisibility(false);
  window.webContents.openDevTools();
  window.hide();

  const client = io("http://localhost:3010");
  keyboardListener.addListener((e) => {
    if (e.state == "UP") {
      client.emit("key_released", e.name);
    }
  });
}

app.on("ready", createWindow);

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function () {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

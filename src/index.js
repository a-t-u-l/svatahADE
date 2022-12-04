const { app, BrowserWindow, ipcMain } = require('electron');
const menuOptions = require("./../menu");
const title = 'Svatah ADE';
const windowWidth = 1200;
const windowHeight = 800;
const isWindows = process.platform === "win32";
const animationWidth = 300;
const animationHeight = 150;
const path = require('path');

let serverProcess = null;
let mainWindow = null;

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
}
else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.show();
      mainWindow.focus();
    }
  });
}

const fs = require('fs-extra');
let files = fs.readdirSync(app.getAppPath() + '/jar');
let filename = null;
for (let i in files) {
  if (path.extname(files[i]) === '.jar') {
    filename = path.basename(files[i]);
    break;
  }
}
if (!filename) {
  setTimeout(function () {
    app.exit()
  }, 1000);
  throw new Error('The Application could not be started');
}
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const startSvatahADE = () => {
  const loadingWindow = new BrowserWindow({
    show: false
    , frame: false
    , title: title
    , width: animationWidth
    , height: animationHeight
  });
  loadingWindow.loadURL(app.getAppPath() + '/src/loading.html');
  loadingWindow.webContents.once('dom-ready', () => {
    loadingWindow.show();
  });

  serverProcess = require('./javaProcess').startJavaServer(app.getAppPath(), filename);
  const appUrl = 'http://localhost:8095';

  const createMainView = function () {
    mainWindow = new BrowserWindow({
      title: title
      , width: windowWidth
      , height: windowHeight
      , minHeight: 640
      , minWidth: 1080
      , frame: true
      , webPreferences: {
        preload: path.join(app.getAppPath(), "preload.js"),
        nodeIntegration: true,
        contextIsolation: false
      }
    });
    mainWindow.loadURL(appUrl);
    //const devtools = new BrowserWindow();
    //mainWindow.webContents.setDevToolsWebContents(devtools.webContents);
    //mainWindow.webContents.openDevTools({ mode: 'detach' });

    mainWindow.webContents.once('dom-ready', () => {
      const dbClient = require('./js/dbclient');
      dbClient.initDB();
      console.log('main loaded');
      mainWindow.loadFile('./src/html/viewManager.html');
      loadingWindow.hide()
      loadingWindow.close()
      mainWindow.show();
      mainWindow.maximize();
      console.log('showing main window');
    });

    mainWindow.on('closed', function () {
      mainWindow = null;
    });

    const menu = menuOptions.mainMenu(mainWindow, serverProcess);

    ipcMain.on(`display-app-menu`, function (e, args) {
      if (isWindows && mainWindow) {
        menu.popup({
          window: mainWindow,
          x: args.x,
          y: args.y
        });
      }
    });
  };

  const startUp = () => {
    require('minimal-request-promise')
    .get(appUrl)
    .then(function (response) {
      console.log('Server started!');
      createMainView();
    }, function (response) {
      console.log('Waiting for the server start...');
      setTimeout(function () {
        startUp();
      }, 200);
    });
  };

  startUp();
}

app.whenReady().then(() => {
  startSvatahADE();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      startSvatahADE();
    }
  });
});

app.on('before-quit', () => {
  console.log("killing server with pid : " + serverProcess.pid)
  serverProcess.kill();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
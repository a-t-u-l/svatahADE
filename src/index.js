const { app, remote, BrowserWindow, globalShortcut } = require('electron');
const Menu = require('electron').Menu
const path = require('path');

const title = 'Svatah ADE';
const port = 8095;
const apppath = '';
const windowWidth = 1200;
const windowHeight = 800;
const animationWidth = 300;
const animationHeight = 150;
const javaVMParameters = []; //['-Dserver.port=' + port, '-Dtest=test'];
const windowsJavaPath = 'java.exe';
const darwinJavaPath = 'java';

let mainWindow = null;
let serverProcess = null;

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

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.

const createWindow = () => {
  let loading = new BrowserWindow({
    show: false
    , frame: false
    , title: title
    , width: animationWidth
    , height: animationHeight
  });
  loading.loadURL(app.getAppPath() + '/src/loading.html');
  loading.webContents.once('dom-ready', () => {
    loading.show();
  });
  let platform = process.platform;
  var javaPath = 'java';
  if (platform === 'win32') {
    javaPath = windowsJavaPath;
  }
  else if (platform === 'darwin') {
    javaPath = darwinJavaPath;
  }
  console.log(['-jar'].concat(javaVMParameters).concat(filename));
  serverProcess = require('child_process').spawn(javaPath, ['-jar'].concat(javaVMParameters).concat(filename), {
    cwd: app.getAppPath() + '/jar'
  });
  const dir = app.getAppPath() + '/bin/'
  if (!fs.existsSync(dir)) {
    console.log('creating bin ...')
    fs.mkdirSync(dir);
  }
  serverProcess.stdout.pipe(fs.createWriteStream(dir + 'jvm.log', {
    flags: 'a'
  })); // logging
  serverProcess.on('error', (code, signal) => {
    setTimeout(function () {
      app.exit()
    }, 1000);
    throw new Error('The Application could not be started');
  });
  console.log('Server PID: ' + serverProcess.pid);
  let appUrl = 'http://localhost:' + port + apppath;
  const openWindow = function () {
    mainWindow = new BrowserWindow({
      title: title
      , width: windowWidth
      , height: windowHeight
      , frame: true
      , webPreferences: {
        nodeIntegration: true
      }
    });
    mainWindow.loadURL(appUrl);
    //mainWindow.webContents.openDevTools();
    mainWindow.webContents.once('dom-ready', () => {
      const dbClient = require('./js/dbclient');
      // const location = (app || remote).getPath('userData')
      // console.log('user loc : ' + location)
      // if (fs.existsSync(location + '/svatahADE/docs/') == false) {
      //   console.log('copying from :' + app.getAppPath() + '/docs/ , to loc : ' + location + '/svatahADE/docs/')
      //   fs.copySync(app.getAppPath() + '/docs/', location + '/svatahADE/docs/')
      // }
      // else{
      //   console.log('exist at : ' + location + '/svatahADE/docs/')
      // }
      dbClient.initDB();
      console.log('main loaded')
      mainWindow.loadFile(app.getAppPath() + '/src/html/project.html');
      loading.hide()
      loading.close()
      mainWindow.show()
    })
    mainWindow.on('closed', function () {
      mainWindow = null;
    });
    mainWindow.on('close', function (e) {
      if (serverProcess) {
        var choice = require('electron').dialog.showMessageBox(this, {
          type: 'question'
          , buttons: ['Yes', 'No']
          , title: 'Confirm'
          , message: 'Do you really want to exit?'
        });
        if (choice == 1) {
          e.preventDefault();
        }
      }
    });
  };
  const startUp = function () {
    const requestPromise = require('minimal-request-promise');
    requestPromise.get(appUrl).then(function (response) {
      console.log('Server started!');
      openWindow();
    }, function (response) {
      console.log('Waiting for the server start...');
      setTimeout(function () {
        startUp();
      }, 200);
    });
  };
  startUp();
  createMenu();
  // Register a shortcut listener.
  const ret = globalShortcut.register('CommandOrControl+Shift+`', () => {
    console.log('Bring to front shortcut triggered');
    if (mainWindow) {
      mainWindow.focus();
    }
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
  else {
    console.log("killing server with pid : " + serverProcess)
    serverProcess.kill();
  }
});

app.on('will-quit', () => {
  // Unregister all shortcuts.
  globalShortcut.unregisterAll();
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
function createMenu() {
  const application = {
    label: app.getName(),
    submenu: [
      {
        label: "Home",
        accelerator: "Command+H",
        click: () => {
          mainWindow.loadFile(app.getAppPath() + '/src/html/project.html')
        }
      },
      {
        type: "separator"
      },
      {
        label: "ToS",
        accelerator: "Command+T",
        click: () => {
          mainWindow.loadURL('https://www.svatah.in/tos')
        }
      },
      {
        type: "separator"
      },
      {
        label: "About",
        click: () => {
          require('electron').dialog.showMessageBox(null, {
            type: 'info'
            , title: 'Svatah ADE'
            , message: 'v 1.0.2'
          });
        }
      },
      {
        type: "separator"
      },
      {
        label: "Quit",
        accelerator: "Command+Q",
        click: () => {
          console.log("killing server with pid : " + serverProcess.pid)
          serverProcess.kill()
          app.quit()
        }
      }
    ]
  }

  const edit = {
    label: "Edit",
    submenu: [
      {
        label: "Undo",
        accelerator: "CmdOrCtrl+Z",
        selector: "undo:"
      },
      {
        label: "Redo",
        accelerator: "Shift+CmdOrCtrl+Z",
        selector: "redo:"
      },
      {
        type: "separator"
      },
      {
        label: "Cut",
        accelerator: "CmdOrCtrl+X",
        selector: "cut:"
      },
      {
        label: "Copy",
        accelerator: "CmdOrCtrl+C",
        selector: "copy:"
      },
      {
        label: "Paste",
        accelerator: "CmdOrCtrl+V",
        selector: "paste:"
      },
      {
        label: "Select All",
        accelerator: "CmdOrCtrl+A",
        selector: "selectAll:"
      }
    ]
  }

  const template = [
    application,
    edit
  ]

  Menu.setApplicationMenu(Menu.buildFromTemplate(template))
}
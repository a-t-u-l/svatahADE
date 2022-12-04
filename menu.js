const electron = require("electron");
const app = electron.app;
const Menu = electron.Menu;

const isMac = process.platform === "darwin";

let mainWindow, serverProcess;

const application = {
    label: "File",
    submenu: [
        {
            label: "Home",
            accelerator: "Command+H",
            click: () => {
                mainWindow.loadFile(require.resolve('./src/html/viewManager.html'))
            }
        },
        {
            type: "separator"
        },
        {
            label: "ToS",
            accelerator: "Command+T",
            click: () => {
                mainWindow.loadURL('https://www.svatah.com/tos')
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
                //console.log("killing server with pid : " + serverProcess.pid)
                //serverProcess.kill()
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

function setMainMenu(mainWin, srvrProcess){
    mainWindow = mainWin;
    serverProcess = srvrProcess;
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
    return menu;
}

module.exports = { 
    mainMenu : (mainWindow, srvrProcess) => { 
        return setMainMenu(mainWindow, srvrProcess); 
    }
}
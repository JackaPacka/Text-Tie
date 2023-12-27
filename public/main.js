const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 400,
        height: 550,
        resizable: false,
        icon: path.join(__dirname, './assets/icon.ico'),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
    });

    mainWindow.removeMenu();
    mainWindow.loadFile(path.join(__dirname, "./index.html")).then(r => console.log("Done!"));
}

app.whenReady().then(createWindow);

const fileBuilder = require('./assets/fileBuilder.js');

ipcMain.handle('open-directory-dialog', async (event) => {
    const result = await dialog.showOpenDialog({
        properties: ['openDirectory']
    });
    return result.filePaths[0];
});

ipcMain.handle('open-export-directory-dialog', async (event) => {
    const result = await dialog.showOpenDialog({
        properties: ['openDirectory']
    });
    return result.filePaths[0];
});

ipcMain.handle('build-file', async (event, directoryPath, fileExtensions, exportLocation) => {
    try {
        fileBuilder.buildFile(directoryPath, fileExtensions, exportLocation);
        return { success: true };
    } catch (error) {
        return { success: false, message: error.message };
    }
});

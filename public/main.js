const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 600,
        height: 700,

        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    mainWindow.removeMenu();
    mainWindow.loadFile(path.join(__dirname, "../build/index.html"));
}

app.whenReady().then(createWindow);

const fileBuilder = require('../src/fileBuilder.js');

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

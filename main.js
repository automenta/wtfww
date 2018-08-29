const {app, BrowserWindow} = require('electron');

const path = require('path');

let mainWindow; //do this so that the window object doesn't get GC'd

// can't create a BrowserWindow until `ready` is fired
app.on('ready', function () {
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: false,
            preload: path.join(__dirname, 'preload.js'),
            webSecurity: false
        }
    });

    mainWindow.loadURL(
        //	'file://' + path.join(__dirname, 'index.html')
        'http://en.wikipedia.org'
    );

    mainWindow.webContents.openDevTools();
});

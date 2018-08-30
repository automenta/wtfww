const {app, BrowserWindow, ipcMain } = require('electron');


const path = require('path');

let mainWindow; //do this so that the window object doesn't get GC'd

// can't create a BrowserWindow until `ready` is fired
app.on('ready', function () {


    ipcMain.on('tag', (event, props) => {
        console.log(`Message received from webview ${JSON.stringify(props)}`);
    });

     mainWindow = new BrowserWindow({

     });
     mainWindow.loadURL(
         'file://' + path.join(__dirname, 'index.html')
     );

    // mainWindow = new BrowserWindow({
    //     webPreferences: {
    //         nodeIntegration: false,
    //         preload: path.join(__dirname, 'preload.js'),
    //         webSecurity: false
    //     }
    // });
    //
    // mainWindow.loadURL(
    //     //	'file://' + path.join(__dirname, 'index.html')
    //     'http://en.wikipedia.org'
    // );
    //
     mainWindow.webContents.openDevTools();
});

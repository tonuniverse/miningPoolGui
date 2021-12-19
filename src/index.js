/*
miningPoolGui – open-source GUI wrapper of github.com/tonuniverse/miningPoolCli

Copyright (C) 2021 tonuniverse.com

This file is part of miningPoolGui.

miningPoolGui is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

miningPoolGui is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with miningPoolGui.  If not, see <https://www.gnu.org/licenses/>.
*/

import { app, BrowserWindow, ipcMain } from 'electron';
import { execFile, spawn } from 'child_process';
const AutoLaunch = require('auto-launch');
const fs = require("fs");
var os = require("os");
const axios = require('axios');
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
    app.quit();
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

let url = `file://${__dirname}/login.html`;



let login = function() {
    console.log("start")
}

const createWindow = async() => {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 700,
        resizable: false,
        darkTheme: true,
        center: true,
        autoHideMenuBar: true,
        titleBarStyle: 'hidden',
        title: "Ton Universe",
        icon: __dirname + '/logo_256.ico',
        backgroundColor: "#000000FF",
        transparent: true,
        // frame: false
        // titleBarStyle: 'hidden',
        // fullscreenBoolean: false,
        // titleBarOverlay: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
            experimentalFeatures: true
        },
        frame: false
    });

    try {
        await fs.readFileSync('data', 'utf8');
        url = `file://${__dirname}/index.html`;
    } catch (error) {

    }
    // and load the index.html of the app.
    mainWindow.loadURL(url);

    // Open the DevTools.
    // mainWindow.webContents.openDevTools();



    // Emitted when the window is closed.
    mainWindow.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        kill();
        mainWindow = null;
    });

    mainWindow.on('close', async(e) => {
        kill()
    });



    let autoLaunch = new AutoLaunch({
        name: 'Ton Universe',
        path: app.getPath('exe'),
    });
    autoLaunch.isEnabled().then((isEnabled) => {
        if (!isEnabled) autoLaunch.enable();
    });

    // console.dir(app.getGPUFeatureStatus());
    // console.dir(app.getAppMetrics());

    // app.getGPUInfo('basic').then(basicObj => {
    //     console.dir(basicObj);
    // });

    // app.getGPUInfo('complete').then(completeObj => {
    //     console.dir(completeObj.auxAttributes.glRenderer);
    // });





    // console.log(os.cpus())

    // var bytesAvailable = os.totalmem(); // returns number in bytes
    // // 1 mb = 1048576 bytes
    // console.log("Total memory available MB :" + (bytesAvailable / 1048576));

};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    kill()
        // On OS X it is common for applications and their menu bar
        // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        // kill().then(() => {
        app.quit();
        // });

    }
});

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }
});

let process1;
// spawn('ls', ['-lh', '/usr']);
async function run(data) {
    if (process1) {
        kill()
    }
    process1 = spawn(
        process.cwd() + `/cli/miningPoolCli.exe`, [
            '-serve-stat',
            '-pool-id=' + data.user.token,
            '-handle-kill'
        ], { timeout: 0, cwd: './cli/' },
        (error, stdout, stderr) => {
            console.log(error)
            console.log(stdout)
            console.log(stderr)
        });

    // process1 = execFile(
    //     'cmd',
    //     process.cwd() + `/cli/miningPoolCli.exe` +
    //     ' -serve-stat' +
    //     ' -pool-id=' + data.user.token, { timeout: 0, cwd: './cli/' },
    //     (error, stdout, stderr) => {
    //         console.log(error)
    //         console.log(stdout)
    //         console.log(stderr)
    //     });



}

async function kill() {

    fs.readFile('./cli/serveraddr.txt', 'utf8', function(error, fileContent) {
        if (error) {
            // throw error
            console.log(error)
        } else {
            axios.post('http://' + fileContent + '/kill')
                .then(function(response) {
                    console.log(response.data)
                    return true;
                })
        }
    });

    // if (process1) {
    //     process1.kill();
    // }
}



ipcMain.handle('some-name', async(event, someArgument) => {
    // const result = await doSomeWork(someArgument)



    // console.log(someArgument)

    if (someArgument.data === "start") {
        run(someArgument)
    } else {
        kill()
    }


    // return result
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
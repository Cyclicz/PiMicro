/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-commonjs */

require('v8-compile-cache');

const { app, BrowserWindow, ipcMain, protocol, screen, session } = require('electron');
const path = require('path');
const Store = require('electron-store');

const args = process.argv.slice(1);
const big = args.some(val => val === '--big');
const dev = args.some(val => val === '--serve');

const activateListeners = require('./helper/listener');

let window;
let url;

if (!dev) {
    const createProtocol = require('./helper/protocol');
    const scheme = 'app';

    protocol.registerSchemesAsPrivileged([{ scheme: scheme, privileges: { standard: true } }]);
    createProtocol(scheme, path.join(__dirname, 'dist'));
}

app.commandLine.appendSwitch('touch-events', 'enabled');

function createWindow() {
    const _store = new Store();

    if (!dev) {
        session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
            callback({
                responseHeaders: {
                    ...details.responseHeaders,
                },
            });
        });
    }

    const mainScreen = screen.getPrimaryDisplay();

    window = new BrowserWindow({
        width: dev ? (big ? 1500: 1200) : mainScreen.size.width,
        height: dev ? (big ? 600 : 450) : mainScreen.size.height,
        frame: dev,
        backgroundColor: '#0C0D0E',
        webPrefrences: {
            nodeIntegreation: true,
            enableRemoteModule: true,
            worldSafeExecuteJavaScript: true,
            contextIsolation: false,
        },
    });

    if (dev) {
        url = 'http://localhost:4200';
        window.webContents.openDevTools();
    } else {
        url = `file://${__dirname}/dist/en/index.html`;
        window.setFullScreen(true);
    }

    window.loadURL(url);
    activateListeners();

    window.on('closed', () => {
        window = null;
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    app.quit();
});

app.on('activate', () => {
    if (window === null) {
        createWindow();
    }
});

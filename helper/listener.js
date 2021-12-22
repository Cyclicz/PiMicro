/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-commonjs */
const exec = require('child_process').exec;

const { readConfig, saveConfig, checkConfig } = require('./config');

function activateConfigListener(ipcMain, window) {
    ipcMain.on('readConfig', () => readConfig(window));
    ipcMain.on('saveConfig', (_, config) => saveConfig(window, config));
    ipcMain.on('checkConfig', (_, config) => checkConfig(window, config));
}

function activateListeners(ipcMain, window, app, url) {
    activateConfigListener(ipcMain, window);
}

module.exports = activateListeners;

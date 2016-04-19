'use strict';

const electron = require('electron');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

var ipcMain = electron.ipcMain;

//IBM Watson S2T Requirements
var express = require('express'),
  watsonApp = express(),
  vcapServices = require('vcap_services'),
  extend = require('util')._extend,
  watson = require('watson-developer-cloud');

var fs = require("fs"),
    path = require("path");

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

//Shoots back the youtube video url from the webview to the renderer
ipcMain.on('videoDOM', function(event, arg) {
  console.log("Message received!");
  mainWindow.webContents.send('youtubeMusicSrc', arg);
});


function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 1600, height: 1200, kiosk: true});
  mainWindow.setMenu(null);

  // and load the index.html of the app.
  mainWindow.loadURL('file://' + __dirname + '/mirror_home/index.html');

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});


// load environment properties from a .env file for local development
require('dotenv').load({silent: true});
// Bootstrap application settings
require('./config/express')(watsonApp);

// For local development, replace username and password
var config = extend({
  version: 'v1',
  url: 'https://stream.watsonplatform.net/speech-to-text/api',
  username: process.env.STT_USERNAME || '6b9ca230-5814-4d17-a99c-22a9dcb77625',
  password: process.env.STT_PASSWORD || 'Xm0dkjubgeOZ'
}, vcapServices.getCredentials('speech_to_text'));

var authService = watson.authorization(config);

watsonApp.get('/', function(req, res) {
  console.log("Get shit");
  res.render('index', {
    ct: req._csrfToken,
    GOOGLE_ANALYTICS_ID: process.env.GOOGLE_ANALYTICS_ID
  });
});

// Get token using your credentials
watsonApp.post('/api/token', function(req, res, next) {
  authService.getToken({url: config.url}, function(err, token) {
    if (err)
      next(err);
    else
      console.log(token);
      res.send(token);
  });
});

// error-handler settings
require('./config/error-handler')(watsonApp);

module.exports = watsonApp;

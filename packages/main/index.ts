import './rpc-apis/app-rpc';

import { app, BrowserWindow, shell } from 'electron';
import { release } from 'os';
import { join } from 'path';

process.env.ELECTRON_ENABLE_LOGGING = '1';

//handle crashes and kill events
process.on('uncaughtException', function(err) {
  //log the message and stack trace
  console.log(err);
});

global.XMLHttpRequest = require('xhr2');

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

let win: BrowserWindow | null = null

async function createWindow() {
  win = new BrowserWindow({
    title: 'Main window',
    webPreferences: {
      contextIsolation: true,
      preload: join(__dirname, '../preload/index.cjs')
    },
  })

  //win.webContents.openDevTools();

  if (app.isPackaged) {
    win.loadFile(join(__dirname, '../renderer/index2.html'))
  } else {

  //  // 🚧 Use ['ENV_NAME'] avoid vite:define plugin
    const url = `http://localhost:${process.env['VITE_DEV_SERVER_PORT']}`

    win.loadURL(url);
    win.maximize();
  }
  win.webContents.on('did-fail-load', console.log);
  win.webContents.on('did-fail-provisional-load', console.log);
  // Test active push message to Renderer-process
  win.webContents.on('did-finish-load', () => {
    console.log('YO!');

    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })
}
app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})

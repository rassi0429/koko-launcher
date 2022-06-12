import { app, BrowserWindow, ipcMain } from 'electron';
import { join } from 'path';
import fs from "fs/promises"
const Tail = require('tail-file');

let mainWindow: BrowserWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    }
  });

  if (process.env.NODE_ENV === 'development') {
    const rendererPort = process.argv[2];
    mainWindow.loadURL(`http://localhost:${rendererPort}`);
  }
  else {
    mainWindow.loadFile(join(app.getAppPath(), 'renderer', 'index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
});

let pid = null

ipcMain.on('message', async (event, message) => {
  console.log(message);
  if (message.command === "launch") {
    const beforeList = await fs.readdir("./Logs")
    console.log(beforeList.length)
    pid = require('child_process').exec("C:\\Neos\\app\\Neos.exe -Screen -SkipIntroTutorial -DontAutoOpenCloudHome -DataPath C:\\Neos\\DataDir").pid
    console.log(pid)
    catchLog(beforeList)
  }
})

function catchLog(beforelist: string[]) {
  const watchInterval = setInterval(async () => {
    const list = await fs.readdir("./Logs")
    console.log(beforelist.length, list.length)
    if (beforelist.length === list.length) {
      console.log("nai")
    } else {
      console.log("atta")
      const file = list.filter(i => beforelist.indexOf(i) == -1)
      console.log(file)
      clearInterval(watchInterval)

      const mytail = new Tail("./Logs/" + file[0], line => {
        console.log( line );
        sendLog(line)
      });

      setInterval(async () => {
        await fs.readFile("./Logs/" + file[0])
      }, 100)
    }
  }, 500)
}


function sendLog(data) {
  mainWindow.webContents.send("neosLog", data)
} 
import {contextBridge, ipcRenderer} from 'electron';

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: ipcRenderer,
  on: (channel, callback) => ipcRenderer.on(channel, (event, argv)=>callback(event, argv))
})

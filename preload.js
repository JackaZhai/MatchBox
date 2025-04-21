const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    // 允许渲染器监听来自主进程的消息
    onSelectedText: (callback) => ipcRenderer.on('selected-text', (_event, value) => callback(value)),
    onScreenshotTaken: (callback) => ipcRenderer.on('screenshot-taken', (_event) => callback())
    // 如果需要从渲染器向主进程发送消息，可以在这里添加方法
    // send: (channel, data) => ipcRenderer.send(channel, data),
});

console.log('preload.js loaded');

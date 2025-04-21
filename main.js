const { app, BrowserWindow, globalShortcut, clipboard, desktopCapturer, nativeImage } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true, // 推荐的安全设置
            nodeIntegration: false // 推荐的安全设置
        }
    });

    mainWindow.loadFile('index.html');

    // 可选：打开开发者工具
    // mainWindow.webContents.openDevTools();

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

async function takeScreenshot() {
    try {
        const sources = await desktopCapturer.getSources({ types: ['screen'], thumbnailSize: { width: 1920, height: 1080 } }); // 调整尺寸以适应主屏幕
        if (sources && sources.length > 0) {
            // 假设第一个屏幕是主屏幕
            const primaryScreenSource = sources[0];
            // 创建 nativeImage
            const image = nativeImage.createFromBitmap(primaryScreenSource.thumbnail.toBitmap(), {
                width: primaryScreenSource.thumbnail.getSize().width,
                height: primaryScreenSource.thumbnail.getSize().height
            });
            // 复制到剪贴板
            clipboard.writeImage(image);
            console.log('Screenshot copied to clipboard.');
            // 可选：给用户一些视觉反馈
            if (mainWindow) {
                mainWindow.webContents.send('screenshot-taken');
            }
        } else {
            console.error('No screen sources found.');
        }
    } catch (error) {
        console.error('Failed to take screenshot:', error);
    }
}


function querySelectedWord() {
    // 尝试读取当前选择的文本（可能不适用于所有应用/操作系统）
    const selectedText = clipboard.readText('selection');
    console.log('Selected text:', selectedText);
    if (selectedText && mainWindow) {
        // 将选定的文本发送到渲染器进程
        mainWindow.webContents.send('selected-text', selectedText);
    } else if (!selectedText) {
        console.log('No text selected or selection clipboard not supported.');
         if (mainWindow) {
            mainWindow.webContents.send('selected-text', '-- 无选中文本 --');
         }
    }
}

app.whenReady().then(() => {
    createWindow();

    // 注册截图快捷键 (例如：Ctrl+Shift+S)
    const retScreenshot = globalShortcut.register('CommandOrControl+Shift+S', () => {
        console.log('Screenshot shortcut pressed');
        takeScreenshot();
    });

    if (!retScreenshot) {
        console.error('Failed to register screenshot shortcut');
    }

    // 注册查询单词快捷键 (例如：Ctrl+Shift+D)
    const retQuery = globalShortcut.register('CommandOrControl+Shift+D', () => {
        console.log('Query word shortcut pressed');
        querySelectedWord();
    });

    if (!retQuery) {
        console.error('Failed to register query word shortcut');
    }

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('will-quit', () => {
    // 注销所有快捷键
    globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

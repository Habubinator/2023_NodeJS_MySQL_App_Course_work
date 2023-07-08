const { app, BrowserWindow } = require('electron')

function createWindow() {
    // Создаем окно браузера.
    const win = new BrowserWindow({
        width: 1280,
        height: 720,
        webPreferences: {
            enableRemoteModule: true,
            nodeIntegration: true,
            contextIsolation: false
        },
        resizable: false
    })


    win.loadFile('index.html')

    win.webContents.setWindowOpenHandler(({ url }) => {
        return {
            action: 'allow',
            overrideBrowserWindowOptions: {
                width: 640,
                height: 480,
                fullscreenable: false,
                webPreferences: {
                    enableRemoteModule: true,
                    nodeIntegration: true,
                    contextIsolation: false
                },
                resizable: false
            }
        }
    })
    // Отображаем средства разработчика.
    //win.webContents.openDevTools()
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})
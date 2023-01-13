const { app, BrowserWindow } = require('electron');

function createWindow () {
  // Crea una ventana de navegador.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // Carga la página principal de la aplicación.
  win.loadFile('src/front/index.html')
};

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
});
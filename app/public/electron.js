const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const url = require("url"); // Agrega esta línea para manejar URLs locales

// * Ventana
function crearVentana() {
  // Componentes
  const mainWindow = new BrowserWindow({
    width: 700,
    height: 400,
    fullscreen: false, // Pantalla completa
    frame: true, // Barra de título
    icon: path.join(__dirname, "logo192.png"),
    center: true,
    fullscreenable: true,
    minWidth: 300,
    minHeight: 300,
  });

  // Ventana de desarrollador (descomenta para entorno de desarrollo)
  // mainWindow.webContents.openDevTools();

  // * Producción
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "index.html"),
      protocol: "file:",
      slashes: true,
    })
  );

  // Pruebas
  // mainWindow.loadURL("http://localhost:3000");

  // Tamaño de la ventana automático
  mainWindow.webContents.on("did-finish-load", () => {
    mainWindow.setContentSize(800, mainWindow.getContentSize()[1]);
  });

  // Mostrar ventana al estar lista
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });
}

// * Main electron
app.whenReady().then(() => {
  // Manejar solicitudes del proceso principal
  ipcMain.on("solicitud-accion-mainprocess", (evento, argumentos) => {
    console.log("Argumentos: ", argumentos);
  });

  // Ventana
  crearVentana();

  // Evento de activación (macOS): crear una ventana cuando se hace clic en el ícono del dock
  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      crearVentana();
    }
  });
});

// * Evento al cerrar ventanas
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

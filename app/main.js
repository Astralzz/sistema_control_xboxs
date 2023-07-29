const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

// * Ventana
function crearVentana() {
  // Componentes
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    fullscreen: false, // ? Pantalla completa
    frame: true, // ? Barra de titulo
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // Ventana de desarrollador
  mainWindow.webContents.openDevTools();

  // index.html | puerto
  mainWindow.loadURL("http://localhost:3000");

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

// SUGERENCIA: Para una mejor organización, puedes separar el código específico del proceso principal en otro archivo.
// Por ejemplo, puedes crear un archivo "main-process.js" y mover la lógica relacionada con el proceso principal allí.
// Luego, requerir el archivo aquí:
// require("./main-process.js");

# AÑADIR ELECTRON A REACT

---

## PASO 1 - INSTALAR ELECTRON EN NUESTRO PROYECTO

Teniendo un proyecto de react necesitamos instalar las librerías de [electron](https://www.npmjs.com/package/electron) y [electron-builder](https://www.npmjs.com/package/electron-builder) usando npm o yar y instalarlas en la sección de devDependencies de nuestro package.json

### 1 Instalar electron y electron-builder en devDependencies

Teniendo la consola ubicada en tu proyecto instala electron y electron-builder en devDependencies

electron

```cmd
npm install electron --save-dev
```

electron-builder

```cmd
npm install electron-builder --save-dev
```

### 2 Verificar en nuestro package.json que las librerías estén en devDependencies

Una ves instaladas nuestras librerías necesitamos verificar que estén dentro de devDependencies y no dentro de dependencies, nos dirigimos al archivo package.json y comprobamos.

Bien **(solo dentro de devDependencies)**:

```json
{
  "name": "...",
  "description": "....",
  "author": ".....",
  "version": "....",
  "private": "...",
  "main": "....",
  /*nuestras librerías/dependencias sin tener electron ni electron-builder dentro*/
  "dependencies": {
   "... ": "....."
  },
  "scripts": {
   "... ": "....."
  },
  "eslintConfig": {
    "extends": ["...", ....]
  },
  "browserslist": {
    "production": ["...", ....],
    "development": [
      ".....", ....
    ]
  },
    /*nuestras librerías/dependencias en dev, teniendo electron y electron-builder dentro*/
  "devDependencies": {
    "otras librerías": "....",
    "electron": "^25.3.2",
    "electron-builder": "^24.6.3",
  }
}
```

Mal **(dentro de devDependencies y dependencies al mismo tiempo o en ninguno)**:

```json
{
  "name": "...",
  "description": "....",
  "author": ".....",
  "version": "....",
  "private": "...",
  "main": "....",
    /*nuestras librerías/dependencias en dev, teniendo electron y electron-builder dentro*/
  "dependencies": {
    "otras librerías": "....",
    "electron": "^25.3.2",
    "electron-builder": "^24.6.3",
  },
  "scripts": {
   "... ": "....."
  },
  "eslintConfig": {
    "extends": ["...", ....]
  },
  "browserslist": {
    "production": ["...", ....],
    "development": [
      ".....", ....
    ]
  },
    /*nuestras librerías/dependencias en dev, teniendo electron y electron-builder dentro*/
  "devDependencies": {
    "otras librerías": "....",
    "electron": "^25.3.2",
    "electron-builder": "^24.6.3",
  }
}
```

Si por alguna razón una o las librerías están dentro de dependencies y devDependencies al mismo tiempo tenemos que borrarlas de dependencies y verificar que solo estén en devDependencies, una ves echo y verificado tenemos que actualizar con npm i / npm install

---

## PASO 2 - ACTUALIZAR EL PACKAGE.JSON

Una ves echo el paso uno toca cambiar ciertas cosas en nuestro package.json, tenemos que añadir la clase main y los scrips de ejecución

### 1 Añadir los script para ejecutar electron

Vamos a nuestro package.json y ubicamos la sección de scrips para añadir el siguiente comando:

```cmd
"electron-dev": "concurrently \"npm start\" \"wait-on http://127.0.0.1:3000 && electron .\"",
```

Ejemplo del json:

```json
  .....

  "scripts": {
    "otros scrips": ".....",
    "electron-dev": "concurrently \"npm start\" \"wait-on http://127.0.0.1:3000 && electron .\"",
  },

  .....
```

### 2 Añadir la sección main

Vamos a nuestro json y creamos la sección de main dentro de la primera llave de nuestro json y añadimos lo siguiente:

```cmd
  "main": "public/electron.js",
```

Ejemplo del json:

```json
{
  "name": "...",
  "description": "....",
  "author": ".....",
  "version": "....",
  "private": "...",
  "main": "public/electron.js",
  "dependencies": {
    "otras librerías": "....",
  },
  "scripts": {
   "... ": "....."
  },
  "eslintConfig": {
    "extends": ["...", ....]
  },
  "browserslist": {
    "production": ["...", ....],
    "development": [
      ".....", ....
    ]
  },
  "devDependencies": {
    "otras librerías": "....",
    "electron": "^25.3.2",
    "electron-builder": "^24.6.3",
  }
}
```

Ojo, pon el main tal como se pone en el ejemplo **"main": "public/electron.js"**

---

## PASO 3 - CREAR Y MODIFICAR LOS ARCHIVOS ELECTRON.JS Y ELECTRON-BUILDER.JSON

Una ves echa las modificaciones de neutro package.json tenemos que crear los archivos de electron-builder.json y electron.js y modificar estos

### 1 Crear el archivo electron-builder.json

Para crear el archivo necesitamos ubicar la carpeta de nuestro proyecto:

Ruta:

```css
mi-aplicación/
├── src/
│   ├── ...
├── public/
│   ├── index.html
├── package.json
├──> Justo aquí
├── ...
```

Una ves ubicado creamos el archivo llamado electron-builder con terminación json (**electron-builder.json**), El archivo debe de tener ese nombre y terminación

```css
mi-aplicación/
├── src/
│   ├── ...
├── public/
│   ├── index.html
├── package.json
├── electron-builder.json
├── ...
```

### 2 Crear el archivo electron.js

Para crear el archivo necesitamos ubicar la carpeta public de nuestro proyecto:

Ruta:

```css
mi-aplicación/
├── src/
│   ├── ...
├── public/
│   ├── index.html
│   ├─> Justo aquí
├── package.json
├── ...
```

Una ves ubicado creamos el archivo llamado electron con terminación js (**electron.js**), El archivo debe de tener ese nombre y terminación

```css
mi-aplicación/
├── src/
│   ├── ...
├── public/
│   ├── index.html
│   ├── electron.js
├── package.json
├── ...
```

### 3 Modificar el archivo electron-builder.json

Una ves creado el archivo tenemos que adaptarlo a como nos lo dice la [documentación de electron](<[https:/](https://www.electronjs.org/docs/latest)/>)

En este ejemplo yo tengo un archivo de la siguiente manera:

```json
{
  "appId": "com.proyecto.app",
  "productName": "Mi aplicación 1",
  "directories": {
    "output": "dist"
  },
  "win": {
    "target": "nsis",
    "icon": "public/logo192.png"
  },
  "mac": {
    "target": "dmg",
    "icon": "public/logo192.png"
  }
}
```

Las secciones son

- appId: Es La identificación de nuestra aplicación
- productName: Es el nombre de nuestra aplicación
- directories: Es directorio que tendrá nuestro proyecto es aconsejable dejarlo como lo tengo en mi ejemplo
- win: Es la sección para modificar y crear el instalador de Windows en este caso le pusimos un icono y la terminación .msi que es lo recomendable
- mac lo mismo que win pero con la terminación dmg

### 4 Modificar el archivo electron.js conforme a las reglas de electron

Una ves creado el archivo tenemos que adaptarlo a como nos lo dice la [documentación de electron](<[https:/](https://www.electronjs.org/docs/latest)/>)

En este ejemplo yo tengo un archivo de la siguiente manera:

```js
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const url = require("url"); // línea para manejar URLs locales

// * Ventana
function crearVentana() {
  // Componentes
  const mainWindow = new BrowserWindow({
    width: 700,
    height: 400,
    fullscreen: false,
    frame: true,
    icon: path.join(__dirname, "logo192.png"),
    center: true,
    fullscreenable: true,
    minWidth: 300,
    minHeight: 300,
  });

  // Ventana de desarrollador
  mainWindow.webContents.openDevTools();

  // * Para Producción
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "index.html"),
      protocol: "file:",
      slashes: true,
    })
  );

  // Para pruebas locales
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
```

---

## PASO 4 - COMPROBAR PROYECTO EN ENTORNO DE PRUEBA

Una vez terminados los palos anteriores es hora de verificar que nuestra aplicación funcione correctamente, lo primero queremos sera verificarlo en un entorno local y de prueba para eso haremos lo siguiente

### 1 Cambiar nuestro archivo electron.js a entorno de pruebas

Nos dirigimos a nuestro archivo electron.js y cambiamos el (**mainWindow.loadURL("");**) para entornos de pruebas

Ejemplo

```js
...... resto del codigo

mainWindow.loadURL("http://localhost:3000");

......
```

La ruta (**<http://localhost:3000>**) es el servidor que usa react por defecto, tu puedes poner el servidor pr defecto de tu proyecto

### 2 Probar que nuestra app funcione correctamente

Una vez hecho el paso anterior ahora tenemos que ejecutar el siguiente comando (**npm run electron-dev**) Basándonos en el script que pusimos en el package.jon

Scrip

```json
 .....

  "scripts": {
    "otros scrips": ".....",
    "electron-dev": "concurrently \"npm start\" \"wait-on http://127.0.0.1:3000 && electron .\"",
  },

.....
```

Comando

```cmd
npm run electron-dev
```

Una vez hecho estos pasos nuestro proyecto se empezará a ejecutar normalmente como lo haría en react ,solo que al terminar de cargar la parte web se abrirá la ventana de electrón con nuestro proyecto

---

## PASO 5 - PONER EN PRODUCCIÓN NUESTRA APLICACIÓN

Cuando terminemos nuestro proyecto, queramos crear un instalador o verificar cómo se comporta en producción la app tenemos que hacer los siguientes pasos

### 1 Cambiar nuestro archivo electron.js a entorno de producción

Nos dirigimos a nuestro archivo electron.js y cambiamos el (**mainWindow.loadURL("");**) para entornos de producción

Ejemplo

```js
...... resto del codigo

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "index.html"),
      protocol: "file:",
      slashes: true,
    })
  );

......
```

La ruta (**pathname: path.join(\_\_dirname, "index.html"**) es el archivo index.html, trata de ponerlo igual al ejemplo

### 2 Ejecutar el comando de producción

Para poner nuestro proyecto en producción y crear la carpeta built ponemos el siguiente comando en la consola del proyecto

```cmd
npm run build
```

Cuando ejecutemos este comando se creara la carpeta build en la carpeta del proyecto, esta será la que contendrá los activos listos para poner nuestro proyecto para producción, Los archivos quedarán Más o menos de esta manera

```css
mi-aplicación/
├── src/
│   ├── ...
├── build/
│   ├── static/
│   ├── index.html
│   ├── electron.js
│   ├── asset-manifest.json
├── package.json
├── ...
```

### 3 Cambiar las rutas de nuestro index.html

Este paso puede ser opcional en algunos casos pero es recomendable actualizar las rutas de nuestro archivo index.html de la carpeta build ya que aveces electrón no puede detectar cuando una ruta es tipo (**/ruta**) que no tiene un punto como en (**./ruta**)

Buscamos nuestro archivo (**index.html**) en la carpeta build

```css
mi-aplicación/
├── src/
│   ├── ...
├── build/
│   ├── static/
│   ├── index.html
│   ├── ...
├── ...
```

Una vez ubicado el archivo Buscamos todas las rutas que no contengan un punto y se lo agregamos

Ejemplo de archivo INCORRECTO (**Usando /ruta**)

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="...." href="/favicon.ico" />
    <meta name="....." content="....." />
    <meta name="......." content="#...." />
    <meta name="......" content="....." />
    <link rel="......" href="/file.png" />
    <link rel="...." href="/file.json" />
    <title>.....</title>
    <script defer="..." src="/static/js/file.js"></script>
    <link href="/static/css/file.css" rel="....." />
  </head>
  <body>
    <noscript>.....</noscript>
    <div id="root"></div>
  </body>
</html>
```

Ejemplo de archivo CORRECTO (**Usando ./ruta**)

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="...." href="./favicon.ico" />
    <meta name="....." content="....." />
    <meta name="......." content="#...." />
    <meta name="......" content="....." />
    <link rel="......" href="./file.png" />
    <link rel="...." href="./file.json" />
    <title>.....</title>
    <script defer="..." src="./static/js/file.js"></script>
    <link href="./static/css/file.css" rel="....." />
  </head>
  <body>
    <noscript>.....</noscript>
    <div id="root"></div>
  </body>
</html>
```

---

## PASO 6 - CREAR UN INSTALADOR DE NUESTRA APLICACIÓN PARA EXPORTARLA A OTRAS PC, ETC

Una ves hecho unos pasos anteriores ahora estamos listos para poder crear el instalador de nuestro proyecto y poder correrlo en nuestra computadora o exportarlo a otras, para eso hacemos los siguientes pasos

### 1 Ejecutar el comando para crear el instalador

Para crear el instalador de nuestro proyecto ejecutamos el siguiente comando en la consola de nuestra app

```cmd
electron-builder
```

Cuando ejecutemos este comando se creara una carpeta llamada dist en la carpeta principal del proyecto, esta será la que contendrá los instaladores y archivos listos para correr nuestra app

```css
mi-aplicación/
├── src/
├── build/
│   ├── ...
├── dist/
│   ├── ../
│   ├── ...
│   ├── nombre_app Setup 0.1.0.exe
│   ├── ...
├── package.json
├── ...
```

### 2 Probar nuestra aplicación

Una ves verificada la carpeta instalamos nuestro proyecto y listo =).

---

## POSIBLES PROBLEMAS CON LA INSTALACIÓN

### 1 Fallo al ejecutar la aplicación en modo desarrollador

Posible Solución: Asegúrate de que las dependencias necesarias estén instaladas y que los scripts estén configurados correctamente en el package.json. Asegúrate también de que el servidor de desarrollo de React esté en funcionamiento antes de ejecutar Electron.

### 2 Los módulos de Node.js no se cargan correctamente en el contexto de Electron

Posible Solución: Asegúrate de que las dependencias de Node.js estén instaladas en la carpeta raíz de tu proyecto y no solo en la carpeta src de React. Puedes verificar si los módulos se están cargando correctamente utilizando la consola de desarrollador de Electron.

### 3 La aplicación no se ajusta correctamente a diferentes tamaños de pantalla

Asegúrate de que los estilos y diseños de CSS estén configurados de manera responsiva y utilicen unidades relativas como % o vw y vh. Puedes utilizar herramientas de desarrollo como DevTools para simular diferentes tamaños de pantalla y ajustar los estilos en consecuencia.

### 4 Problemas con la instalación de paquetes nativos o binarios

Algunos paquetes de Node.js pueden requerir compilación o tener dependencias binarias que deben coincidir con la arquitectura y versión de Electron que estás utilizando. Asegúrate de revisar la documentación del paquete para obtener instrucciones específicas sobre cómo manejar estas dependencias.

### 5 La aplicación se congela o se bloquea al usar ipcMain o ipcRenderer

Verifica que estás utilizando ipcMain y ipcRenderer correctamente. Asegúrate de no bloquear el hilo principal con operaciones intensivas y utiliza promesas o callbacks adecuados para manejar la comunicación entre los procesos de Electron.

### 6 Problemas al crear instaladores para diferentes sistemas operativos

Asegúrate de que la configuración en el archivo electron-builder.json sea correcta para el sistema operativo de destino. También verifica que los iconos y recursos necesarios estén en las ubicaciones adecuadas. Consulta la documentación de Electron Builder para obtener detalles específicos sobre la configuración de los instaladores.

# LIBRERÍAS USADAS EN ESTE PROYECTO

## SCSS [link oficial](https://www.npmjs.com/package/scss)

Compilar archivos SCSS en archivos CSS que puedan ser interpretados por los navegadores web. Esto significa que puedes escribir tu código en SCSS y luego compilarlo en CSS antes de implementarlo en tu sitio web.

    npm i scss

Ejemplo

```scss
$font-stack: Helvetica, sans-serif;
$primary-color: #333;

body {
  font: 100% $font-stack;
  color: $primary-color;

  nav {
    ul {
      margin: 0;
      padding: 0;
      list-style: none;
    }

    li {
      display: inline-block;
    }

    a {
      display: block;
      padding: 6px 12px;
      text-decoration: none;
    }
  }
}
```

## ELECTRON [link oficial](https://www.npmjs.com/package/electron)

Framework de desarrollo de aplicaciones de escritorio de código abierto que utiliza tecnologías web como HTML, CSS y JavaScript. Permite crear aplicaciones multiplataforma que se ejecutan en Windows, macOS y Linux.

    npm i electron

Ejemplo

```ts
const { app, BrowserWindow } = require('electron');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  win.loadFile('index.html');
}

app.whenReady().then(createWindow);
```

## ELECTRO-BUILDER [link oficial](https://www.npmjs.com/package/electron-builder)

    npm i electron-builder

Scripts

```json
  "scripts": {
  "electron-start": "electron .", // electron build
  "start": "react-scripts start",
  "build": "react-scripts build",
  "test": "react-scripts test",
  "eject": "react-scripts eject"
  },
```

Ejemplo

    electron-start

O

    npm run electron-start

Axios: Para realizar solicitudes HTTP desde tu aplicación React al servidor Laravel, puedes usar la librería Axios. Te permitirá realizar peticiones GET, POST, PUT, DELETE, etc.

[Link](https://www.npmjs.com/package/axios)

    npm i axios

React Router: Si necesitas manejar la navegación entre diferentes componentes en tu aplicación React, React Router es una opción popular. Puedes configurar rutas para cada sección de tu aplicación y navegar entre ellas de forma sencilla.

[link](https://www.npmjs.com/package/react-router)

    npm i react-router

va junto con:

[link](https://www.w3schools.com/react/react_router.asp)

npm i -D react-router-dom

    npm i -D react-router-dom

Moment.js: Si necesitas manipular y mostrar fechas y horas en tu aplicación, Moment.js es una librería muy útil. Puedes realizar operaciones con fechas, formatearlas y mostrarlas en el formato deseado.

[link](https://www.npmjs.com/package/moment)

    npm i moment

React-PDF: Si deseas generar archivos PDF en tu aplicación React, puedes utilizar React-PDF. Esta librería te permite crear documentos PDF utilizando componentes de React. Puedes generar tablas, gráficos y cualquier otro contenido que desees en tus archivos PDF.

[link](https://www.npmjs.com/package/react-pdf)

    npm i react-pdf

React-Table: Si necesitas mostrar datos tabulares, como las ventas y rentas del día, React-Table es una librería que te permite crear tablas interactivas y personalizables fácilmente. Puedes ordenar, filtrar y paginar los datos de forma eficiente.

[link](https://www.npmjs.com/package/react-table)

    npm i react-table

Material-UI: Si buscas una biblioteca de componentes de interfaz de usuario (UI) con un enfoque moderno y atractivo, Material-UI puede ser una excelente opción. Proporciona una amplia variedad de componentes preestilizados que pueden facilitar la creación de una interfaz visualmente agradable.

[link](https://mui.com/material-ui/getting-started/installation/)

    npm install @mui/material @emotion/react @emotion/styled

react-countdown: para implementar el cronómetro en tu aplicación React. Esta librería te permitirá mostrar un contador regresivo en minutos y segundos.

[link](https://www.npmjs.com/package/react-countdown)

    npm i react-countdown

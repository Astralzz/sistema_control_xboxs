// import { notify, setConfig } from "electron-notify";
// import iconoPrincipal from "../assets/imgs/icono.png";
// import path from "path";

// // * Configuraciones
// const icono: string = "assets/imgs/icono.png";
// const segundos: number = 6;
// const colorFondo: string = "var(--color-fondo)";
// const sonidoPrincipal: string = "./sounds/notificacion.mp3";

// setConfig({
//   appIcon: icono,
//   displayTime: segundos > 1 ? segundos * 1000 : 6000,
//   defaultStyleText: {
//     color: colorFondo,
//     fontWeight: "bold",
//   },
// });

// * Enviar notificación
export const enviarNotificación = (
  titulo: string,
  mensaje: string,
  url?: string,
  imagen?: string,
  sonido?: string,
  accionClick?: () => void,
  accionAlMostrar?: () => void,
  accionAlCerrar?: () => void
): void => {
  // notify({
  //   title: titulo,
  //   text: mensaje,
  //   url: url,
  //   image: imagen ?? iconoPrincipal,
  //   sound: sonido ?? sonidoPrincipal,
  //   onClickFunc: accionClick,
  //   onShowFunc: accionAlMostrar,
  //   onCloseFunc: accionAlCerrar,
  // });
};


// TODO, PENDIENTE PARA EL FINAL
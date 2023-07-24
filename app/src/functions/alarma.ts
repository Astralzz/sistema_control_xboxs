import { Howl, Howler } from "howler";
import { URL_ALARMA } from "../config/variables";

// * Alarma
interface Alarma {
  sound: Howl;
}

// * Alarmas
const alarmas: { [key: string]: Alarma } = {};

// * Crear alarma
const reproducirAlarma = (): string => {
  // Id único
  const id:string = generateUUID();

  // ? Ya existe
  if (alarmas[id]) {
    // Detenemos
    alarmas[id].sound.stop();
    // Destruimos
    alarmas[id].sound.unload();
  }

  // Creamos el sonido
  const sonido: Howl = new Howl({
    src: [URL_ALARMA],
    // html5: true,
    loop: true,
    volume: 1.0,
  });

  // Iniciamos
  sonido.play();

  console.log("====================================");
  console.log("PLAY, \n");
  console.log(sonido);
  console.log("====================================");

  // Guardamos
  alarmas[id] = { sound: sonido };

  // Retornamos
  return id;
};

// * Detener y destruir alarma
const detenerAlarma = (alarmId: string): boolean => {
  // Alarma
  const alarma = alarmas[alarmId];

  // ? Existe
  if (alarma) {
    // Detenemos
    alarma.sound.stop();

    console.log("====================================");
    console.log("STOP, \n");
    console.log(alarmas);
    console.log("====================================");

    // Destruimos
    alarma.sound.unload();

    // Eliminamos
    delete alarmas[alarmId];

    return true;
  }

  return false;
};

// Función generadora de id
function generateUUID(): string {
  let dt = new Date().getTime();
  const uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid;
}

export { reproducirAlarma, detenerAlarma };

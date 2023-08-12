import moment from "moment";
import "moment/locale/es";
import Swal, { SweetAlertIcon, SweetAlertResult } from "sweetalert2";
import Venta from "../models/Venta";
import { FiltroFechasGrafica } from "./variables";

// * Variables de estilos
const colorFondo: string = "var(--color-fondo)";
const colorLetra: string = "var(--color-letra)";
const colorAceptar: string = "var(--color-confirmar)";
const colorCancelar: string = "var(--color-cancelar)";

// * Paginacion
export interface Paginacion {
  desde: number;
  asta: number;
}

// * Validar input file img
export function validarInputFile(
  archivo: File | null,
  tamMaximo: number = 2048,
  extensionesValidas: Set<string> = new Set([
    "jpeg",
    "png",
    "jpg",
    "gif",
    "svg",
    "webp",
    "jfif",
  ])
): {
  isValido: boolean;
  errorInf?: string;
} {
  // ? No existe
  if (!archivo) {
    return {
      isValido: false,
      errorInf: "No se proporcionó ningún archivo.",
    };
  }

  // ? Extension
  const extensionArchivo = archivo.name.split(".").pop()?.toLowerCase();

  // ? No valido
  if (!extensionArchivo || !extensionesValidas.has(extensionArchivo)) {
    return {
      isValido: false,
      errorInf:
        "Tipo de archivo no válido. Las extensiones válidas son: " +
        Array.from(extensionesValidas).join(", "),
    };
  }

  // Tamaño
  const tamArchivoMB = archivo.size / (1024 * 1024);

  // ? Es mayor
  if (tamArchivoMB > tamMaximo) {
    return {
      isValido: false,
      errorInf:
        "El archivo excede el tamaño máximo permitido (" + tamMaximo + "MB).",
    };
  }

  // * Éxito
  return {
    isValido: true,
  };
}

// * Calcular monto recaudado
export function calcularMontoRecaudado(
  m: number,
  noControles: boolean
): number {
  let minutos = m / 60;
  const precioPorHora = !noControles ? 15 : 21;
  const precioPorMediaHora = !noControles ? 9 : 13;
  const precioPor3Minutos = precioPorMediaHora / 9;
  const precioPor10Minutos = precioPorMediaHora / 3;

  let precioTotal = 0;

  // Calcular el precio por hora
  const horasCompletas = Math.floor(minutos / 60);
  precioTotal += horasCompletas * precioPorHora;
  minutos -= horasCompletas * 60;

  // Calcular el precio por media hora
  const mediaHorasCompletas = Math.floor(minutos / 30);
  precioTotal += mediaHorasCompletas * precioPorMediaHora;
  minutos -= mediaHorasCompletas * 30;

  // Calcular el precio por 10 minutos
  const bloquesDe10Minutos = Math.floor(minutos / 10);
  precioTotal += bloquesDe10Minutos * precioPor10Minutos;
  minutos -= bloquesDe10Minutos * 10;

  // Calcular el precio por 3 minutos restantes
  const bloquesDe3Minutos = Math.floor(minutos / 3);
  precioTotal += bloquesDe3Minutos * precioPor3Minutos;
  minutos -= bloquesDe3Minutos * 3;

  // Calcular el precio por minutos restantes
  precioTotal += (minutos / 60) * precioPorHora;

  return parseFloat(precioTotal.toFixed(2)); // Redondear a dos decimales
}

// * Redondear umero
export function redondearNumero(numero: number): number {
  // Obtenemos la parte decimal del número
  const decimalPart = numero - Math.floor(numero);

  // ? Menor que 0.25
  if (decimalPart < 0.25) {
    return Math.floor(numero);
    // ? Mayor que 0.75
  } else if (decimalPart >= 0.75) {
    return Math.ceil(numero);
    // ? A la mitad
  } else {
    return Math.floor(numero) + 0.5;
  }
}

// * Formatear fecha
export function formatearFecha(
  fecha: string,
  filtro?: FiltroFechasGrafica
): string | null {
  try {
    // Creamos fecha con Moment.js
    const date = moment(fecha);

    // ? Semanal
    if (filtro === "semanal" || filtro === "periodica") {
      return `${date.format("DD")}/${date.format("MMM")}`;
    }

    // ? Mensual
    if (filtro === "mensual") {
      return `${date.format("MMM")}/${date.format("YYYY")}`;
    }

    // ? Anual
    if (filtro === "anual") {
      return `${date.format("YYYY")}`;
    }

    // Ninguno
    return `${date.format("DD")}/${date.format("MMM")}/${date.format("YYYY")}`;
  } catch (error: unknown) {
    alertaSwal("Error", String(error), "error");
    return null;
  }
}

// * Formatear fecha con días
export function formatearFechaConDias(fecha: string): string {
  // Creamos fecha con Moment.js
  const date = moment(fecha);

  // Formateamos con opciones de idioma
  return date.locale("es").format("dddd, D [de] MMMM [de] YYYY");
}

// * Formatear hora sin segundos
export function formatearHoraSinSegundos(hora: string): string | null {
  try {
    // Obtenemos
    const [horas, minutos] = hora.split(":");
    let horaFormateada = "";

    // ? Es menor a 12
    if (+horas < 12) {
      horaFormateada = `${horas}:${minutos} am`;
    } else {
      const horas12 = +horas % 12 || 12;
      horaFormateada = `${horas12}:${minutos} pm`;
    }

    return horaFormateada;

    // ! Error
  } catch (error) {
    return null;
  }
}

// * Formatear tiempo
export function formatearTiempo(t: number): string {
  // ? es 0
  if (t < 1) {
    return "00:00";
  }

  const minutos = Math.floor(t / 60);
  const segundos = t % 60;
  return `${minutos.toString().padStart(2, "0")}:${segundos
    .toString()
    .padStart(2, "0")}`;
}

// * Crear color claro
export function generarColorClaroAleatorio(opacidad: number): string {
  const r = Math.floor(Math.random() * 156) + 100;
  const g = Math.floor(Math.random() * 156) + 100;
  const b = Math.floor(Math.random() * 156) + 100;

  return `rgb(${r}, ${g}, ${b}, ${opacidad})`;
}

// * Crear color medio
export function generarColorMedioAleatorio(opacidad: number): string {
  const r = Math.floor(Math.random() * 100) + 50;
  const g = Math.floor(Math.random() * 100) + 50;
  const b = Math.floor(Math.random() * 100) + 50;

  return `rgb(${r}, ${g}, ${b}, ${opacidad})`;
}

// * Crear color oscuro
export function generarColorOscuroAleatorio(opacidad: number): string {
  const r = Math.floor(Math.random() * 100);
  const g = Math.floor(Math.random() * 100);
  const b = Math.floor(Math.random() * 100);

  return `rgb(${r}, ${g}, ${b}, ${opacidad})`;
}

// * Fecha y hora actual
type FechaHora = { fecha: string; hora: string };

export function fechaHoraActual(): FechaHora {
  const currentDate = new Date();

  // Obtener los componentes de la fecha y hora
  const year = currentDate.getFullYear().toString().padStart(4, "0");
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  const day = currentDate.getDate().toString().padStart(2, "0");
  const hours = currentDate.getHours().toString().padStart(2, "0");
  const minutes = currentDate.getMinutes().toString().padStart(2, "0");
  const seconds = currentDate.getSeconds().toString().padStart(2, "0");

  const data: FechaHora = {
    fecha: `${year}-${month}-${day}`,
    hora: `${hours}:${minutes}:${seconds}`,
  };

  return data;
}

// * Alerta swal
export const alertaSwal = (
  titulo: string,
  texto: string,
  icono: SweetAlertIcon
) =>
  Swal.fire({
    background: colorFondo,
    color: colorLetra,
    confirmButtonColor: colorAceptar,
    cancelButtonColor: colorCancelar,
    title: titulo,
    text: texto,
    icon: icono,
  });

// * Confirmación swal
export const confirmacionSwal = (
  titulo: string,
  texto: string,
  textoConfirmar: string
): Promise<boolean> =>
  new Promise((resolve) => {
    Swal.fire({
      title: titulo,
      text: texto,
      icon: "warning",
      showCancelButton: true,
      background: colorFondo,
      color: colorLetra,
      confirmButtonColor: colorAceptar,
      cancelButtonColor: colorCancelar,
      confirmButtonText: textoConfirmar,
      cancelButtonText: "Cancelar",
      // * Resultado
    }).then((result) => resolve(result.isConfirmed));
  });

// * Tiempo manual
type estadoSeleccion = "seleccionado" | "aumentado" | "disminuido";
export const seleccionarTiempoManual = (
  texSeleccion: estadoSeleccion
): Promise<number> =>
  new Promise((resolve) => {
    Swal.fire({
      text: `Escribe los minutos necesarios`,
      input: "number",
      background: colorFondo,
      color: colorLetra,
      inputAttributes: {
        min: "1",
        max: "1440",
        step: "1",
      },
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      confirmButtonColor: colorAceptar,
      cancelButtonColor: colorCancelar,
      allowOutsideClick: false,
      allowEscapeKey: false,
      icon: "question",
    })
      // * Éxito
      .then((resultado: SweetAlertResult<any>) => {
        // ? Confirmado
        if (resultado.isConfirmed) {
          // Convertimos
          const minutos = parseInt(resultado.value);

          // ? Se puede formatear y es menor a 0
          if (isNaN(minutos) || minutos < 0) {
            alertaSwal(
              "Error!",
              "Por favor, ingresa un número válido.",
              "error"
            );

            resolve(-1);
            return;
          }

          // ? Son 24 horas
          if (minutos > 1440) {
            alertaSwal("Error!", "No puedes poner mas de 24 horas", "error");
            resolve(-1);
            return;
          }

          // * Éxito
          alertaSwal(
            "Éxito!",
            `Se han ${texSeleccion} ${minutos} minutos.`,
            "success"
          );

          resolve(minutos);
          return;
        }

        resolve(-1);
      });
  });

// * Calcular no de paginas
export function calcularPaginaciones(
  numeroDatos: number,
  datosPorPagina: number = 10
): Paginacion[] {
  // t paginas
  const totalPaginas =
    numeroDatos < 1 ? 0 : Math.ceil(numeroDatos / datosPorPagina);

  //  Recorremos y agregamos
  const paginas: Paginacion[] = [];
  for (let i = 0; i < totalPaginas; i++) {
    paginas.push({
      desde: i * datosPorPagina,
      //asta: i === totalPaginas - 1 ? numeroDatos - 1 : (i + 1) * datosPorPagina - 1;
      asta: datosPorPagina,
    });
  }

  return paginas;
}

// * Cortar texto
export function truncarTexto(texto: string, longitudMaxima: number): string {
  // ? Es mayor
  if (texto.length > longitudMaxima) {
    return texto.substring(0, longitudMaxima) + "...";
  } else {
    return texto;
  }
}

// * Generar id
export function generateRandomId(
  longitud: number = 12,
  caracteres: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
): string {
  // Respuesta
  let r: string = "";

  // Recorremos
  for (let i = 0; i < longitud; i++) {
    const randomIndex = Math.floor(Math.random() * caracteres.length);
    r += caracteres.charAt(randomIndex);
  }

  return r;
}

// * para convertir detalles de una venta
export function convertirDetalles(venta: Venta): Venta {
  // Obtenemos json
  const detallesJSON = JSON.parse(String(venta.detalles));

  // Convertimos
  const detallesConvertidos = detallesJSON.map((detalle: any) => {
    return {
      id_producto: detalle.id_producto,
      cantidad: detalle.cantidad,
    };
  });
  return { ...venta, detalles: detallesConvertidos };
}

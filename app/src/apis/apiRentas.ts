import axios from "axios";
import API_URL, {
  RespuestaApi,
  catchAxiosError,
  comprobarApis,
} from "./apiVariables";
import { FiltroFechasGrafica } from "../functions/variables";
import moment from "moment-timezone";

// * Variables
const intermedio: string = "rentas";

// * Obtener lista de Rentas
export async function apiObtenerListaRentas(
  desde: number = 0,
  asta: number = 10
): Promise<RespuestaApi> {
  try {
    // ? Url no encontrada
    if (!comprobarApis()) {
      throw new Error("No se pudo encortar la url hacia el servidor");
    }
    // Ruta
    let url = API_URL + `${intermedio}/lista/global/${desde}/${asta}`;

    // Enviamos
    const res = await axios.get(url);

    // * Éxito
    return {
      estado: true,
      listaRentas: res.data.lista ?? undefined,
      totalDatos: res.data.totalDatos ?? undefined,
    };

    // ! Error
  } catch (er: unknown) {
    return await catchAxiosError(er);
  }
}

// * Obtener lista por xboxs
export async function apiObtenerListaRentasPorXbox(
  id: number
): Promise<RespuestaApi> {
  try {
    // ? Url no encontrada
    if (!comprobarApis()) {
      throw new Error("No se pudo encortar la url hacia el servidor");
    }

    //Ruta
    let url = API_URL + `${intermedio}/lista/filtrada/xbox/${id}`;

    // Enviamos
    const res = await axios.get(url);

    // * Éxito
    return {
      estado: true,
      listaRentas: res.data ?? undefined,
    };

    // ! Error
  } catch (er: unknown) {
    return await catchAxiosError(er);
  }
}

// * Obtener lista de Rentas por dia
export async function apiObtenerListaRentasPorDia(
  fecha: Date,
  desde: number = 0,
  asta: number = 10
): Promise<RespuestaApi> {
  try {
    // ? Url no encontrada
    if (!comprobarApis()) {
      throw new Error("No se pudo encortar la url hacia el servidor");
    }

    // Formatear fecha en el formato 'Y-m-d'
    const fechaMoment = moment.tz(fecha, "America/Mexico_City");
    const fechaFormateada: string = fechaMoment.format("YYYY-MM-DD");

    // Ruta
    let url =
      API_URL +
      `${intermedio}/lista/filtrada/dia/${fechaFormateada}/${desde}/${asta}`;

    // Enviamos
    const res = await axios.get(url);

    // * Éxito
    return {
      estado: true,
      listaRentas: res.data.lista ?? undefined,
      totalDatos: res.data.totalDatos ?? undefined,
    };

    // ! Error
  } catch (er: unknown) {
    return await catchAxiosError(er);
  }
}

// * Obtener lista de Rentas por mes
export async function apiObtenerListaRentasPorMes(
  fecha: Date,
  desde: number = 0,
  asta: number = 10
): Promise<RespuestaApi> {
  try {
    // ? Url no encontrada
    if (!comprobarApis()) {
      throw new Error("No se pudo encortar la url hacia el servidor");
    }

    // Obtener año y mes de la fecha
    const anio = fecha.getFullYear();
    const mes = fecha.getMonth() + 1;

    // Ruta
    const url =
      API_URL +
      `${intermedio}/lista/filtrada/mes/${anio}/${mes}/${desde}/${asta}`;

    // Enviamos
    const res = await axios.get(url);

    // * Éxito
    return {
      estado: true,
      listaRentas: res.data.lista ?? undefined,
      totalDatos: res.data.totalDatos ?? undefined,
    };

    // ! Error
  } catch (er: unknown) {
    return await catchAxiosError(er);
  }
}

// * Obtener lista de rentas por grafica
export async function apiObtenerListaRentasPorGrafica(
  tipo: FiltroFechasGrafica,
  datos?: number
): Promise<RespuestaApi> {
  try {
    // ? Url no encontrada
    if (!comprobarApis()) {
      throw new Error("No se pudo encortar la url hacia el servidor");
    }
    // Ruta
    let url =
      API_URL + `${intermedio}/lista/${tipo}${datos ? "/" + datos : ""}`;

    // Enviamos
    const res = await axios.get(url);

    // * Éxito
    return {
      estado: true,
      listaGrafica: res.data.rentasFiltradas ?? undefined,
    };

    // ! Error
  } catch (er: unknown) {
    return await catchAxiosError(er);
  }
}

// * Crear nueva renta
export async function apiCrearNuevaRenta(
  data: FormData
): Promise<RespuestaApi> {
  try {
    // ? Url no encontrada
    if (!comprobarApis()) {
      throw new Error("No se pudo encortar la url hacia el servidor");
    }
    // Ruta
    let url = API_URL + `${intermedio}/opciones/crear`;

    // Enviamos
    const res = await axios.post(url, data);

    // * Éxito
    return {
      estado: true,
      renta: res.data.renta ?? undefined,
      mensaje: res.data.mensaje ?? undefined,
    };

    // ! Error
  } catch (er: unknown) {
    return await catchAxiosError(er);
  }
}

// * Actualizar renta
export async function apiActualizarRenta(
  data: FormData,
  id: number
): Promise<RespuestaApi> {
  try {
    // ? Url no encontrada
    if (!comprobarApis()) {
      throw new Error("No se pudo encortar la url hacia el servidor");
    }
    // Ruta
    let url = API_URL + `${intermedio}/opciones/actualizar/${id}`;

    // Enviamos
    const res = await axios.post(url, data);

    // * Éxito
    return {
      estado: true,
      renta: res.data.renta ?? undefined,
      mensaje: res.data.mensaje ?? undefined,
    };

    // ! Error
  } catch (er: unknown) {
    return await catchAxiosError(er);
  }
}

// * Eliminar renta
export async function apiEliminarRenta(id: number): Promise<RespuestaApi> {
  try {
    // ? Url no encontrada
    if (!comprobarApis()) {
      throw new Error("No se pudo encortar la url hacia el servidor");
    }
    // Ruta
    let url = API_URL + `${intermedio}/opciones/eliminar/${id}`;

    // Enviamos
    const res = await axios.delete(url);

    // * Éxito
    return {
      estado: true,
      mensaje: res.data.mensaje ?? undefined,
    };

    // ! Error
  } catch (er: unknown) {
    return await catchAxiosError(er);
  }
}

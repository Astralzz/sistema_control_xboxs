import axios from "axios";
import API_URL, { RespuestaApi, catchAxiosError } from "./apiVariables";

// * Variables
const intermedio: string = "rentas";

// * Obtener xboxs
export async function apiObtenerListaRentasPorXbox(
  id: number
): Promise<RespuestaApi> {
  try {
    //Ruta
    let url = API_URL + `${intermedio}/lista/xbox/${id}`;

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

// * Crear nuevo xbox
export async function apiCrearNuevaRenta(
  data: FormData
): Promise<RespuestaApi> {
  try {
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

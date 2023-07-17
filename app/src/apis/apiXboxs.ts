import axios from "axios";
import API_URL, { RespuestaApi, catchAxiosError } from "./apiVariables";

// * Variables
const intermedio: string = "xboxs";

// * Obtener lista de xboxs
export async function apiObtenerListaXboxs(): Promise<RespuestaApi> {
  try {
    // Ruta
    let url = API_URL + `${intermedio}/lista`;

    // Enviamos
    const res = await axios.get(url);

    // * Éxito
    return {
      estado: true,
      listaXboxs: res.data ?? undefined,
    };

    // ! Error
  } catch (er: unknown) {
    return await catchAxiosError(er);
  }
}

// * Crear nuevo xbox
export async function apiCrearNuevoXbox(data: FormData): Promise<RespuestaApi> {
  try {
    // Ruta
    let url = API_URL + `${intermedio}/crear`;

    // Enviamos
    const res = await axios.post(url, data);

    // * Éxito
    return {
      estado: true,
      xbox: res.data.xbox ?? undefined,
      mensaje: res.data.mensaje ?? undefined,
    };

    // ! Error
  } catch (er: unknown) {
    return await catchAxiosError(er);
  }
}

// * Crear nuevo xbox
export async function apiActualizarXbox(
  data: FormData,
  id: number
): Promise<RespuestaApi> {
  try {
    // Ruta
    let url = API_URL + `${intermedio}/actualizar/${id}`;

    // Enviamos
    const res = await axios.post(url, data);

    // * Éxito
    return {
      estado: true,
      xbox: res.data.xbox ?? undefined,
      mensaje: res.data.mensaje ?? undefined,
    };

    // ! Error
  } catch (er: unknown) {
    return await catchAxiosError(er);
  }
}

// * Eliminar xbox
export async function apiEliminarXbox(id: number): Promise<RespuestaApi> {
  try {
    // Ruta
    let url = API_URL + `${intermedio}/eliminar/${id}`;

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

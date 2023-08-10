import axios from "axios";
import API_URL, {
  RespuestaApi,
  catchAxiosError,
  comprobarApis,
} from "./apiVariables";

// * Variables
const intermedio: string = "xboxs";

// * Obtener lista de xboxs
export async function apiObtenerListaXboxs(): Promise<RespuestaApi> {
  try {
    // ? Url no encontrada
    if (!comprobarApis()) {
      throw new Error("No se pudo encortar la url hacia el servidor");
    }
    // Ruta
    let url = API_URL + `${intermedio}/lista/global`;

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
      xbox: res.data.xbox ?? undefined,
      mensaje: res.data.mensaje ?? undefined,
    };

    // ! Error
  } catch (er: unknown) {
    return await catchAxiosError(er);
  }
}

// * Actualizar xbox
export async function apiActualizarXbox(
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

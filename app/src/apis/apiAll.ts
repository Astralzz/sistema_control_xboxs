import axios from "axios";
import API_URL, {
  RespuestaApi,
  catchAxiosError,
  comprobarApis,
} from "./apiVariables";

// * Variables
const intermedio: string = "all";

// * Obtener lista de productos
export async function apiObtenerTotalesTablas(): Promise<RespuestaApi> {
  try {
    // ? Url no encontrada
    if (!comprobarApis()) {
      throw new Error("No se pudo encortar la url hacia el servidor");
    }

    // Ruta
    let url = API_URL + `${intermedio}/opciones/totales/tablas`;

    // Enviamos
    const res = await axios.get(url);

    // * Éxito
    return {
      estado: true,
      noXboxs: res.data.noXboxs ?? undefined,
      noProductos: res.data.noProductos ?? undefined,
    };

    // ! Error
  } catch (er: unknown) {
    return await catchAxiosError(er);
  }
}

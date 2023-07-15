import axios from "axios";
import API_URL, { RespuestaApi, catchAxiosError } from "./apiVariables";

// * Variables
const intermedio: string = "xboxs";

// * Obtener xboxs
async function apiObtenerListaXboxs(): Promise<RespuestaApi> {
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

export default apiObtenerListaXboxs;

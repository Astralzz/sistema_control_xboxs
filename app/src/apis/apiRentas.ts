import axios from "axios";
import API_URL, { RespuestaApi, catchAxiosError } from "./apiVariables";

// * Variables
const intermedio: string = "rentas";

// * Obtener xboxs
async function apiObtenerListaRentasPorXbox(id: number): Promise<RespuestaApi> {
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

export default apiObtenerListaRentasPorXbox;

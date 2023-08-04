import axios from "axios";
import API_URL, { RespuestaApi, catchAxiosError } from "./apiVariables";

// * Variables
const intermedio: string = "productos";

// * Obtener lista de productos
export async function apiObtenerListaProductos(
  desde: number = 0,
  asta: number = 10
): Promise<RespuestaApi> {
  try {
    // Ruta
    let url = API_URL + `${intermedio}/lista/global/${desde}/${asta}`;

    // Enviamos
    const res = await axios.get(url);

    // * Éxito
    return {
      estado: true,
      listaProductos: res.data ?? undefined,
    };

    // ! Error
  } catch (er: unknown) {
    return await catchAxiosError(er);
  }
}

// * Obtener lista de productos
export async function apiObtenerListaProductosPorNombre(
  nombre: string,
  desde: number = 0,
  asta: number = 10
): Promise<RespuestaApi> {
  try {
    // Ruta
    let url =
      API_URL +
      `${intermedio}/lista/filtrada/nombre/${nombre}/${desde}/${asta}`;

    // Enviamos
    const res = await axios.get(url);

    // * Éxito
    return {
      estado: true,
      listaProductos: res.data ?? undefined,
    };

    // ! Error
  } catch (er: unknown) {
    return await catchAxiosError(er);
  }
}

// * Obtener lista de productos
export async function apiObtenerListaProductosPorStock(
  stock: number,
  desde: number = 0,
  asta: number = 10
): Promise<RespuestaApi> {
  try {
    // Ruta
    let url =
      API_URL + `${intermedio}/lista/filtrada/stock/${stock}/${desde}/${asta}`;

    // Enviamos
    const res = await axios.get(url);

    // * Éxito
    return {
      estado: true,
      listaProductos: res.data ?? undefined,
    };

    // ! Error
  } catch (er: unknown) {
    return await catchAxiosError(er);
  }
}

// * Obtener total de datos
export async function apiObtenerNoDeProductosTotales(): Promise<RespuestaApi> {
  try {
    // Ruta
    let url = API_URL + `${intermedio}/opciones/no/datos`;

    // Enviamos
    const res = await axios.get(url);

    // * Éxito
    return {
      estado: true,
      dato: res.data ?? undefined,
    };

    // ! Error
  } catch (er: unknown) {
    return await catchAxiosError(er);
  }
}

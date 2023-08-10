import axios from "axios";
import API_URL, { RespuestaApi, catchAxiosError } from "./apiVariables";

// * Variables
const intermedio: string = "productos";

// * Crear nuevo producto
export async function apiCrearProducto(data: FormData): Promise<RespuestaApi> {
  try {
    // Ruta
    let url = API_URL + `${intermedio}/opciones/crear`;

    // Enviamos
    const res = await axios.post(url, data);

    // * Éxito
    return {
      estado: true,
      producto: res.data.producto ?? undefined,
      mensaje: res.data.mensaje ?? undefined,
    };

    // ! Error
  } catch (er: unknown) {
    return await catchAxiosError(er);
  }
}

// * Actualizar producto
export async function apiActualizarProducto(
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
      producto: res.data.producto ?? undefined,
      mensaje: res.data.mensaje ?? undefined,
    };

    // ! Error
  } catch (er: unknown) {
    return await catchAxiosError(er);
  }
}

// * Aumentar stock
export async function apiAumentarStockProducto(
  id: number,
  n: number = 1
): Promise<RespuestaApi> {
  try {
    // Ruta
    let url = API_URL + `${intermedio}/opciones/aumentar/stock/${id}/${n}`;

    // Enviamos
    const res = await axios.post(url);

    // * Éxito
    return {
      estado: true,
      producto: res.data.producto ?? undefined,
      mensaje: res.data.mensaje ?? undefined,
    };

    // ! Error
  } catch (er: unknown) {
    return await catchAxiosError(er);
  }
}

// * Disminuir stock
export async function apiDisminuirStockProducto(
  id: number,
  n: number = 1
): Promise<RespuestaApi> {
  try {
    // Ruta
    let url = API_URL + `${intermedio}/opciones/disminuir/stock/${id}/${n}`;

    // Enviamos
    const res = await axios.post(url);

    // * Éxito
    return {
      estado: true,
      producto: res.data.producto ?? undefined,
      mensaje: res.data.mensaje ?? undefined,
    };

    // ! Error
  } catch (er: unknown) {
    return await catchAxiosError(er);
  }
}

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
      listaProductos: res.data.lista ?? undefined,
      totalDatos: res.data.totalDatos ?? undefined,
    };

    // ! Error
  } catch (er: unknown) {
    return await catchAxiosError(er);
  }
}

// * Obtener lista de productos por nombre
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
      listaProductos: res.data.lista ?? undefined,
      totalDatos: res.data.totalDatos ?? undefined,
    };

    // ! Error
  } catch (er: unknown) {
    return await catchAxiosError(er);
  }
}

// * Obtener lista de productos por stock
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
      listaProductos: res.data.lista ?? undefined,
      totalDatos: res.data.totalDatos ?? undefined,
    };

    // ! Error
  } catch (er: unknown) {
    return await catchAxiosError(er);
  }
}

// * Eliminar producto
export async function apiEliminarProducto(id: number): Promise<RespuestaApi> {
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

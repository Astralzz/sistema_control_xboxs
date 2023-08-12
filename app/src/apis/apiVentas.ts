import axios from "axios";
import API_URL, {
  RespuestaApi,
  catchAxiosError,
  comprobarApis,
} from "./apiVariables";
import { FiltroFechasGrafica } from "../functions/variables";

// * Variables
const intermedio: string = "ventas";

// * Crear nueva venta
export async function apiCrearNuevaVenta(
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
      venta: res.data.venta ?? undefined,
      mensaje: res.data.mensaje ?? undefined,
    };

    // ! Error
  } catch (er: unknown) {
    return await catchAxiosError(er);
  }
}

// * Obtener lista de ventas por id
export async function apiObtenerListaVentas(
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
      listaVentas: res.data.lista ?? undefined,
      totalDatos: res.data.totalDatos ?? undefined,
    };

    // ! Error
  } catch (er: unknown) {
    return await catchAxiosError(er);
  }
}

// * Obtener lista de ventas por id
export async function apiObtenerListaVentasPorSemanas(
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
      listaGrafica: res.data.ventasFiltradas ?? undefined,
    };

    // ! Error
  } catch (er: unknown) {
    return await catchAxiosError(er);
  }
}

// * Obtener lista de ventas por id
export async function apiObtenerListaVentasPorId(
  id: number,
  desde: number = 0,
  asta: number = 10
): Promise<RespuestaApi> {
  try {
    // ? Url no encontrada
    if (!comprobarApis()) {
      throw new Error("No se pudo encortar la url hacia el servidor");
    }
    // Ruta
    let url =
      API_URL + `${intermedio}/lista/filtrada/producto/${id}/${desde}/${asta}`;

    // Enviamos
    const res = await axios.get(url);

    // * Éxito
    return {
      estado: true,
      listaVentas: res.data.lista ?? undefined,
      totalDatos: res.data.totalDatos ?? undefined,
    };

    // ! Error
  } catch (er: unknown) {
    return await catchAxiosError(er);
  }
}

// // * Obtener lista de productos por stock
// export async function apiObtenerListaProductosPorStock(
//   stock: number,
//   desde: number = 0,
//   asta: number = 10
// ): Promise<RespuestaApi> {
//   try {   // ? Url no encontrada
// if (!comprobarApis()) {
//   throw new Error("No se pudo encortar la url hacia el servidor");
// }
//     // Ruta
//     let url =
//       API_URL + `${intermedio}/lista/filtrada/stock/${stock}/${desde}/${asta}`;

//     // Enviamos
//     const res = await axios.get(url);

//     // * Éxito
//     return {
//       estado: true,
//       listaProductos: res.data.lista ?? undefined,
//       totalDatos: res.data.totalDatos ?? undefined,
//     };

//     // ! Error
//   } catch (er: unknown) {
//     return await catchAxiosError(er);
//   }
// }

// // * Eliminar producto
// export async function apiEliminarProducto(id: number): Promise<RespuestaApi> {
//   try {   // ? Url no encontrada
// if (!comprobarApis()) {
//   throw new Error("No se pudo encortar la url hacia el servidor");
// }
//     // Ruta
//     let url = API_URL + `${intermedio}/opciones/eliminar/${id}`;

//     // Enviamos
//     const res = await axios.delete(url);

//     // * Éxito
//     return {
//       estado: true,
//       mensaje: res.data.mensaje ?? undefined,
//     };

//     // ! Error
//   } catch (er: unknown) {
//     return await catchAxiosError(er);
//   }
// }

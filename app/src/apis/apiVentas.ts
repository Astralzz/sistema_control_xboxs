import axios from "axios";
import API_URL, {
  RespuestaApi,
  catchAxiosError,
  comprobarApis,
} from "./apiVariables";
import { FiltroFechasGrafica } from "../functions/variables";
import moment from "moment-timezone";

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

// * Obtener lista de ventas
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

// * Obtener lista de ventas por dia
export async function apiObtenerListaVentasPorDia(
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
      listaVentas: res.data.lista ?? undefined,
      totalDatos: res.data.totalDatos ?? undefined,
    };

    // ! Error
  } catch (er: unknown) {
    return await catchAxiosError(er);
  }
}

// * Obtener lista de ventas por mes
export async function apiObtenerListaVentasPorMes(
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
      listaVentas: res.data.lista ?? undefined,
      totalDatos: res.data.totalDatos ?? undefined,
    };

    // ! Error
  } catch (er: unknown) {
    return await catchAxiosError(er);
  }
}

// * Obtener lista de ventas por grafica
export async function apiObtenerListaVentasPorGrafica(
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

// * Eliminar producto
export async function apiEliminarVenta(id: number): Promise<RespuestaApi> {
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

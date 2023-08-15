import axios from "axios";
import Renta from "../models/Renta";
import Xbox from "../models/Xbox";
import Producto from "../models/Producto";
import Venta from "../models/Venta";
import { DatosGrafica } from "../components/oters/GraficoDeLineas";

// // * Apis del servidor
// export const URL_SERVER: string | undefined =
//   process.env.REACT_APP_URL_SERVER ?? undefined;
// export const API_URL: string | undefined =
//   process.env.REACT_APP_URL_SERVER_API ?? undefined;

// * Apis del servidor local
export const URL_SERVER: string = "http://127.0.0.1:8000";
export const API_URL: string = `${URL_SERVER}/api/`;

// Respuesta
export interface RespuestaApi {
  // De estados
  estado: boolean;
  noEstado?: number | string;
  detalles_error?: string;
  // Listas
  listaXboxs?: Xbox[];
  listaProductos?: Producto[];
  listaRentas?: Renta[];
  listaVentas?: Venta[];
  listaGrafica?: DatosGrafica[];
  // Datos
  mensaje?: string;
  xbox?: Xbox;
  renta?: Renta;
  producto?: Producto;
  venta?: Venta;
  // Total datos
  totalDatos?: number;
  noXboxs?: number;
  noProductos?: number;
}

// * Comprobar apis
export function comprobarApis(): boolean {
  // ? No existe el servidor
  if (!URL_SERVER || !API_URL) {
    return false;
  }
  return true;
}

// * Respuesta axios
export async function catchAxiosError(er: unknown): Promise<RespuestaApi> {
  // ? Es error de axios
  if (axios.isAxiosError(er)) {
    // ? Existe response
    if (er.response) {
      return {
        estado: false,
        noEstado: "ERROR " + (er.response.status ?? "DESCONOCIDO"),
        detalles_error: er.response.data?.error,
      };
    } else {
      return {
        estado: false,
        noEstado: "ERROR 500",
        detalles_error: "No se pudo conectar al servidor",
      };
    }
  }

  // ! Errores críticos
  return {
    estado: false,
    noEstado: "ERROR CRITICO",
    detalles_error: er ? String(er) : undefined,
  };
}

export default API_URL;

import axios from "axios";
import Renta from "../models/Renta";
import Xbox from "../models/Xbox";
import Producto from "../models/Producto";

// Url oficial
const API_URL: string = "http://controlxbox/api/";

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
  // Datos
  mensaje?: string;
  xbox?: Xbox;
  renta?: Renta;
  producto?: Producto;
  // Data
  dato?: number;
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

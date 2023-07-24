import Xbox from "./Xbox";

// Todo, Modelo de la renta
// Todo, Modelo de renta
interface Renta {
  id: number;
  id_xbox: number;
  fecha: string;
  inicio: string;
  final: string | null;
  duracion: string | null;
  total: number | null;
  isPagado: boolean | string | null;
  cliente: string | null;
  comentario: string | null;
  xbox: Xbox;
}

export default Renta;

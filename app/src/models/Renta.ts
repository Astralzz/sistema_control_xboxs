import Xbox from "./Xbox";

// Todo, Modelo de la renta
interface Renta {
  id: number;
  id_xbox: number;
  fecha: string;
  inicio: string;
  final?: string;
  duracion?: string;
  total: number;
  noControles: number;
  isPagado: number;
  cliente?: string;
  comentario?: string;
  xbox: Xbox;
}

export default Renta;

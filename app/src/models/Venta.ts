// Todo, Modelo de la ventas
export interface DetalleVenta {
  id_producto: number;
  cantidad: number;
}

interface Venta {
  id: number;
  fecha: string;
  hora: string;
  noProductos: number;
  total: number;
  comentario?: string;
  detalles: DetalleVenta[];
}

export default Venta;

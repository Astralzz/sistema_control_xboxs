import Producto from "./Producto";

// Todo, Modelo de la ventas
interface Venta {
    id: number;
    id_producto: number;
    fecha: string;
    hora: string;
    noProductos: number;
    total: number;
    comentario?: string;
    producto: Producto;
  }
  
  export default Venta;
  
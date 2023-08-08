// Todo, Modelo de producto
interface Producto {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
  descripcion?: string;
  enlace_img?: string;
}

export default Producto;

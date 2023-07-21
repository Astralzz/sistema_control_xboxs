// Todo, Modelo de producto
interface Producto {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
  descripcion: string | null;
  enlace_img: string | null;
}

export default Producto;

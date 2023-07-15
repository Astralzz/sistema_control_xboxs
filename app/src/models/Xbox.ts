// Todo, Modelo de xbox
interface Xbox {
  id: number;
  nombre: string;
  estado: "DISPONIBLE" | "NO DISPONIBLE";
  descripcion: string | null;
}

export default Xbox;

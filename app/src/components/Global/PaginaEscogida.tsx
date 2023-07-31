import { Route, Routes } from "react-router";
import PaginaProductos from "../ventas/PaginaProductos";
import ComponentError from "./ComponentError";

// * Props pagina escogida
interface PaginaEscogidaProps {
  ruta: string;
}

// Todo, Pagina escogida
const PaginaEscogida: React.FC<PaginaEscogidaProps> = ({ ruta }) => {
  // ? Es el inicio
  if (ruta === "/" || ruta === "/inicio") {
    return <></>;
  }

  return (
    <Routes>
      <Route path="/productos" element={<PaginaProductos />} />
      <Route
        path="*"
        element={
          <ComponentError titulo="ERROR 404" detalles="Pagina no encontrada" />
        }
      />
    </Routes>
  );
};

export default PaginaEscogida;

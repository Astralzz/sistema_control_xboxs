import { Route, Routes } from "react-router";
import ComponentError from "./ComponentError";
import PaginaProductos from "../../pages/productos/PaginaProductos";

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

  // Todo, Componente principal
  return (
    <Routes>
      {/* Pagina de productos */}
      <Route path="/productos" element={<PaginaProductos />} />
      {/* Otras */}
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

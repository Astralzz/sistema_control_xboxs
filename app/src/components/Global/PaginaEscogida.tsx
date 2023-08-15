import { Route, Routes } from "react-router";
import ComponentError from "../oters/ComponentError";
import PaginaProductos from "../../pages/productos/PaginaProductos";
import PaginaVentas from "../../pages/ventas/PaginaVentas";
import PaginaRentas from "../../pages/rentas/PaginaRentas";

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
      <Route path="/rentas" element={<PaginaRentas />} />
      <Route path="/ventas" element={<PaginaVentas />} />
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

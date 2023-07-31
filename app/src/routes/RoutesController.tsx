import React from "react";
import BarraSuperior from "../components/BarraSuperior";
import { useLocation } from "react-router";
import ContenedorRentas from "../components/rentas/ContenedorRentas";
import PaginaEscogida from "../components/global/PaginaEscogida";
import PaginaInicio from "../pages/PaginaInicio";

// * Obtener el titulo
const obtenerTitulo = (ruta: string): string => {
  // Verificamos
  switch (ruta) {
    // Inicio
    case "/inicio":
    case "/":
      return "Inicio";

    // Inicio
    case "/xboxs":
      return "Xbox";

    // Inicio
    case "/productos":
      return "Productos";

    default:
      return "Error 404";
  }
};

// TODO, Control de las rutas
const RoutesController: React.FC = () => {
  // * Variables
  const rutaActual = useLocation().pathname;
  const titulo = obtenerTitulo(rutaActual);

  return (
    <div className="pagina-principal">
      {/* BARRA DE LA PAGINA */}
      <BarraSuperior titulo={titulo} />

      {/* Inicio */}
      <div hidden={rutaActual !== "/" && rutaActual !== "/inicio"}>
        <PaginaInicio />
      </div>

      {/* Pagina Escogida */}
      <PaginaEscogida ruta={rutaActual} />
    </div>
  );
};

export default RoutesController;

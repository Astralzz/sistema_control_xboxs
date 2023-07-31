import React from "react";
import { Container } from "react-bootstrap";
import ContenedorRentas from "../components/rentas/ContenedorRentas";

// TODO, Pagina de los xbox
const PaginaInicio: React.FC = () => {
  return (
    <Container className="pagina-inicio">
      {/* RENTAS */}
      <ContenedorRentas />
    </Container>
  );
};

export default PaginaInicio;

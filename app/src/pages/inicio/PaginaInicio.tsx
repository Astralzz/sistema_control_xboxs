import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import ContenedorInicioRentas from "./ContenedorInicioRentas";
import TarjetaVenderProducto from "../ventas/TarjetaVenderProducto";

// TODO, Pagina de los xbox
const PaginaInicio: React.FC = () => {
  return (
    <Container className="pagina-inicio">
      {/* RENTAS */}
      <ContenedorInicioRentas />
      <hr className="hr" />
      <Row>
        <Col>
          {/* vENTAS */}
          <TarjetaVenderProducto />
        </Col>
        <Col>
          {/* SERVICIOS */}
          <h4>Servicios</h4>
        </Col>
      </Row>
    </Container>
  );
};

export default PaginaInicio;

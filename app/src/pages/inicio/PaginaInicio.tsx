import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import ContenedorInicioRentas from "./ContenedorInicioRentas";
import ContenedorInicioVentas from "./ContenedorInicioVentas";

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
          <ContenedorInicioVentas />
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

import React from "react";
import { Routes, Route } from "react-router-dom";
import PaginaXboxs from "../pages/xbox/PaginaXboxs";
import { Col, Container, Row } from "react-bootstrap";
import ComponentError from "../components/global/ComponentError";
import PaginaProductos from "../pages/productos/PaginaProductos";

const ContenedorPrueba = ({ titulo }: { titulo: string }) => {
  return (
    <Container>
      <br />
      <h3>{titulo}</h3>
      <br />
    </Container>
  );
};

// TODO, Control de las rutas
const RoutesController: React.FC = () => {
  return (
    <Container className="contenedor-inicio">
      <Row>
        {/* Parte izquierda */}
        <Col lg={9} md={12} className="mb-4 derecha">
          {/* Pagina xboxs */}
          <PaginaXboxs />
        </Col>

        {/* Parte derecha */}
        <Col lg={3} md={12} className="mb-4 izquierda">
          {/* Rutas */}
          <Routes>
            <Route
              path="/xboxs"
              element={<ContenedorPrueba titulo={"xboxs"} />}
            />
            <Route path="/ventas" element={<PaginaProductos />} />
            <Route
              path="/*"
              element={
                <ComponentError
                  titulo="ERROR 404"
                  detalles="Pagina no encontrada"
                />
              }
            />
          </Routes>
        </Col>
      </Row>
    </Container>
  );
};

export default RoutesController;

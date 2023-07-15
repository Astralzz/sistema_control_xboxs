import React from "react";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import IconoBootstrap from "./IconoBootstrap";
import { Link } from "react-router-dom";

interface Ruta {
  url: string;
  nombre: string;
}

const rutas: Ruta[] = [
  { nombre: "Xboxs", url: "xboxs" },
  { nombre: "Ventas", url: "ventas" },
];

// Barra superior
const BarraSuperior: React.FC = () => {
  return (
    <Navbar expand="lg" className="barra-superior">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <IconoBootstrap
            className="icono-principal"
            nombre="Xbox"
            color="white"
            size={30}
          />
          Inovatech
        </Navbar.Brand>
        <Navbar.Collapse className="justify-content-end">
          <Nav>
            {/* Links de las rutas */}
            {rutas.map((ruta, i) => {
              return (
                <Nav.Link as={Link} to={ruta.url} key={i}>
                  {ruta.nombre}
                </Nav.Link>
              );
            })}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default BarraSuperior;

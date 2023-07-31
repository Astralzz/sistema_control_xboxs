import React from "react";
import { Container, Image, Nav, Navbar } from "react-bootstrap";
import CardHeader from "react-bootstrap/esm/CardHeader";
import imgIcono from "../assets/imgs/icono.png";
import IconoBootstrap from "./global/IconoBootstrap";
import * as Icono from "react-bootstrap-icons";
import { Link } from "react-router-dom";

// * Pagina
interface Pagina {
  titulo: string;
  url: string;
  icono: keyof typeof Icono;
}

// * Paginas
const paginas: Pagina[] = [
  {
    titulo: "Inicio",
    url: "inicio",
    icono: "HouseFill",
  },
  {
    titulo: "Xboxs",
    url: "xboxs",
    icono: "Xbox",
  },
  {
    titulo: "Productos",
    url: "productos",
    icono: "HouseFill",
  },
  {
    titulo: "Rentas",
    url: "rentas",
    icono: "HouseFill",
  },
  {
    titulo: "Ventas",
    url: "ventas",
    icono: "HouseFill",
  },
  {
    titulo: "Ajustes",
    url: "ajustes",
    icono: "GearFill",
  },
];

// Todo, Menu principal
const MenuPrincipal: React.FC = () => {
  return (
    <div className="text-white bg-dark menu-principal">
      <br />

      {/* ENCABEZADO */}
      <CardHeader>
        <Image src={imgIcono} alt="img.icono" width={70} />
        <h6>Inovatech</h6>
      </CardHeader>

      <hr className="hr" />

      {/* CUERPO PRINCIPAL */}
      <Navbar data-bs-theme="dark">
        <Container>
          <Nav className="me-auto flex-column">
            {paginas.map((pagina, i) => (
              <Nav.Link
                as={Link}
                to={"/" + pagina.url}
                key={i}
                className="d-flex align-items-center"
              >
                <IconoBootstrap nombre={pagina.icono} />

                <Nav.Item className="ms-2">{pagina.titulo}</Nav.Item>
              </Nav.Link>
            ))}
          </Nav>
        </Container>
      </Navbar>

      <hr />

      {/* PIE DEL MENU */}
      <Container className="dropdown">
        <Nav.Link
          href="#"
          className="d-flex align-items-center text-white text-decoration-none dropdown-toggle"
          id="dropdownUser1"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <img
            src="https://github.com/mdo.png"
            alt=""
            width="32"
            height="32"
            className="rounded-circle me-2"
          />
          <strong>mdo</strong>
        </Nav.Link>
      </Container>
    </div>
  );
};

export default MenuPrincipal;

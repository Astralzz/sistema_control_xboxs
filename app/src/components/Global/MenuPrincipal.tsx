import React, { useState } from "react";
import { Container, Image, Nav, Navbar } from "react-bootstrap";
import CardHeader from "react-bootstrap/esm/CardHeader";
import IconoBootstrap from "../oters/IconoBootstrap";
import * as Icono from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import PageConfig from "../../pages/config/PageConfig";

// * Imagenes
let imgIcono: string | undefined;
try {
  imgIcono = require("../../assets/imgs/imgIcono.png");
} catch (error) {
  imgIcono = undefined;
}

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
  // {
  //   titulo: "Xboxs",
  //   url: "xboxs",
  //   icono: "Xbox",
  // },
  {
    titulo: "Productos",
    url: "productos",
    icono: "BoxFill",
  },
  {
    titulo: "Rentas",
    url: "rentas",
    icono: "AlarmFill",
  },
  {
    titulo: "Ventas",
    url: "ventas",
    icono: "BagFill",
  },
];

// Todo, Menu principal
const MenuPrincipal: React.FC = () => {
  const [isEstadoModal, setEstadoModal] = useState<boolean>(false);

  return (
    <>
      <div className="text-white bg-dark menu-principal">
        <br />

        {/* ENCABEZADO */}
        <CardHeader>
          {imgIcono && <Image src={imgIcono} alt="img.icono" width={70} />}
          <h6
            style={{
              marginTop: 10,
            }}
          >
            Control xbox
          </h6>
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
                  {/* d-none d-lg-block */}
                  <Nav.Item className="ms-2 d-none d-lg-block">
                    {pagina.titulo}
                  </Nav.Item>
                </Nav.Link>
              ))}

              <Nav.Link
                onClick={() => setEstadoModal(true)}
                className="d-flex align-items-center"
              >
                <IconoBootstrap nombre={"GearFill"} />
                {/* d-none d-lg-block */}
                <Nav.Item className="ms-2 d-none d-lg-block">Ajustes</Nav.Item>
              </Nav.Link>
            </Nav>
          </Container>
        </Navbar>

        {/* <hr /> */}

        {/* PIE DEL MENU */}
        {/* <Container className="dropdown">
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
      </Container> */}
      </div>

      <PageConfig
        cerrarModal={() => setEstadoModal(false)}
        estadoModal={isEstadoModal}
      />
    </>
  );
};

export default MenuPrincipal;

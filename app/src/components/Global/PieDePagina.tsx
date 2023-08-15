import React from "react";
import { Col, Container, Row } from "react-bootstrap";

interface Enlace {
  leyenda: string;
  url: string;
}

const enlaces: Enlace[] = [
  {
    leyenda: "GitHub",
    url: "#",
  },
  {
    leyenda: "LinkedIn",
    url: "#",
  },
  {
    leyenda: "Email",
    url: "#",
  },
];

// TODO, Pie de pagina
const PieDePagina: React.FC = () => {
  return (
    <footer className="pie-de-pagina">
      {/* Linea blanca */}
      <div className="linea-blanca"></div>

      {/* Contenido */}
      <Container className="p-4">
        <Row>
          <Col lg={6} md={12} className="mb-4">
            <h5 className="mb-3">Ultima nota agregada</h5>
            <p>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iste
              atque ea quis molestias. Fugiat pariatur maxime quis culpa
              corporis vitae repudiandae aliquam voluptatem veniam, est atque
              cumque eum delectus sint!
            </p>
          </Col>
          <Col lg={3} md={6} className="mb-4">
            {/* Enlaces externos */}
            <h5 className="mb-3 ">Enlaces</h5>
            <ul className="list-unstyled mb-0">
              {enlaces.map((enlace, i) => {
                return (
                  <li key={i} className="mb-1">
                    <a href={enlace.url} className="link">
                      {enlace.leyenda}
                    </a>
                  </li>
                );
              })}
            </ul>
          </Col>
          {/* Horario  */}
          <Col lg={3} md={6} className="mb-4">
            <h5 className="mb-1 ">Horario</h5>
            <table className="table" style={{ borderColor: "#666" }}>
              <tbody>
                <tr>
                  <td>Lun - Sáb:</td>
                  <td>10am - 9pm</td>
                </tr>
                <tr>
                  <td>dom:</td>
                  <td>10am - 7pm</td>
                </tr>
              </tbody>
            </table>
          </Col>
        </Row>
      </Container>
      <div
        className="text-center p-3"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
      >
        © 2023-2029 Copyright:{" "}
        <a className="" href="https://github.com/Astralzz">
          ByAstralz.com
        </a>
      </div>
    </footer>
  );
};

export default PieDePagina;

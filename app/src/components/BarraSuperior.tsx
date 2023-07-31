import React from "react";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import IconoBootstrap from "./global/IconoBootstrap";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";

// * Props
interface Props {
  titulo: string;
}

// Barra superior
const BarraSuperior: React.FC<Props> = (props) => {
  return (
    <Navbar expand="lg" className="barra-superior">
      <Container>
        {/* <Button>A</Button> */}

        {/* Titulo */}
        <Navbar.Collapse className="justify-content-end">
          <h4>{props.titulo}</h4>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default BarraSuperior;

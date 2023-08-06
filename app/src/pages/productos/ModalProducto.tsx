import React, { Dispatch, useState } from "react";
import Producto from "../../models/Producto";
import { Container, Offcanvas } from "react-bootstrap";

// * Props
interface Props {
  producto?: Producto;
  cerrarModal: Dispatch<void>;
  estadoModal: boolean;
  titulo: string;
  // aumentarXbox?: (x: Xbox) => void;
  // actualizarXbox?: (id: number, xboxActualizado: Xbox) => void;
}

// Todo, Modal del producto
const ModalProducto: React.FC<Props> = (props) => {
  // * Al cerrar
  const alCerrar = (): void => {
    // setCargando(false);
    props.cerrarModal();
  };

  return (
    <Offcanvas show={props.estadoModal} onHide={alCerrar} placement="end">
      {/* ENCABEZADO */}
      <Offcanvas.Header
        className="modal-derecho"
        closeButton
        closeVariant="white"
      >
        {/* Titulo */}
        <Offcanvas.Title>{props.titulo}</Offcanvas.Title>
      </Offcanvas.Header>

      {/* CUERPO */}
      <Offcanvas.Body className="modal-derecho">
        Some text as placeholder. In real life you can have the elements you
        have chosen. Like, text, images, lists, etc.
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default ModalProducto;

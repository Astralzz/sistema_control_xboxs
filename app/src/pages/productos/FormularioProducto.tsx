import React, { useState } from "react";
import Producto from "../../models/Producto";
import { Container } from "react-bootstrap";

// * Props
interface Props {
  producto?: Producto;
  // aumentarXbox?: (x: Xbox) => void;
  // actualizarXbox?: (id: number, xboxActualizado: Xbox) => void;
}

// Todo, Formulario de producto
const FormularioProducto: React.FC<Props> = (props) => {
  // * Variables
  const [nombre, setNombre] = useState<string>(props.producto?.nombre ?? "");
  const [precio, setPrecio] = useState<number>(props.producto?.precio ?? 0);
  const [stock, setStock] = useState<number>(props.producto?.stock ?? 0);
  const [descripcion, setDescripcion] = useState<string>(
    props.producto?.descripcion ?? ""
  );

  return <Container></Container>;
};

export default FormularioProducto;

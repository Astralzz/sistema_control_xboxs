import React, { useState } from "react";
import { Container } from "react-bootstrap";
import Producto from "../../models/Producto";

// TODO, Pagina de lso productos
const PaginaProductos: React.FC = () => {
  // * Variables
  const [producto, setProducto] = useState<Producto | null>(null);
  const [listaProductos, setListaProductos] = useState<Producto[]>([]);

  return (
    <>
      {/* CONTENEDOR */}
      <Container>
        <h3>Realizar venta</h3>
      </Container>
    </>
  );
};

export default PaginaProductos;

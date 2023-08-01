import React, { useState } from "react";
import { Button, Container } from "react-bootstrap";
import Producto from "../../models/Producto";
import { detenerAlarma, reproducirAlarma } from "../../functions/alarma";

let id: string = "";

// TODO, Pagina de lso productos
const ContenedorVenta: React.FC = () => {
  // * Variables
  const [producto, setProducto] = useState<Producto | null>(null);
  const [listaProductos, setListaProductos] = useState<Producto[]>([]);

  return (
    <>
      {/* CONTENEDOR */}
      <Container>
        <h3>Realizar venta</h3>

        <Button
          onClick={() => {
            id = reproducirAlarma();
          }}
        >
          Reproducir sonido
        </Button>

        <Button onClick={() => detenerAlarma(id)}>Parar sonido</Button>
      </Container>
    </>
  );
};

export default ContenedorVenta;

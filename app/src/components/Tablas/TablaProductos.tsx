import React, { Dispatch, useEffect, useState } from "react";
import {
  Button,
  Container,
  Form,
  InputGroup,
  Navbar,
  Pagination,
  Spinner,
  Table,
} from "react-bootstrap";
import IconoBootstrap from "../global/IconoBootstrap";
import Producto from "../../models/Producto";
import {
  Paginacion,
  calcularPaginaciones,
} from "../../functions/funcionesGlobales";
import { TextoLargoElement } from "../global/Otros";
import {
  regexBuscarTitulo,
  regexNumerosEnteros,
} from "../../functions/variables";

// * Estilos
const styles: React.CSSProperties = {
  backgroundColor: "transparent",
  color: "var(--color-letra)",
  border: "none",
  borderBottom: "1px solid white",
};

// * Columnas
export interface ColumnasProducto {
  no?: boolean;
  nombre?: boolean;
  precio?: boolean;
  stock?: boolean;
  descripcion?: boolean;
  masInf?: boolean;
}

// * Props
interface Props {
  lista: Producto[];
  totalProductos: number;
  columnas: ColumnasProducto;
  setCargandoTabla: Dispatch<boolean>;
  setProductoSeleccionado: Dispatch<Producto | null>;
  obtenerMasDatos: (
    desde: number,
    asta: number,
    nombre?: string,
    stock?: number
  ) => void;
  isCargandoTabla: boolean;
}

// Todo, Tabla Rentas
const TablaProductos: React.FC<Props> = (props) => {
  // * Variables
  const [listaPaginaciones, setListaPaginaciones] = useState<Paginacion[]>([]);
  const [pagSeleccionada, setPaginaSeleccionada] = useState<number>(0);
  const [textBuscarTitulo, setTextBuscarTitulo] = useState<string>("");
  const [textBuscarCantidad, setTextBuscarCantidad] = useState<string>("");

  // * Al cambiar
  useEffect(() => {
    // Total
    const pag: Paginacion[] = calcularPaginaciones(props.totalProductos);
    setListaPaginaciones(pag);
  }, [props.totalProductos]);

  return (
    <div>
      {/* BARRA SUPERIOR */}
      <Navbar className="bg-body-transparent justify-content-end">
        <Container>
          {/* Todos los productos */}
          <div className="boton-buscar">
            <Button
              className="bt-b"
              onClick={() => props.obtenerMasDatos(0, 10)}
            >
              Todos
            </Button>
          </div>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            {/* Stock */}
            <InputGroup className="placeholder-blanco">
              <Form.Control
                placeholder="buscar cantidad"
                type="text"
                style={styles}
                className={
                  textBuscarCantidad === ""
                    ? ""
                    : regexNumerosEnteros.test(textBuscarCantidad)
                    ? "is-valid"
                    : "is-invalid"
                }
                value={String(textBuscarCantidad)}
                onChange={(t) => setTextBuscarCantidad(t.target.value)}
              />
              <div className="boton-buscar">
                <Button
                  disabled={!regexNumerosEnteros.test(textBuscarCantidad)}
                  className="bt-b"
                  onClick={() =>
                    props.obtenerMasDatos(
                      0,
                      10,
                      undefined,
                      Number(textBuscarCantidad)
                    )
                  }
                >
                  Buscar
                </Button>
              </div>
            </InputGroup>
          </Navbar.Collapse>
        </Container>

        {/* Nombre */}
        <InputGroup className="placeholder-blanco">
          <Form.Control
            placeholder="buscar por nombre"
            type="text"
            style={styles}
            className={
              textBuscarTitulo === ""
                ? ""
                : regexBuscarTitulo.test(textBuscarTitulo)
                ? "is-valid"
                : "is-invalid"
            }
            value={textBuscarTitulo}
            onChange={(t) => setTextBuscarTitulo(t.target.value)}
          />
          <div className="boton-buscar">
            <Button
              disabled={!regexBuscarTitulo.test(textBuscarTitulo)}
              onClick={() => props.obtenerMasDatos(0, 10, textBuscarTitulo)}
              className="bt-b"
            >
              Buscar
            </Button>
          </div>
        </InputGroup>
      </Navbar>
      {/* TABLA */}
      <Table responsive bordered variant="dark" style={{ marginBottom: 0 }}>
        {/* TÍTULOS */}
        <thead>
          <tr>
            {props.columnas.no && <th>No</th>}
            {props.columnas.nombre && <th>Nombre</th>}
            {props.columnas.precio && <th>Precio</th>}
            {props.columnas.stock && <th>Stock</th>}
            {props.columnas.descripcion && <th>Descripcion</th>}
            {props.columnas.masInf && <th>Ver</th>}
          </tr>
        </thead>
        {/* FILAS */}
        <tbody>
          {/* Recorremos */}
          {props.lista.map((producto, i) => {
            // ? Esta cargando
            if (props.isCargandoTabla) {
              return (
                <tr key={i}>
                  {/* Numero */}
                  {props.columnas.no && (
                    <td>
                      {listaPaginaciones[pagSeleccionada]
                        ? listaPaginaciones[pagSeleccionada].desde + (i + 1)
                        : i + 1}
                    </td>
                  )}
                  {/* Cargando */}
                  {[1, 2, 3, 4, 5].map((j) => {
                    return (
                      <td key={j + i}>
                        <Spinner animation="grow" size="sm" />
                      </td>
                    );
                  })}
                </tr>
              );
            }

            // Todo, Datos tabla
            return (
              <tr key={i} className="text-left">
                {/* Numero */}
                {props.columnas.no && (
                  <td>
                    {listaPaginaciones[pagSeleccionada]
                      ? listaPaginaciones[pagSeleccionada].desde + (i + 1)
                      : i + 1}
                  </td>
                )}
                {/* Nombre */}
                {props.columnas.nombre && (
                  <TextoLargoElement
                    lg={20}
                    texto={producto.nombre}
                    i={producto.id}
                  />
                )}
                {/* Precio */}
                {props.columnas.precio && <td>{producto.precio}</td>}
                {/* Stock */}
                {props.columnas.stock && <td>{producto.stock}</td>}
                {/* Descripcion */}
                {props.columnas.descripcion && (
                  <TextoLargoElement
                    texto={producto.descripcion}
                    i={producto.id}
                  />
                )}
                {/* Mas información */}
                {props.columnas.masInf && (
                  <td>
                    <IconoBootstrap
                      onClick={() => props.setProductoSeleccionado(producto)}
                      nombre={"EyeFill"}
                    />
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </Table>
      {/* PAGINACION */}
      <Pagination size="sm" className="pagination-tabla">
        {listaPaginaciones.map((pagina, i) => {
          return (
            <Pagination.Item
              active={pagSeleccionada === i}
              key={i}
              onClick={() => {
                setPaginaSeleccionada(i);
                props.obtenerMasDatos(pagina.desde, pagina.asta);
              }}
            >
              {i + 1}
            </Pagination.Item>
          );
        })}
      </Pagination>
    </div>
  );
};

export default TablaProductos;

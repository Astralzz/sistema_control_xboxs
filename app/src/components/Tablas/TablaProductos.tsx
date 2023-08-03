import React, { Dispatch, useEffect, useState } from "react";
import {
  Button,
  Col,
  Form,
  InputGroup,
  Navbar,
  Pagination,
  Row,
  Table,
} from "react-bootstrap";
import IconoBootstrap from "../global/IconoBootstrap";
import Producto from "../../models/Producto";
import {
  Paginacion,
  calcularPaginaciones,
} from "../../functions/funcionesGlobales";
import { TextoLargoElement } from "../global/Otros";
import ReactLoading from "react-loading";
import { regexBuscar } from "../../functions/variables";

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
  obtenerMasDatos: (desde: number, asta: number) => void;
  isCargandoTabla: boolean;
}

// Todo, Tabla Rentas
const TablaProductos: React.FC<Props> = (props) => {
  // * Variables
  const [totalPaginaciones, setTotalPaginaciones] = useState<Paginacion[]>([]);
  const [textBuscar, setTextBuscar] = useState<string>("");

  // * Al cambiar
  useEffect(() => {
    // Total
    const pag: Paginacion[] = calcularPaginaciones(props.totalProductos);
    setTotalPaginaciones(pag);
  }, [props.totalProductos]);

  return (
    <div>
      {/* Narval */}
      <Navbar className="bg-body-transparent justify-content-end">
        {/* Precio */}
        <InputGroup>
          <Form.Control
            placeholder="buscar"
            type="text"
            style={styles}
            className={
              textBuscar === ""
                ? ""
                : regexBuscar.test(textBuscar)
                ? "is-valid"
                : "is-invalid"
            }
            value={textBuscar}
            onChange={(t) => setTextBuscar(t.target.value)}
          />
          <div className="boton-buscar">
            <Button disabled={!regexBuscar.test(textBuscar)} className="bt-b">
              Buscar
            </Button>
          </div>
        </InputGroup>

        {/* Nombre */}
        <InputGroup>
          <Form.Control
            placeholder="buscar"
            type="text"
            style={styles}
            className={
              textBuscar === ""
                ? ""
                : regexBuscar.test(textBuscar)
                ? "is-valid"
                : "is-invalid"
            }
            value={textBuscar}
            onChange={(t) => setTextBuscar(t.target.value)}
          />
          <div className="boton-buscar">
            <Button disabled={!regexBuscar.test(textBuscar)} className="bt-b">
              Buscar
            </Button>
          </div>
        </InputGroup>
      </Navbar>

      {/* Tabla */}
      <Table responsive bordered variant="dark">
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
            return (
              <tr key={i} className="text-left">
                {/* Numero */}
                {props.columnas.no && <td>{i + 1}</td>}
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

      <Pagination size="sm" className="pagination-tabla">
        {totalPaginaciones.map((pagina, i) => {
          return (
            <Pagination.Item
              key={i}
              onClick={() => props.obtenerMasDatos(pagina.desde, pagina.asta)}
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

import React, { Dispatch, useEffect, useState } from "react";
import { Pagination, Table } from "react-bootstrap";
import IconoBootstrap from "../global/IconoBootstrap";
import Producto from "../../models/Producto";
import { calcularPaginaciones } from "../../functions/funcionesGlobales";
import { TextoLargoElement } from "../global/Otros";

const noDatosPorPagina: number = 10;

// * Columnas
export interface ColumnasProducto {
  no?: boolean;
  nombre?: boolean;
  precio?: boolean;
  stock?: boolean;
  descripcion?: boolean;
  masInf?: boolean;
}

// * Pagina
interface Pagina {
  leyenda?: string;
  desde: number;
  asta: number;
}

// * Props
interface Props {
  lista: Producto[];
  totalProductos: number;
  columnas: ColumnasProducto;
  setCargandoTabla: Dispatch<boolean>;
  setProductoSeleccionado: Dispatch<Producto | null>;
}

// Todo, Tabla Rentas
const TablaProductos: React.FC<Props> = (props) => {
  // * Variables
  const [totalPaginaciones, setTotalPaginaciones] = useState<Pagina[]>([]);

  // * Al cambiar
  useEffect(() => {
    // Total
    const t: number = calcularPaginaciones(props.totalProductos);

    // * Recorremos
    const paginas: Pagina[] = [];
    for (let i = 0; i < t; i++) {
      i = i + 1;

      paginas.push({
        desde: i * noDatosPorPagina,
        asta: i * (noDatosPorPagina * 2),
      });
    }

    setTotalPaginaciones(paginas);
  }, [props.totalProductos]);

  return (
    <div>
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
      {/* Pagination */}
      <div className="d-flex justify-content-start">
        <Pagination size="sm" className="pagination-tabla">
          {totalPaginaciones.map((pagina, i) => {
            return (
              <Pagination.Item key={i}>
                {pagina.leyenda ?? i + 1}
              </Pagination.Item>
            );
          })}
        </Pagination>
      </div>
    </div>
  );
};

export default TablaProductos;

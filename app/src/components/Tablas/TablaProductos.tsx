import React, { Dispatch } from "react";
import { Table } from "react-bootstrap";
import IconoBootstrap from "../global/IconoBootstrap";
import Producto from "../../models/Producto";

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
  columnas: ColumnasProducto;
  setCargandoTabla: Dispatch<boolean>;
  setProductoSeleccionado: Dispatch<Producto | null>;
}

// Todo, Tabla Rentas
const TablaProductos: React.FC<Props> = (props) => {
  return (
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
            <tr key={i}>
              {/* Numero */}
              {props.columnas.no && <td>{i + 1}</td>}
              {/* Nombre */}
              {props.columnas.nombre && <td>{producto.nombre}</td>}
              {/* Precio */}
              {props.columnas.precio && <td>{producto.precio}</td>}
              {/* Stock */}
              {props.columnas.stock && <td>{producto.stock}</td>}
              {/* Descripcion */}
              {props.columnas.descripcion && <td>{producto.descripcion}</td>}
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
  );
};

export default TablaProductos;

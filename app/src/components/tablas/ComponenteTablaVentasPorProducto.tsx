import React, { useCallback, useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import Producto from "../../models/Producto";
import {
  ComponenteCargandoTablaLineas,
  TextoLargoTablaElement,
} from "../oters/Otros";
import Venta from "../../models/Venta";
import {
  alertaSwal,
  convertirDetalles,
  formatearFecha,
  formatearHoraSinSegundos,
} from "../../functions/funcionesGlobales";
import { RespuestaApi } from "../../apis/apiVariables";
import { apiObtenerListaVentasPorId } from "../../apis/apiVentas";

// * Columnas
export interface ColumnasVentas {
  no?: boolean;
  fecha?: boolean;
  hora?: boolean;
  noProductos?: boolean;
  total?: boolean;
  comentario?: boolean;
  masInf?: boolean;
}

interface Props {
  producto: Producto;
  isEstadoModal: boolean;
  desde?: number;
  asta?: number;
  columnas: ColumnasVentas;
}

// Todo, Tabla Productos
const ComponenteTablaVentasPorProducto: React.FC<Props> = (props) => {
  // * Variables
  const [listaVentas, setListaVentas] = useState<Venta[]>([]);
  const [isCargando, setCargando] = useState<boolean>(false);

  // * Obtenemos ventas
  const obtenerVentas = useCallback(async () => {
    try {
      setCargando(true);

      // id del producto
      const id = props.producto.id;

      // Obtenemos
      const res: RespuestaApi = await apiObtenerListaVentasPorId(
        id,
        props.desde,
        props.asta
      );

      // ? Error
      if (!res.estado) {
        throw new Error(
          res.detalles_error ?? "No se pudieron obtener la ventas"
        );
      }

      // ? Llego la lista
      if (!res.listaVentas) {
        throw new Error("La lista de ventas no llego correctamente");
      }

      // Convertir los detalles de cada venta
      const ventasConvertidas: Venta[] = res.listaVentas.map(convertirDetalles);

      // * Éxito
      setListaVentas(ventasConvertidas);
    } catch (error: unknown) {
      alertaSwal("Error", String(error), "error");
    } finally {
      setCargando(false);
    }
  }, [props]);

  // * Al cambiar
  useEffect(() => {
    if (props.isEstadoModal) {
      obtenerVentas();
    }
  }, [obtenerVentas, props]);

  return (
    <>
      {isCargando ? (
        // ? Cargando
        <ComponenteCargandoTablaLineas filas={13} />
      ) : listaVentas.length < 1 ? (
        // ? Es vacía
        <div className="contenedor-centrado">
          <h4>Este producto no tiene ventas</h4>
        </div>
      ) : (
        // Tabla de las ultimas n ventas
        <Table responsive bordered variant="dark">
          {/* TÍTULOS */}
          <thead>
            <tr>
              {props.columnas.no && <th>No</th>}
              {props.columnas.fecha && <th>Fecha</th>}
              {props.columnas.hora && <th>Hora</th>}
              {props.columnas.noProductos && <th>Cantidad</th>}
              {props.columnas.total && <th>Total</th>}
              {props.columnas.comentario && <th>Comentario</th>}
            </tr>
          </thead>
          {/* FILAS */}
          <tbody>
            {/* Recorremos */}
            {listaVentas.map((venta, i) => {
              return (
                <tr key={i}>
                  {/* Numero */}
                  {props.columnas.no && <td>{i + 1}</td>}
                  {/* Fecha */}
                  {props.columnas.fecha && (
                    <td>{formatearFecha(venta.fecha) ?? venta.fecha}</td>
                  )}
                  {/* Hora */}
                  {props.columnas.hora && (
                    <td>
                      {formatearHoraSinSegundos(venta.hora) ?? venta.hora}
                    </td>
                  )}
                  {/* Precio */}
                  {props.columnas.noProductos && <td>{venta.noProductos}</td>}
                  {/* Total */}
                  {props.columnas.total && <td>{`$${venta.total}`}</td>}
                  {/* Comentario */}
                  {props.columnas.comentario && (
                    <TextoLargoTablaElement
                      lg={1}
                      texto={venta.comentario ?? ""}
                      i={venta.id}
                    />
                  )}
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default ComponenteTablaVentasPorProducto;

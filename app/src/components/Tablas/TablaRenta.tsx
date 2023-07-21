import React, { useState } from "react";
import { Table } from "react-bootstrap";
import Renta from "../../models/Renta";
import {
  formatearFecha,
  formatearHoraSinSegundos,
} from "../../functions/funcionesGlobales";
import IconoBootstrap from "../global/IconoBootstrap";
import InfModalRenta from "../modales/InfModalRenta";

// * Columnas
export interface ColumnasRenta {
  no?: boolean;
  fecha?: boolean;
  inicio?: boolean;
  final?: boolean;
  duracion?: boolean;
  total?: boolean;
  cliente?: boolean;
  comentario?: boolean;
  xbox?: boolean;
  masInf?: boolean;
}

interface Props {
  lista: Renta[];
  columnas: ColumnasRenta;
}

// Todo, Tabla Rentas
const TablaRentas: React.FC<Props> = (props) => {
  // * Variables
  const [isEstadoModal, setEstadoModal] = useState<boolean>(false);
  const [rentaSeleccionada, setRentaSeleccionada] = useState<Renta | null>(
    null
  );

  // * Acciones modal
  const cerrarModal = () => {
    setRentaSeleccionada(null);
    setEstadoModal(false);
  };
  const abrirModal = () => setEstadoModal(true);

  // * Seleccionar renta
  const seleccionarRenta = (renta: Renta): void => {
    setRentaSeleccionada(renta);
    abrirModal();
  };

  return (
    <>
      {/* TABLA */}
      <Table responsive bordered variant="dark">
        {/* TÍTULOS */}
        <thead>
          <tr>
            {props.columnas.no && <th>No</th>}
            {props.columnas.fecha && <th>Fecha</th>}
            {props.columnas.inicio && <th>Inicio</th>}
            {props.columnas.final && <th>Final</th>}
            {props.columnas.duracion && <th>Min</th>}
            {props.columnas.total && <th>Total</th>}
            {props.columnas.cliente && <th>Cliente</th>}
            {props.columnas.comentario && <th>Comentario</th>}
            {props.columnas.masInf && <th>Ver</th>}
          </tr>
        </thead>
        {/* FILAS */}
        <tbody>
          {/* Recorremos */}
          {props.lista.map((renta, i) => {
            return (
              <tr key={i}>
                {/* Numero */}
                {props.columnas.no && <td>{i + 1}</td>}
                {/* Fecha */}
                {props.columnas.fecha && (
                  <td>{formatearFecha(renta.fecha) ?? renta.fecha}</td>
                )}
                {/* Inicio */}
                {props.columnas.inicio && (
                  <td>
                    {formatearHoraSinSegundos(renta.inicio) ?? renta.inicio}
                  </td>
                )}
                {/* Final */}
                {props.columnas.final && (
                  <td>{renta.final ? renta.final : "N/A"}</td>
                )}
                {/* Duracion */}
                {props.columnas.duracion && (
                  <td>{renta.duracion ? renta.duracion : "N/A"}</td>
                )}
                {/* Total */}
                {props.columnas.total && <td>{"$ " + renta.total}</td>}
                {/* Cliente */}
                {props.columnas.cliente && (
                  <td>{renta.cliente ? renta.cliente : ""}</td>
                )}
                {/* Comentario */}
                {props.columnas.comentario && (
                  <td>{renta.comentario ? renta.comentario : ""}</td>
                )}
                {/* Mas información */}
                {props.columnas.masInf && (
                  <td>
                    <IconoBootstrap
                      onClick={() => seleccionarRenta(renta)}
                      nombre={"EyeFill"}
                    />
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </Table>
      {/* MODAL INFORMACIÓN */}
      <InfModalRenta
        cerrarModal={cerrarModal}
        estadoModal={isEstadoModal}
        renta={rentaSeleccionada}
      />
    </>
  );
};

export default TablaRentas;

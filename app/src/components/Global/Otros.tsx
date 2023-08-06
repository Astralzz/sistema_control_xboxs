import React from "react";
import { OverlayTrigger, Spinner, Tooltip } from "react-bootstrap";
import { Paginacion } from "../../functions/funcionesGlobales";

// * Para textos largos
export const TextoLargoElement = ({
  lg,
  texto,
  i,
}: {
  lg?: number;
  texto: string | null;
  i: number;
}) => {
  // Descripcion
  return texto ? (
    // ? Es mayor a lg
    texto.length > (lg ?? 15) ? (
      <OverlayTrigger
        key={i}
        placement="auto-start"
        overlay={
          <Tooltip id={`descripcion-${i}`}>
            <strong>{texto}</strong>
          </Tooltip>
        }
      >
        <td>{texto.substring(0, lg ?? 15) + "..."}</td>
      </OverlayTrigger>
    ) : (
      <td>{texto}</td>
    )
  ) : (
    <td>{""}</td>
  );
};

// * Cargando Tabla
export const ComponenteCargandoTabla = ({
  no,
  filas,
  columnas,
  paginaciones,
  pagSeleccionada,
}: {
  no: boolean;
  filas: number;
  columnas: number;
  paginaciones: Paginacion[];
  pagSeleccionada: number;
}) => {
  // Arreglos
  let arrayFilas: number[] = Array.from({ length: filas }, (_, i) => i + 1);
  let arrayColumnas: number[] = Array.from(
    { length: columnas },
    (_, i) => i + 1
  );

  // Recorremos
  return (
    <tbody>
      {arrayFilas.map((f) => {
        return (
          <tr key={f}>
            {/* Numero */}
            {no && (
              <td>
                {paginaciones[pagSeleccionada]
                  ? paginaciones[pagSeleccionada].desde + f
                  : f}
              </td>
            )}
            {/* Cargando */}
            {arrayColumnas.map((c) => {
              return (
                <td key={c + f}>
                  <Spinner animation="grow" size="sm" />
                </td>
              );
            })}
          </tr>
        );
      })}
    </tbody>
  );
};

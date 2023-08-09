import React from "react";
import { OverlayTrigger, Placeholder, Spinner, Tooltip } from "react-bootstrap";
import { Paginacion } from "../../functions/funcionesGlobales";

// * Para textos largos en tabla
export const TextoLargoTablaElement = ({
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

// * Para textos largos en párrafos
export const TextoLargoParrafoElement = ({
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
        <p>{texto.substring(0, lg ?? 15) + "..."}</p>
      </OverlayTrigger>
    ) : (
      <p>{texto}</p>
    )
  ) : (
    <p>{""}</p>
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

// * Cargando tabla 2
export const ComponenteCargandoTablaLineas = ({
  filas,
  rDesde = 10,
  rAsta = 2,
}: {
  filas: number;
  rDesde?: number;
  rAsta?: number;
}) => {
  // Arreglo
  let arrayFilas: number[] = Array.from({ length: filas }, (_, i) => i + 1);

  return (
    <>
      {/* Cargando */}
      {arrayFilas.map((n) => {
        // n aleatorio desde asta
        const nr: number = Math.floor(Math.random() * (rDesde + 1)) + rAsta;

        return (
          <Placeholder key={n} animation="glow">
            <Placeholder xs={nr} />
          </Placeholder>
        );
      })}
    </>
  );
};

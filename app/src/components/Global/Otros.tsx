import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

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
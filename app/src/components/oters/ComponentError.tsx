import React, { Dispatch, SetStateAction, useState } from "react";
import IconoBootstrap from "./IconoBootstrap";
import * as icons from "react-bootstrap-icons";

// * Data error
export interface DataError {
  estado: boolean;
  titulo?: string;
  detalles?: string;
}

// * props
interface Props extends icons.IconProps {
  titulo?: string;
  detalles?: string;
  accionVoid?: Dispatch<SetStateAction<void>>;
  icono?: keyof typeof icons;
  nombreClase?: string;
}

// Todo, Tabla Rentas
const ComponentError: React.FC<Props> = (props) => {
  // * Variables
  const [iconoRotado, setIconoRotado] = useState(false);

  // * Rotar icono
  const rotarIcono = () => {
    setIconoRotado(true);
    setTimeout(() => {
      setIconoRotado(false);
      props.accionVoid?.();
    }, 1500);
  };

  return (
    <div className={props.nombreClase ?? "contenedor-centrado"}>
      <div>
        {/* Titulo */}
        <h1>{props.titulo}</h1>
        {/* Detalles */}
        {props.detalles && <p>{props.detalles}</p>}
        {/* Icono */}
        {props.accionVoid && (
          <IconoBootstrap
            onClick={rotarIcono}
            nombre={props.icono ? props.icono : "ArrowClockwise"}
            color="white"
            size={30}
            className={`icono-error ${iconoRotado ? "rotar-icono" : ""}`}
          />
        )}
      </div>
    </div>
  );
};

export default ComponentError;

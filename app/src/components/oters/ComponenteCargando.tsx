import React from "react";
import ReactLoading, { LoadingType } from "react-loading";

// * Props
interface Props {
  tipo: LoadingType;
  estadoModal: boolean;
}

// * Estilos
const modalStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999,
};

// Todo, ComponenteCargando
const ComponenteCargando: React.FC<Props> = (props) => {
  if (!props.estadoModal) {
    return <></>;
  }

  return (
    <div style={modalStyle}>
      <ReactLoading type={props.tipo} color="#FFF" />
    </div>
  );
};

export default ComponenteCargando;

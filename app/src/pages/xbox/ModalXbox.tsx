import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Offcanvas } from "react-bootstrap";
import Xbox from "../../models/Xbox";
import Renta from "../../models/Renta";
import { RespuestaApi } from "../../apis/apiVariables";
import apiObtenerListaRentasPorXbox from "../../apis/apiRentas";
import TablaRentas, { ColumnasRenta } from "../../components/Tablas/TablaRenta";
import ComponentError, {
  DataError,
} from "../../components/Global/ComponentError";

// * Columnas
const columnas: ColumnasRenta = {
  fecha: true,
  inicio: true,
  duracion: true,
  total: true,
};

// * Props
interface Props {
  xbox: Xbox;
  acción: Dispatch<SetStateAction<void>>;
  estado: boolean;
}

// Todo, Carta de xbox
const ModalXbox: React.FC<Props> = (props) => {
  // * Variables
  const [listaRentas, setListaRentas] = useState<Renta[]>([]);
  const [isError, setError] = useState<DataError>({
    estado: false,
  });

  // * Obtener xbox
  const obtenerUltimasVentas = useCallback(async () => {
    // * Buscamos
    const res: RespuestaApi = await apiObtenerListaRentasPorXbox(props.xbox.id);

    // ? Es falso
    if (!res.estado) {
      setError({
        estado: true,
        titulo: res.noEstado ? String(res.noEstado) : undefined,
        detalles: res.detalles_error ? String(res.detalles_error) : undefined,
      });
      return;
    }

    // * Sin errores
    setError({ estado: false });

    // Ponemos lista
    setListaRentas(res.listaRentas ?? []);
  }, [props.xbox.id]);

  // * Buscamos
  useEffect(() => {
    obtenerUltimasVentas();
  }, [obtenerUltimasVentas, props]);

  return (
    <Offcanvas show={props.estado} onHide={props.acción}>
      {/* ENCABEZADO */}
      <Offcanvas.Header
        className="modal-izquierdo"
        closeButton
        closeVariant="white"
      >
        {/* Titulo */}
        <Offcanvas.Title>{props.xbox.nombre}</Offcanvas.Title>
      </Offcanvas.Header>
      {/* CUERPO */}
      <Offcanvas.Body className="modal-izquierdo">
        {/* ERROR */}
        {isError.estado ? (
          <ComponentError titulo={isError.titulo} detalles={isError.detalles} />
        ) : (
          <>
            {/* Información */}
            <p>
              {props.xbox.descripcion && props.xbox.descripcion !== ""
                ? props.xbox.descripcion
                : "No existe una descripción para este xboxs"}
            </p>

            <br />

            <h6>{"Últimas 10 rentas:"}</h6>

            {/* Lista no vacía */}
            {Array.isArray(listaRentas) && listaRentas.length > 0 && (
              <TablaRentas lista={listaRentas} columnas={columnas} />
            )}

            <br />
          </>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default ModalXbox;

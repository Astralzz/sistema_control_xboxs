import React, { Dispatch, useCallback, useEffect, useState } from "react";
import { Offcanvas, Stack } from "react-bootstrap";
import Xbox from "../../models/Xbox";
import Renta from "../../models/Renta";
import { RespuestaApi } from "../../apis/apiVariables";
import apiObtenerListaRentasPorXbox from "../../apis/apiRentas";
import TablaRentas, { ColumnasRenta } from "../../components/Tablas/TablaRenta";
import ComponentError, {
  DataError,
} from "../../components/Global/ComponentError";
import FormularioXboxs from "./FormularioXboxs";
import IconoBootstrap from "../../components/Global/IconoBootstrap";

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
  cerrarModal: Dispatch<void>;
  estadoModal: boolean;
}

// Todo, Modal de xbox
const ModalXbox: React.FC<Props> = (props) => {
  // * Variables
  const [listaRentas, setListaRentas] = useState<Renta[]>([]);
  const [isEstadoModal, setEstadoModal] = useState<boolean>(false);
  const [isError, setError] = useState<DataError>({
    estado: false,
  });

  // * Acciones modal
  const cerrarModal = () => setEstadoModal(false);
  const abrirModal = () => setEstadoModal(true);

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
    <>
      {/* CUERPO */}
      <Offcanvas show={props.estadoModal} onHide={props.cerrarModal}>
        {/* ENCABEZADO */}
        <Offcanvas.Header
          className="modal-izquierdo"
          closeButton
          closeVariant="white"
        >
          {/* Pila */}
          <Stack direction="horizontal" gap={2}>
            {/* Editar */}
            <div className="p-2">
              <IconoBootstrap
                onClick={abrirModal}
                nombre="PencilFill"
                color="white"
                size={20}
              />
            </div>
            {/* Titulo */}
            <div className="p-2">
              <Offcanvas.Title>{props.xbox.nombre}</Offcanvas.Title>
            </div>
          </Stack>
        </Offcanvas.Header>
        {/* CUERPO */}
        <Offcanvas.Body className="modal-izquierdo">
          {/* ERROR */}
          {isError.estado ? (
            <ComponentError
              titulo={isError.titulo}
              detalles={isError.detalles}
            />
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

      {/* MODAL */}
      <FormularioXboxs
        xbox={props.xbox}
        estadoModal={isEstadoModal}
        cerrarModal={cerrarModal}
      />
    </>
  );
};

export default ModalXbox;

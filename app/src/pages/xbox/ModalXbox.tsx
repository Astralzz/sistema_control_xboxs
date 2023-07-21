import React, { Dispatch, useCallback, useEffect, useState } from "react";
import { Offcanvas, Placeholder, Stack } from "react-bootstrap";
import Xbox from "../../models/Xbox";
import Renta from "../../models/Renta";
import { RespuestaApi } from "../../apis/apiVariables";
import { apiObtenerListaRentasPorXbox } from "../../apis/apiRentas";
import TablaRentas, { ColumnasRenta } from "../../components/tablas/TablaRenta";
import ComponentError, {
  DataError,
} from "../../components/global/ComponentError";
import FormularioXboxs from "./FormularioXboxs";
import IconoBootstrap from "../../components/global/IconoBootstrap";
import { apiEliminarXbox } from "../../apis/apiXboxs";
import ComponenteCargando from "../../components/global/ComponenteCargando";
import {
  alertaSwal,
  confirmacionSwal,
} from "../../functions/funcionesGlobales";

// * Arreglo números
const ArregloCargando: number[] = Array.from(
  { length: 20 },
  (_, index) => index + 1
);

// * Columnas
const columnas: ColumnasRenta = {
  fecha: true,
  inicio: true,
  duracion: true,
  total: true,
  masInf: true,
};

// * Props
interface Props {
  xbox: Xbox;
  cerrarModal: Dispatch<void>;
  estadoModal: boolean;
  eliminarXbox: (id: number) => void;
  actualizarXbox: (id: number, xboxActualizado: Xbox) => void;
}

// Todo, Modal de xbox
const ModalXbox: React.FC<Props> = (props) => {
  // * Variables
  const [listaRentas, setListaRentas] = useState<Renta[]>([]);
  const [isEstadoModal, setEstadoModal] = useState<boolean>(false);
  const [isCargando, setCargando] = useState<boolean>(false);
  const [isCargandoTabla, setCargandoTabla] = useState<boolean>(false);
  const [isError, setError] = useState<DataError>({
    estado: false,
  });

  // * Acciones modal
  const cerrarModal = () => setEstadoModal(false);
  const abrirModal = () => setEstadoModal(true);

  // * Obtener xbox
  const obtenerUltimasVentas = useCallback(async () => {
    try {
      setCargandoTabla(true);

      // * Buscamos
      const res: RespuestaApi = await apiObtenerListaRentasPorXbox(
        props.xbox.id
      );

      // ? salio mal
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
    } catch (error) {
      console.error(String(error));
    } finally {
      setCargandoTabla(false);
    }
  }, [props.xbox.id]);

  //* Eliminar xbox
  const eliminarXbox = async (): Promise<void> => {
    try {
      setCargando(true);

      // Obtenemos id
      const idXbox: number = props.xbox.id;

      // Enviamos
      const res: RespuestaApi = await apiEliminarXbox(idXbox);

      // ? salio mal
      if (!res.estado) {
        throw new Error(
          res.detalles_error
            ? String(res.detalles_error)
            : "Ocurrió un error al eliminar el xbox, intenta mas tarde"
        );
      }

      // Cerramos
      alCerrar();

      // * Terminamos
      props.eliminarXbox(props.xbox.id);

      alertaSwal(
        "Éxito!",
        res.mensaje ?? "Xbox eliminado correctamente",
        "success"
      );

      // ! Error
    } catch (error: unknown) {
      alertaSwal("Error!", String(error), "error");
    } finally {
      setCargando(false);
    }
  };

  //* Pre eliminar xbox
  const preEliminarXbox = async (): Promise<void> => {
    // Confirmacion
    const res = await confirmacionSwal(
      "Estas seguro?",
      "Si eliminas este xbox ya no podrás restaurar sus datos!",
      "Si, eliminar xbox"
    );

    // ? Si
    if (res) {
      eliminarXbox();
    }
  };

  // * Al cerrar
  const alCerrar = (): void => {
    setCargando(false);
    props.cerrarModal();
  };

  // * Buscamos
  useEffect(() => {
    // ? true
    if (props.estadoModal) {
      obtenerUltimasVentas();
    }
  }, [obtenerUltimasVentas, props.estadoModal]);

  return (
    <>
      {/* CUERPO */}
      <Offcanvas show={props.estadoModal} onHide={alCerrar}>
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
            {/* Eliminar */}
            <div className="p-2">
              <IconoBootstrap
                onClick={preEliminarXbox}
                nombre="Trash2Fill"
                color="white"
                size={20}
              />
            </div>
            {/* Titulo */}
            <div className="p-2 ms-auto">
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
              accionVoid={() => obtenerUltimasVentas()}
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

              {/* Esta cargando*/}
              {isCargandoTabla ? (
                // Cargando
                ArregloCargando.map((n) => {
                  // n de 10 a 12
                  const nr: number = Math.floor(Math.random() * 3) + 10;

                  return (
                    <Placeholder key={n} animation="glow">
                      <Placeholder xs={nr} />
                    </Placeholder>
                  );
                })
              ) : // ? Lista vacía
              Array.isArray(listaRentas) && listaRentas.length > 0 ? (
                <TablaRentas lista={listaRentas} columnas={columnas} />
              ) : (
                <h6>La lista esta vacía</h6>
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
        actualizarXbox={props.actualizarXbox}
      />

      {/* MODAL CARGANDO */}
      <ComponenteCargando tipo={"spin"} estadoModal={isCargando} />
    </>
  );
};

export default ModalXbox;

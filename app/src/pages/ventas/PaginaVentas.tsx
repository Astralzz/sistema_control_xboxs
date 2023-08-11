import React, { useCallback, useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Venta from "../../models/Venta";
import TablaVentas from "../ventas/TablaVentas";
import ComponentError, {
  DataError,
} from "../../components/oters/ComponentError";
import ReactLoading from "react-loading";
import { RespuestaApi } from "../../apis/apiVariables";
import { apiObtenerListaVentas } from "../../apis/apiVentas";
// import TarjetaVenta from "../ventas/TarjetaVenta";
import ComponenteCargando from "../../components/oters/ComponenteCargando";
// import ModalVenta from "../ventas/ModalVenta";
import { ColumnasVentas } from "../../components/tablas/ComponenteTablaVentasPorProducto";

// * Columnas de tabla
const columnas: ColumnasVentas = {
  no: true,
  fecha: true,
  hora: true,
  noProductos: true,
  total: true,
  comentario: true,
  masInf: true,
};

// * Accion venta
export interface OpcionesModalVenta {
  titulo: string;
  opcion: "CREAR" | "EDITAR" | "VENTAS" | undefined;
  venta?: Venta;
}

// TODO, Pagina de los ventas
const PaginaVentas: React.FC = () => {
  // * Variables
  const [opcionesModalVenta, setOpcionesModalVenta] =
    useState<OpcionesModalVenta>({
      titulo: "???",
      opcion: undefined,
    });
  const [isEstadoModal, setEstadoModal] = useState<boolean>(false);
  const [isCargandoTabla, setCargandoTabla] = useState<boolean>(false);
  const [isCargandoPagina, setCargandoPagina] = useState<boolean>(false);
  const [isCargandoAccion, setCargandoAccion] = useState<boolean>(false);
  const [ventaSeleccionado, setVentaSeleccionado] = useState<Venta | null>(
    null
  );
  const [noTotalVentas, setNoTotalVentas] = useState<number>(0);
  const [isErrorTabla, setErrorTabla] = useState<DataError>({
    estado: true,
  });

  // * Listas
  const [listaVentas, setListaVentas] = useState<Venta[]>([]);

  // * Acciones modal
  const cerrarModal = () => setEstadoModal(false);

  // * Accion Modal
  const accionModal = (opcionesModalVenta: OpcionesModalVenta) => {
    setEstadoModal(true);
    setOpcionesModalVenta(opcionesModalVenta);
  };

  // * Obtener ventas
  const obtenerVentas = useCallback(
    async (
      desde: number = 0,
      asta: number = 10,
      nombre?: string,
      stock?: number
    ) => {
      try {
        setCargandoTabla(true);

        // Respuesta
        let res: RespuestaApi;

        // ? Llego nombre
        // if (typeof nombre !== "undefined" && nombre !== null) {
        //   res = await apiObtenerListaVentasPorNombre(nombre, desde, asta);
        //   // ? Llego stock
        // } else if (typeof stock !== "undefined" && stock !== null) {
        //   res = await apiObtenerListaVentasPorStock(stock, desde, asta);
        //   // ? Ninguno
        // } else {
        res = await apiObtenerListaVentas(desde, asta);
        // }

        // ? salio mal
        if (!res.estado) {
          setErrorTabla({
            estado: true,
            titulo: res.noEstado ? String(res.noEstado) : undefined,
            detalles: res.detalles_error
              ? String(res.detalles_error)
              : undefined,
          });
          setListaVentas([]);
          return;
        }

        //  Sin errores
        setErrorTabla({ estado: false });

        // Ponemos lista
        setListaVentas(res.listaVentas ?? []);

        // Limitamos a los últimos 150 datos
        const t = res.totalDatos
          ? res.totalDatos < 150
            ? res.totalDatos
            : 150
          : 0;

        //  Ponemos el total
        setNoTotalVentas(t ?? 0);
      } catch (error) {
        console.error(String(error));
      } finally {
        setCargandoPagina(false);
        setCargandoTabla(false);
      }
    },
    []
  );

  // * Al iniciar
  useEffect(() => {
    setCargandoPagina(true);
    obtenerVentas();
  }, [obtenerVentas]);

  // Todo, componente principal
  return (
    <>
      {/* PAGINA */}
      <Container className="contenedor-completo">
        <br className="mb-2" />
        <Row>
          {/* Tarjeta */}
          <Col sm={4}></Col>
          {/* Tabla */}
          <Col sm={8}>
            <Container>
              {/* Si esta cargando y esta vacía */}
              {isCargandoPagina ? (
                <div className="contenedor-centrado">
                  <ReactLoading type={"bubbles"} color="#FFF" />
                </div>
              ) : // ! Error
              isErrorTabla.estado ? (
                <ComponentError
                  titulo={isErrorTabla.titulo ?? "Error 404"}
                  accionVoid={() => obtenerVentas()}
                  detalles={
                    isErrorTabla.detalles ?? "No se pudieron cargar loas ventas"
                  }
                />
              ) : (
                // * Tabla de ventas
                <TablaVentas
                  lista={listaVentas}
                  totalVentas={noTotalVentas}
                  columnas={columnas}
                  setCargandoTabla={setCargandoTabla}
                  setVentaSeleccionada={setVentaSeleccionado}
                  ventaSeleccionada={ventaSeleccionado}
                  obtenerMasDatos={(
                    desde: number,
                    asta: number,
                    nombre?: string,
                    stock?: number
                  ) => obtenerVentas(desde, asta, nombre, stock)}
                  isCargandoTabla={isCargandoTabla}
                />
              )}
            </Container>
          </Col>
        </Row>
      </Container>

      {/* MODAL */}
      {/* <ModalVenta
        estadoModal={isEstadoModal}
        cerrarModal={cerrarModal}
        opcionesModalVenta={opcionesModalVenta}
        setCargando={setCargandoAccion}
        setVentaSeleccionado={setVentaSeleccionado}
        recargarVentas={obtenerVentas}
      /> */}

      {/* CARGANDO */}
      <ComponenteCargando tipo={"spin"} estadoModal={isCargandoAccion} />
    </>
  );
};

export default PaginaVentas;

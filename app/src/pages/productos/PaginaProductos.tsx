import React, { useCallback, useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Producto from "../../models/Producto";
import TablaProductos, { ColumnasProducto } from "./TablaProductos";
import ComponentError, {
  DataError,
} from "../../components/global/ComponentError";
import ReactLoading from "react-loading";
import { RespuestaApi } from "../../apis/apiVariables";
import {
  apiObtenerListaProductos,
  apiObtenerListaProductosPorNombre,
  apiObtenerListaProductosPorStock,
} from "../../apis/apiProductos";
import TarjetaProducto from "./TarjetaProducto";
import ComponenteCargando from "../../components/global/ComponenteCargando";
import ModalProducto from "./ModalProducto";

// * Columnas de tabla
const columnas: ColumnasProducto = {
  no: true,
  nombre: true,
  precio: true,
  stock: true,
  descripcion: true,
  masInf: true,
};

// * Accion producto
export interface OpcionesModalProducto {
  titulo: string;
  opcion: "CREAR" | "EDITAR" | "VENTAS" | undefined;
  producto?: Producto;
}

// TODO, Pagina de los productos
const PaginaProductos: React.FC = () => {
  // * Variables
  const [opcionesModalProducto, setOpcionesModalProducto] =
    useState<OpcionesModalProducto>({
      titulo: "???",
      opcion: undefined,
    });
  const [isEstadoModal, setEstadoModal] = useState<boolean>(false);
  const [isCargandoTabla, setCargandoTabla] = useState<boolean>(false);
  const [isCargandoPagina, setCargandoPagina] = useState<boolean>(false);
  const [isCargandoAccion, setCargandoAccion] = useState<boolean>(false);
  const [productoSeleccionado, setProductoSeleccionado] =
    useState<Producto | null>(null);
  const [noTotalProductos, setNoTotalProductos] = useState<number>(0);
  const [isErrorTabla, setErrorTabla] = useState<DataError>({
    estado: true,
  });

  // * Listas
  const [listaProductos, setListaProductos] = useState<Producto[]>([]);

  // * Acciones modal
  const cerrarModal = () => setEstadoModal(false);

  // * Accion Modal
  const accionModal = (opcionesModalProducto: OpcionesModalProducto) => {
    setEstadoModal(true);
    setOpcionesModalProducto(opcionesModalProducto);
  };

  // * Obtener productos
  const obtenerProductos = useCallback(
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
        if (typeof nombre !== "undefined" && nombre !== null) {
          res = await apiObtenerListaProductosPorNombre(nombre, desde, asta);
          // ? Llego stock
        } else if (typeof stock !== "undefined" && stock !== null) {
          res = await apiObtenerListaProductosPorStock(stock, desde, asta);
          // ? Ninguno
        } else {
          res = await apiObtenerListaProductos(desde, asta);
        }

        // ? salio mal
        if (!res.estado) {
          setErrorTabla({
            estado: true,
            titulo: res.noEstado ? String(res.noEstado) : undefined,
            detalles: res.detalles_error
              ? String(res.detalles_error)
              : undefined,
          });
          setListaProductos([]);
          return;
        }

        //  Sin errores
        setErrorTabla({ estado: false });

        // Ponemos lista
        setListaProductos(res.listaProductos ?? []);

        //  Ponemos el total
        setNoTotalProductos(res.totalDatos ?? 0);
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
    obtenerProductos();
  }, [obtenerProductos]);

  // Todo, componente principal
  return (
    <>
      {/* PAGINA */}
      <Container className="contenedor-completo">
        <br className="mb-2" />
        <Row>
          {/* Tarjeta */}
          <Col sm={4}>
            <TarjetaProducto
              producto={productoSeleccionado}
              setCargandoAccion={setCargandoAccion}
              setProductoSeleccionado={setProductoSeleccionado}
              accionModal={accionModal}
              recargarTabla={obtenerProductos}
            />
          </Col>
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
                  accionVoid={() => obtenerProductos()}
                  detalles={
                    isErrorTabla.detalles ??
                    "No se pudieron cargar los productos"
                  }
                />
              ) : (
                // * Tabla de productos
                <TablaProductos
                  lista={listaProductos}
                  totalProductos={noTotalProductos}
                  columnas={columnas}
                  setCargandoTabla={setCargandoTabla}
                  setProductoSeleccionado={setProductoSeleccionado}
                  productoSeleccionado={productoSeleccionado}
                  obtenerMasDatos={(
                    desde: number,
                    asta: number,
                    nombre?: string,
                    stock?: number
                  ) => obtenerProductos(desde, asta, nombre, stock)}
                  isCargandoTabla={isCargandoTabla}
                />
              )}
            </Container>
          </Col>
        </Row>
      </Container>

      {/* MODAL */}
      <ModalProducto
        estadoModal={isEstadoModal}
        cerrarModal={cerrarModal}
        opcionesModalProducto={opcionesModalProducto}
        setCargando={setCargandoAccion}
        setProductoSeleccionado={setProductoSeleccionado}
      />

      {/* CARGANDO */}
      <ComponenteCargando tipo={"spin"} estadoModal={isCargandoAccion} />
    </>
  );
};

export default PaginaProductos;

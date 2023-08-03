import React, { useCallback, useEffect, useState } from "react";
import { Button, Col, Container, Pagination, Row } from "react-bootstrap";
import Producto from "../../models/Producto";
import TablaProductos, {
  ColumnasProducto,
} from "../../components/tablas/TablaProductos";
import ComponentError, {
  DataError,
} from "../../components/global/ComponentError";
import ReactLoading from "react-loading";
import { RespuestaApi } from "../../apis/apiVariables";
import {
  apiObtenerListaProductos,
  apiObtenerNoDeProductosTotales,
} from "../../apis/apiProductos";
import { alertaSwal } from "../../functions/funcionesGlobales";

// * Columnas de tabla
const columnas: ColumnasProducto = {
  no: true,
  nombre: true,
  precio: true,
  stock: true,
  descripcion: true,
  masInf: true,
};

// TODO, Pagina de los productos
const PaginaProductos: React.FC = () => {
  // * Variables
  const [isCargandoTabla, setCargandoTabla] = useState<boolean>(false);
  const [productoSeleccionado, setProductoSeleccionado] =
    useState<Producto | null>(null);
  const [noTotalProductos, setNoTotalProductos] = useState<number>(0);
  const [isErrorTabla, setErrorTabla] = useState<DataError>({
    estado: true,
  });

  // * Listas
  const [listaProductos, setListaProductos] = useState<Producto[]>([]);

  // * Obtener numero total de datos
  const obtenerNoTotalProductos = async (): Promise<void> => {
    // * Buscamos
    const res: RespuestaApi = await apiObtenerNoDeProductosTotales();

    // ? Salio bien y llego data
    if (res.estado && res.dato) {
      setNoTotalProductos(res.dato);
      return;
    }

    // ! Error
    alertaSwal(
      "Error",
      "No se pudo obtener el numero total de productos",
      "error"
    );
    setNoTotalProductos(0);
  };

  // * Obtener productos
  const obtenerProductos = useCallback(
    async (desde: number = 0, asta: number = 10) => {
      try {
        setCargandoTabla(true);

        // * Buscamos
        const res: RespuestaApi = await apiObtenerListaProductos(desde, asta);

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

        // * Sin errores
        setErrorTabla({ estado: false });

        // Ponemos lista
        setListaProductos(res.listaProductos ?? []);

        // * Obtenemos el total
        await obtenerNoTotalProductos();
      } catch (error) {
        console.error(String(error));
      } finally {
        setCargandoTabla(false);
      }
    },
    []
  );

  // * Al iniciar
  useEffect(() => {
    obtenerProductos();
  }, [obtenerProductos]);

  // Todo, componente principal
  return (
    <Container className="contenedor-completo">
      {/* <br className="mb-2" /> */}
      <Row>
        {/* Administrador */}
        <Col sm={4}>
          <Container>
            <h4>Administrador</h4>
          </Container>
        </Col>
        {/* Tabla */}
        <Col sm={8}>
          <Container>
            {/* Si esta cargando y esta vacía */}
            {isCargandoTabla && listaProductos.length < 1 ? (
              <div className="contenedor-centrado">
                <ReactLoading type={"bubbles"} color="#FFF" />
              </div>
            ) : // ! Error
            isErrorTabla.estado ? (
              <ComponentError
                titulo={isErrorTabla.titulo ?? "Error 404"}
                accionVoid={() => obtenerProductos()}
                detalles={
                  isErrorTabla.detalles ?? "No se pudieron cargar los productos"
                }
              />
            ) : // ? Tabla vacía
            listaProductos.length < 1 ? (
              <div className="contenedor-centrado">
                <h3>Tabla vacía</h3>
              </div>
            ) : (
              // * Tabla de productos
              <TablaProductos
                lista={listaProductos}
                totalProductos={noTotalProductos}
                columnas={columnas}
                setCargandoTabla={setCargandoTabla}
                setProductoSeleccionado={setProductoSeleccionado}
                obtenerMasDatos={(desde: number, asta: number) =>
                  obtenerProductos(desde, asta)
                }
                isCargandoTabla={isCargandoTabla}
              />
            )}
          </Container>
        </Col>
      </Row>
    </Container>
  );
};

export default PaginaProductos;

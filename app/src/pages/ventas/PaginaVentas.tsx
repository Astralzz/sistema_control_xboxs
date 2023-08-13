import React, { useCallback, useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import Venta from "../../models/Venta";
import TablaVentas from "../ventas/TablaVentas";
import ComponentError, {
  DataError,
} from "../../components/oters/ComponentError";
import ReactLoading from "react-loading";
import { RespuestaApi } from "../../apis/apiVariables";
import {
  apiObtenerListaVentas,
  apiObtenerListaVentasPorSemanas,
} from "../../apis/apiVentas";
// import TarjetaVenta from "../ventas/TarjetaVenta";
import ComponenteCargando from "../../components/oters/ComponenteCargando";
// import ModalVenta from "../ventas/ModalVenta";
import { ColumnasVentas } from "../../components/tablas/ComponenteTablaVentasPorProducto";
import GraficoDeLineas, {
  DatosGrafica,
} from "../../components/oters/GraficoDeLineas";
import {
  convertirDetalles,
  formatearFecha,
} from "../../functions/funcionesGlobales";
import { FiltroFechasGrafica } from "../../functions/variables";

// * Columnas de tabla
const columnas: ColumnasVentas = {
  no: true,
  fecha: true,
  hora: true,
  noProductos: true,
  total: true,
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
  const [noTotalVentas, setNoTotalVentas] = useState<number>(0);
  const [isErrorTabla, setErrorTabla] = useState<DataError>({
    estado: true,
  });
  const [isErrorGrafica, setErrorGrafica] = useState<DataError>({
    estado: true,
  });

  // * Cargando
  const [isCargandoTabla, setCargandoTabla] = useState<boolean>(false);
  const [isCargandoGrafica, setCargandoGrafica] = useState<boolean>(false);
  const [isCargandoPagina, setCargandoPagina] = useState<boolean>(false);
  const [isCargandoAccion, setCargandoAccion] = useState<boolean>(false);

  // * Listas
  const [listaVentas, setListaVentas] = useState<Venta[]>([]);
  const [listaVentasGrafica, setListaVentasGrafica] = useState<DatosGrafica[]>(
    []
  );

  // * Obtener ventas
  const obtenerVentas = useCallback(
    async (desde: number = 0, asta: number = 10) => {
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

        // ? Llego la lista
        if (!res.listaVentas) {
          setErrorTabla({
            estado: true,
            titulo: res.noEstado ? String(res.noEstado) : undefined,
            detalles: "La lista de ventas no llego correctamente",
          });
          setListaVentas([]);
          return;
        }

        //  Sin errores
        setErrorTabla({ estado: false });

        // Convertir los detalles de cada venta
        const ventasConvertidas: Venta[] =
          res.listaVentas.map(convertirDetalles);

        // Ponemos lista
        setListaVentas(ventasConvertidas ?? []);

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

  // * Obtener Grafica
  const obtenerVentasGrafica = useCallback(
    async (tipo: FiltroFechasGrafica, datos?: number) => {
      try {
        setCargandoGrafica(true);

        // Respuesta
        let res: RespuestaApi = await apiObtenerListaVentasPorSemanas(
          tipo,
          datos
        );

        // ? Error
        if (!res.estado) {
          setErrorGrafica({
            estado: true,
            titulo: res.noEstado ? String(res.noEstado) : undefined,
            detalles: res.detalles_error
              ? String(res.detalles_error)
              : undefined,
          });
          setListaVentasGrafica([]);
          return;
        }

        // ? No llego la lista
        if (!res.listaGrafica) {
          setErrorGrafica({
            estado: true,
            titulo: "Error 404",
            detalles: "La gráfica no se creo correctamente",
          });
          setListaVentasGrafica([]);
          return;
        }

        //  Recorremos
        const ventasGrafica: DatosGrafica[] = res.listaGrafica.map((venta) => ({
          fecha: formatearFecha(venta.fecha, tipo) ?? venta.fecha,
          total: venta.total,
        }));

        //  Sin errores
        setErrorGrafica({ estado: false });

        // Agregamos
        setListaVentasGrafica(ventasGrafica);
      } catch (error) {
        console.error(String(error));
      } finally {
        setCargandoGrafica(false);
      }
    },
    []
  );

  // * Al iniciar
  useEffect(() => {
    obtenerVentas();
  }, [obtenerVentas]);
  useEffect(() => {
    obtenerVentasGrafica("periodica");
  }, [obtenerVentasGrafica]);
  useEffect(() => {
    setCargandoPagina(true);
  }, []);

  // Todo, componente principal
  return (
    <>
      {/* PAGINA */}
      <Container className="contenedor-completo">
        <br className="mb-2" />
        {/* Si esta cargando y esta vacía */}
        {isCargandoPagina ? (
          <div className="contenedor-centrado">
            <ReactLoading type={"spin"} color="#FFF" />
          </div>
        ) : (
          <>
            {/* // * Grafica ------------------- */}
            {isCargandoGrafica ? (
              // ? Cargando
              <div
                className="contenedor-centrado-grafica"
                style={{ minHeight: 300 }}
              >
                <ReactLoading type={"cubes"} color="#FFF" />
              </div>
            ) : isErrorGrafica.estado ? (
              // ! Error
              <ComponentError
                titulo={isErrorGrafica.titulo ?? "Error 404"}
                accionVoid={() => obtenerVentasGrafica("periodica")}
                detalles={
                  isErrorGrafica.detalles ?? "No se pudo crear la tabla"
                }
              />
            ) : listaVentasGrafica.length < 1 ? (
              // ? Lista vacía
              <div className="contenedor-centrado">
                <h5>Aun no existen datos para crear la grafica</h5>
              </div>
            ) : (
              // Grafica
              <GraficoDeLineas datos={listaVentasGrafica} />
            )}

            {/* // * Tabla ------------------- */}
            {isErrorTabla.estado ? (
              // ! Error
              <ComponentError
                titulo={isErrorTabla.titulo ?? "Error 404"}
                accionVoid={() => obtenerVentas()}
                detalles={
                  isErrorTabla.detalles ?? "No se pudieron cargar loas ventas"
                }
              />
            ) : (
              // Tabla
              <TablaVentas
                lista={listaVentas}
                totalVentas={noTotalVentas}
                columnas={columnas}
                setCargandoTabla={setCargandoTabla}
                obtenerMasDatos={(desde: number, asta: number) =>
                  obtenerVentas(desde, asta)
                }
                actualizarGrafica={(tipo, noDatos) =>
                  obtenerVentasGrafica(tipo, noDatos)
                }
                isCargandoTabla={isCargandoTabla}
                setCargandoAccion={setCargandoAccion}
              />
            )}
          </>
        )}
      </Container>

      {/* CARGANDO */}
      <ComponenteCargando tipo={"spin"} estadoModal={isCargandoAccion} />
    </>
  );
};

export default PaginaVentas;

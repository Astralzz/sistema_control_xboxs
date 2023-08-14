import React, { useCallback, useEffect, useState } from "react";
import { Button, Container, Form, InputGroup, Navbar } from "react-bootstrap";
import Venta from "../../models/Venta";
import TablaVentas from "../ventas/TablaVentas";
import ComponentError, {
  DataError,
} from "../../components/oters/ComponentError";
import ReactLoading from "react-loading";
import { RespuestaApi } from "../../apis/apiVariables";
import {
  apiObtenerListaVentas,
  apiObtenerListaVentasPorDia,
  apiObtenerListaVentasPorGrafica,
  apiObtenerListaVentasPorMes,
} from "../../apis/apiVentas";
import ComponenteCargando from "../../components/oters/ComponenteCargando";
import { ColumnasVentas } from "../../components/tablas/ComponenteTablaVentasPorProducto";
import GraficoDeLineas, {
  DatosGrafica,
} from "../../components/oters/GraficoDeLineas";
import {
  alertaSwal,
  convertirDetalles,
  formatearFecha,
  obtenerDescripcionGrafica,
} from "../../functions/funcionesGlobales";
import {
  FiltroFechasGrafica,
  regexNumerosEnteros,
} from "../../functions/variables";

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

// * Estilos
const styles: React.CSSProperties[] = [
  {
    backgroundColor: "var(--color-fondo)",
    color: "var(--color-letra)",
    border: "none",
    borderBottom: "1px solid white",
  },
  {
    backgroundColor: "var(--color-fondo-opaco)",
    color: "var(--color-letra)",
    border: "none",
  },
];

// TODO, Pagina de los ventas
const PaginaVentas: React.FC = () => {
  // * Variables
  const [tipoDeGrafica, setTipoDeGrafica] =
    useState<FiltroFechasGrafica>("periodica");
  const [noDatosGrafica, setNoDatosGrafica] = useState<string>("7");
  const [noTotalVentas, setNoTotalVentas] = useState<number>(0);
  const [isErrorTabla, setErrorTabla] = useState<DataError>({
    estado: true,
  });
  const [isErrorGrafica, setErrorGrafica] = useState<DataError>({
    estado: true,
  });
  const [descripcionGrafica, setDescripcionGrafica] = useState<string>(
    `Grafica de los últimos ${noDatosGrafica} dias`
  );

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
    async (desde: number = 0, asta: number = 10, dia?: Date, mes?: Date) => {
      try {
        setCargandoTabla(true);

        // Respuesta
        let res: RespuestaApi;

        // ? Llego dia
        if (typeof dia !== "undefined" && dia !== null) {
          res = await apiObtenerListaVentasPorDia(dia, desde, asta);
          // ? Llego mes
        } else if (typeof mes !== "undefined" && mes !== null) {
          res = await apiObtenerListaVentasPorMes(mes, desde, asta);
          // ? Ninguno
        } else {
          res = await apiObtenerListaVentas(desde, asta);
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
        let res: RespuestaApi = await apiObtenerListaVentasPorGrafica(
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

        // Actualizamos descripcion
        setDescripcionGrafica(obtenerDescripcionGrafica(tipo, ventasGrafica));

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

  // * Actualizar grafica
  const actualizarGrafica = (): void => {
    if (
      // ? Es valido
      ["periodica", "semanal", "mensual", "anual"].includes(tipoDeGrafica)
    ) {
      // ? Numero valido
      if (
        regexNumerosEnteros.test(noDatosGrafica) &&
        !isNaN(Number(noDatosGrafica)) &&
        Number(noDatosGrafica) > 1 &&
        Number(noDatosGrafica) < 101
      ) {
        // Actualizamos
        obtenerVentasGrafica(tipoDeGrafica, Number(noDatosGrafica));
        return;
      }

      // ! Error
      alertaSwal(
        "Error",
        "El numero de datos proporcionados no es valido",
        "error"
      );
      return;
    }
    // ! Error
    alertaSwal(
      "Error",
      "El tipo de grafica proporcionado no es valido",
      "error"
    );
  };

  // * Bloquear boton grafica
  const isBloquearBotonGrafica = (): boolean =>
    !regexNumerosEnteros.test(noDatosGrafica) ||
    isNaN(Number(noDatosGrafica)) ||
    Number(noDatosGrafica) < 2 ||
    Number(noDatosGrafica) > 100 ||
    !["periodica", "semanal", "mensual", "anual"].includes(tipoDeGrafica);

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
            {/* // * Barra de la grafica */}
            <Navbar className="bg-body-transparent justify-content-end">
              {/* Parte de la grafica */}
              <InputGroup>
                {/* Tipo de grafica */}
                <InputGroup.Text style={styles[1]}>
                  Tipo de grafica
                </InputGroup.Text>
                <Form.Select
                  aria-label="Tipo de grafica"
                  value={tipoDeGrafica}
                  onChange={(n) => {
                    // Valor
                    const valor: FiltroFechasGrafica = n.target
                      .value as FiltroFechasGrafica;
                    if (
                      // ? Es valido
                      ["periodica", "semanal", "mensual", "anual"].includes(
                        valor
                      )
                    ) {
                      setTipoDeGrafica(valor);
                      return;
                    }

                    alertaSwal("Error", "La opcion no es valida", "error");
                  }}
                  className={"is-valid"}
                  style={styles[0]}
                >
                  <option value="periodica">Periodica</option>
                  <option value="semanal">Semanal</option>
                  <option value="mensual">Mensual</option>
                  <option value="anual">Anual</option>
                </Form.Select>
              </InputGroup>

              {/* Numero de datos */}
              <InputGroup>
                <InputGroup.Text style={styles[1]}>
                  Numero de datos
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  style={styles[0]}
                  min={2}
                  max={50}
                  className={
                    String(noDatosGrafica) === ""
                      ? ""
                      : regexNumerosEnteros.test(noDatosGrafica) &&
                        Number(noDatosGrafica) > 1 &&
                        Number(noDatosGrafica) < 101
                      ? "is-valid"
                      : "is-invalid"
                  }
                  value={noDatosGrafica}
                  onChange={(t) => setNoDatosGrafica(t.target.value)}
                />
              </InputGroup>

              {/* Boton de actualizar */}
              <Container>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                  {/* Boton */}
                  <div className="boton-buscar">
                    {/* Buscar */}
                    <Button
                      disabled={isBloquearBotonGrafica()}
                      onClick={() => actualizarGrafica()}
                      className="bt-b"
                      type="submit"
                    >
                      Actualizar grafica
                    </Button>
                  </div>
                </Navbar.Collapse>
              </Container>
            </Navbar>

            <br className="mb-2" />

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
                nombreClase="contenedor-centrado-grafica"
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
              <GraficoDeLineas
                datos={listaVentasGrafica}
                descripcion={descripcionGrafica}
              />
            )}

            {/* // * Tabla ------------------- */}
            {isErrorTabla.estado ? (
              // ! Error
              <ComponentError
                titulo={isErrorTabla.titulo ?? "Error 404"}
                accionVoid={() => obtenerVentas()}
                nombreClase="contenedor-centrado-grafica"
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
                obtenerMasDatos={(
                  desde: number,
                  asta: number,
                  dia?: Date,
                  mes?: Date
                ) => obtenerVentas(desde, asta, dia, mes)}
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

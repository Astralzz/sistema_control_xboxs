import React, { useCallback, useEffect, useState } from "react";
import { Button, Container, Form, InputGroup, Navbar } from "react-bootstrap";
import Renta from "../../models/Renta";
import TablaRentas from "../rentas/TablaRentas";
import ComponentError, {
  DataError,
} from "../../components/oters/ComponentError";
import ReactLoading from "react-loading";
import { RespuestaApi } from "../../apis/apiVariables";
import {
  apiObtenerListaRentas,
  apiObtenerListaRentasPorDia,
  apiObtenerListaRentasPorGrafica,
  apiObtenerListaRentasPorMes,
} from "../../apis/apiRentas";
import ComponenteCargando from "../../components/oters/ComponenteCargando";
import { ColumnasRenta } from "../../components/tablas/ComponenteTablaRenta";
import GraficoDeLineas, {
  DatosGrafica,
} from "../../components/oters/GraficoDeLineas";
import {
  alertaSwal,
  formatearFecha,
  obtenerDescripcionGrafica,
} from "../../functions/funcionesGlobales";
import {
  FiltroFechasGrafica,
  regexNumerosEnteros,
} from "../../functions/variables";

// * Columnas de tabla
const columnas: ColumnasRenta = {
  no: true,
  fecha: true,
  cliente: true,
  duracion: true,
  total: true,
  masInf: true,
};

// * Accion renta
export interface OpcionesModalRenta {
  titulo: string;
  opcion: "CREAR" | "EDITAR" | "Rentas" | undefined;
  renta?: Renta;
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

// TODO, Pagina de los rentas
const PaginaRentas: React.FC = () => {
  // * Variables
  const [tipoDeGrafica, setTipoDeGrafica] =
    useState<FiltroFechasGrafica>("periodica");
  const [noDatosGrafica, setNoDatosGrafica] = useState<string>("7");
  const [noTotalRentas, setNoTotalRentas] = useState<number>(0);
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
  const [listaRentas, setListaRentas] = useState<Renta[]>([]);
  const [listaRentasGrafica, setListaRentasGrafica] = useState<DatosGrafica[]>(
    []
  );

  // * Obtener rentas
  const obtenerRentas = useCallback(
    async (desde: number = 0, asta: number = 10, dia?: Date, mes?: Date) => {
      try {
        setCargandoTabla(true);

        // Respuesta
        let res: RespuestaApi;

        // ? Llego dia
        if (typeof dia !== "undefined" && dia !== null) {
          res = await apiObtenerListaRentasPorDia(dia, desde, asta);
          // ? Llego mes
        } else if (typeof mes !== "undefined" && mes !== null) {
          res = await apiObtenerListaRentasPorMes(mes, desde, asta);
          // ? Ninguno
        } else {
          res = await apiObtenerListaRentas(desde, asta);
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
          setListaRentas([]);
          return;
        }

        // ? Llego la lista
        if (!res.listaRentas) {
          setErrorTabla({
            estado: true,
            titulo: res.noEstado ? String(res.noEstado) : undefined,
            detalles: "La lista de rentas no llego correctamente",
          });
          setListaRentas([]);
          return;
        }

        //  Sin errores
        setErrorTabla({ estado: false });

        // Ponemos lista
        setListaRentas(res.listaRentas ?? []);

        // Limitamos a los últimos 150 datos
        const t = res.totalDatos
          ? res.totalDatos < 150
            ? res.totalDatos
            : 150
          : 0;

        //  Ponemos el total
        setNoTotalRentas(t ?? 0);
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
  const obtenerRentasGrafica = useCallback(
    async (tipo: FiltroFechasGrafica, datos?: number) => {
      try {
        setCargandoGrafica(true);

        // Respuesta
        let res: RespuestaApi = await apiObtenerListaRentasPorGrafica(
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
          setListaRentasGrafica([]);
          return;
        }

        // ? No llego la lista
        if (!res.listaGrafica) {
          setErrorGrafica({
            estado: true,
            titulo: "Error 404",
            detalles: "La gráfica no se creo correctamente",
          });
          setListaRentasGrafica([]);
          return;
        }

        //  Recorremos
        const rentasGrafica: DatosGrafica[] = res.listaGrafica.map((renta) => ({
          fecha: formatearFecha(renta.fecha, tipo) ?? renta.fecha,
          total: !isNaN(Number(renta.total)) ? Number(renta.total) : 0,
        }));

        // Actualizamos descripcion
        setDescripcionGrafica(obtenerDescripcionGrafica(tipo, rentasGrafica));

        //  Sin errores
        setErrorGrafica({ estado: false });

        // Agregamos
        setListaRentasGrafica(rentasGrafica);
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
        obtenerRentasGrafica(tipoDeGrafica, Number(noDatosGrafica));
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
    obtenerRentas();
  }, [obtenerRentas]);
  useEffect(() => {
    obtenerRentasGrafica("periodica");
  }, [obtenerRentasGrafica]);
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
                accionVoid={() => obtenerRentasGrafica("periodica")}
                nombreClase="contenedor-centrado-grafica"
                detalles={
                  isErrorGrafica.detalles ?? "No se pudo crear la tabla"
                }
              />
            ) : listaRentasGrafica.length < 1 ? (
              // ? Lista vacía
              <div className="contenedor-centrado">
                <h5>Aun no existen datos para crear la grafica</h5>
              </div>
            ) : (
              // Grafica
              <GraficoDeLineas
                datos={listaRentasGrafica}
                descripcion={descripcionGrafica}
              />
            )}

            {/* // * Tabla ------------------- */}
            {isErrorTabla.estado ? (
              // ! Error
              <ComponentError
                titulo={isErrorTabla.titulo ?? "Error 404"}
                accionVoid={() => obtenerRentas()}
                nombreClase="contenedor-centrado-grafica"
                detalles={
                  isErrorTabla.detalles ?? "No se pudieron cargar loas rentas"
                }
              />
            ) : (
              // Tabla
              <TablaRentas
                lista={listaRentas}
                totalRentas={noTotalRentas}
                columnas={columnas}
                setCargandoTabla={setCargandoTabla}
                obtenerMasDatos={(
                  desde: number,
                  asta: number,
                  dia?: Date,
                  mes?: Date
                ) => obtenerRentas(desde, asta, dia, mes)}
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

export default PaginaRentas;

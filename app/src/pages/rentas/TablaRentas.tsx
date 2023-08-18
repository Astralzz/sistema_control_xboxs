import React, { Dispatch, useEffect, useState } from "react";
import {
  Button,
  Col,
  Container,
  InputGroup,
  Navbar,
  Pagination,
  Row,
  Table,
} from "react-bootstrap";
import IconoBootstrap from "../../components/oters/IconoBootstrap";
import Renta from "../../models/Renta";
import {
  Paginacion,
  calcularPaginaciones,
  formatearFecha,
  formatearHoraSinSegundos,
} from "../../functions/funcionesGlobales";
import {
  ComponenteCargandoTabla,
  TextoLargoTablaElement,
} from "../../components/oters/Otros";
import { ColumnasRenta } from "../../components/tablas/ComponenteTablaRenta";
import TarjetaRenta from "./TarjetaRenta";
import ComponenteSelectFecha from "../../components/oters/ComponenteSelectFecha";

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

// * Props
interface Props {
  lista: Renta[];
  totalRentas: number;
  columnas: ColumnasRenta;
  setCargandoTabla: Dispatch<boolean>;
  obtenerMasDatos: (
    desde: number,
    asta: number,
    dia?: Date,
    mes?: Date
  ) => void;
  setCargandoAccion: Dispatch<boolean>;
  isCargandoTabla: boolean;
}

// Todo, Tabla Rentas
const TablaRentas: React.FC<Props> = (props) => {
  // * Variables
  const [rentaSeleccionada, setRentaSeleccionada] = useState<Renta | null>(
    null
  );
  const [listaPaginaciones, setListaPaginaciones] = useState<Paginacion[]>([]);
  const [pagSeleccionada, setPaginaSeleccionada] = useState<number>(0);
  const [diaSeleccionado, setDiaSeleccionado] = useState<Date>(new Date());
  const [isDiaSeleccionado, setIsDiaSeleccionado] = useState<boolean>(false);
  const [mesSeleccionado, setMesSeleccionado] = useState<Date>(new Date());
  const [isMesSeleccionado, setIsMesSeleccionado] = useState<boolean>(false);

  // * Limpiar filtros
  const LimpiarFiltros = (): void => {
    setIsMesSeleccionado(false);
    setIsDiaSeleccionado(false);
  };

  // * Pre obtener rentas
  const preObtenerRentas = (
    desde: number,
    asta: number,
    dia?: Date,
    mes?: Date
  ): void => props.obtenerMasDatos(desde, asta, dia, mes);

  // * Al cambiar
  useEffect(() => {
    // Total
    const pag: Paginacion[] = calcularPaginaciones(props.totalRentas);
    setListaPaginaciones(pag);
  }, [props.totalRentas]);

  return (
    <Row>
      {/* // * BARRA SUPERIOR ------------------ */}
      <Navbar className="bg-body-transparent justify-content">
        <Container>
          <Row>
            {/* Seleccionar dia */}
            <Col>
              <InputGroup>
                <InputGroup.Text style={styles[1]}>Dia</InputGroup.Text>
                <ComponenteSelectFecha
                  fechaSeleccionada={diaSeleccionado}
                  setFechaSeleccionada={setDiaSeleccionado}
                  opcion="PERIODICA"
                />
                <div className="boton-buscar">
                  <Button
                    className="bt-b"
                    onClick={() => {
                      setIsMesSeleccionado(false);
                      setIsDiaSeleccionado(true);
                      setPaginaSeleccionada(0);
                      preObtenerRentas(0, 10, diaSeleccionado);
                    }}
                  >
                    <IconoBootstrap nombre="Search" />
                  </Button>
                </div>

                <div className="separador-vertical"></div>

                {/* Seleccionar mes */}
                <InputGroup.Text style={styles[1]}>Mes</InputGroup.Text>
                <ComponenteSelectFecha
                  fechaSeleccionada={mesSeleccionado}
                  setFechaSeleccionada={setMesSeleccionado}
                  opcion="MENSUAL"
                />
                <div className="boton-buscar">
                  <Button
                    className="bt-b"
                    onClick={() => {
                      setIsMesSeleccionado(true);
                      setIsDiaSeleccionado(false);
                      setPaginaSeleccionada(0);
                      preObtenerRentas(0, 10, undefined, mesSeleccionado);
                    }}
                  >
                    <IconoBootstrap nombre="Search" />
                  </Button>
                </div>
              </InputGroup>
            </Col>
          </Row>

          <Navbar.Toggle />

          {/* Boton de ultimas rentas */}
          <Navbar.Collapse className="justify-content-end">
            {/* ultimas rentas */}
            <div className="boton-buscar">
              <Button
                className="bt-b"
                onClick={() => {
                  LimpiarFiltros();
                  setPaginaSeleccionada(0);
                  preObtenerRentas(0, 10);
                }}
              >
                Ultimas rentas
              </Button>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* // * TARJETA ------------------ */}
      <Col sm={4}>
        <TarjetaRenta
          renta={rentaSeleccionada}
          setCargandoAccion={props.setCargandoAccion}
          setRentaSeleccionada={setRentaSeleccionada}
          recargarTabla={() => {
            props.obtenerMasDatos(0, 10);
            setPaginaSeleccionada(0);
          }}
        />
      </Col>

      {/* // * TABLA ------------------ */}
      <Col sm={8}>
        <div>
          {/* TABLA */}
          {props.lista.length < 1 && !props.isCargandoTabla ? (
            // ? Esta vacía y no esta cargando
            <div className="contenedor-centrado-grafica">
              <h4>No se encontraron rentas</h4>
            </div>
          ) : (
            <Table
              responsive
              bordered
              variant="dark"
              style={{ marginBottom: 0 }}
            >
              {/* TÍTULOS */}
              <thead>
                <tr>
                  {props.columnas.no && <th>No</th>}
                  {props.columnas.fecha && <th>Fecha</th>}
                  {props.columnas.inicio && <th>Inicio</th>}
                  {props.columnas.final && <th>Final</th>}
                  {props.columnas.duracion && <th>Min</th>}
                  {props.columnas.noControles && <th>Controles</th>}
                  {props.columnas.isPagado && <th>Pagado</th>}
                  {props.columnas.total && <th>Total</th>}
                  {props.columnas.xbox && <th>Xbox</th>}
                  {props.columnas.cliente && <th>Cliente</th>}
                  {props.columnas.comentario && <th>Comentario</th>}
                  {props.columnas.masInf && <th>Ver</th>}
                </tr>
              </thead>
              {/* Esta cargando */}
              {props.isCargandoTabla ? (
                // Componente cargando
                <ComponenteCargandoTabla
                  filas={props.lista.length < 1 ? 10 : props.lista.length}
                  columnas={6}
                  pagSeleccionada={pagSeleccionada}
                  paginaciones={listaPaginaciones}
                  no
                />
              ) : (
                // ? Rentas
                <tbody>
                  {/* Recorremos */}
                  {props.lista.map((renta, i) => {
                    // Todo, Datos tabla
                    return (
                      <tr key={i} className="text-left">
                        {/* Numero */}
                        {props.columnas.no && (
                          <td>
                            {listaPaginaciones[pagSeleccionada]
                              ? listaPaginaciones[pagSeleccionada].desde +
                                (i + 1)
                              : i + 1}
                          </td>
                        )}
                        {/* Fecha */}
                        {props.columnas.fecha && (
                          <td>{formatearFecha(renta.fecha)}</td>
                        )}
                        {/* Inicio */}
                        {props.columnas.inicio && (
                          <td>
                            {formatearHoraSinSegundos(renta.inicio) ??
                              renta.inicio}
                          </td>
                        )}
                        {/* Final */}
                        {props.columnas.final && (
                          <td>{renta.final ? renta.final : "N/A"}</td>
                        )}
                        {/* Duracion */}
                        {props.columnas.duracion && (
                          <td>
                            {renta.duracion
                              ? parseInt(renta.duracion)
                              : "Activo"}
                          </td>
                        )}
                        {/* No de controles */}
                        {props.columnas.noControles && (
                          <td>{renta.noControles}</td>
                        )}
                        {/* Pagado */}
                        {props.columnas.isPagado && (
                          <td>{renta.isPagado === 1 ? "SI" : "NO"}</td>
                        )}
                        {/* Total */}
                        {props.columnas.total && <td>{"$" + renta.total}</td>}
                        {/*  Xbox */}
                        {props.columnas.xbox && renta.xbox && (
                          <TextoLargoTablaElement
                            texto={renta.xbox.nombre ?? ""}
                            lg={10}
                            i={renta.id}
                          />
                        )}
                        {/* Cliente */}
                        {props.columnas.cliente && (
                          <TextoLargoTablaElement
                            texto={renta.cliente ?? ""}
                            lg={10}
                            i={renta.id}
                          />
                        )}
                        {/* Descripcion */}
                        {props.columnas.comentario && (
                          <TextoLargoTablaElement
                            texto={renta.comentario ?? ""}
                            lg={15}
                            i={renta.id}
                          />
                        )}
                        {/* Mas información */}
                        {props.columnas.masInf && (
                          <td>
                            <IconoBootstrap
                              onClick={() => setRentaSeleccionada(renta)}
                              nombre={"EyeFill"}
                            />
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              )}
            </Table>
          )}

          {/* PAGINACION */}
          <Pagination size="sm" className="pagination-tabla">
            {/* Recorremos */}
            {listaPaginaciones.map((pagina, i) => {
              // Dia
              const dia: Date | undefined = isDiaSeleccionado
                ? diaSeleccionado
                : undefined;

              // Mes
              const mes: Date | undefined = isMesSeleccionado
                ? mesSeleccionado
                : undefined;

              return (
                <Pagination.Item
                  // disabled={props.isCargandoTabla}
                  active={pagSeleccionada === i}
                  key={i}
                  onClick={() => {
                    // ? Cargando
                    if (props.isCargandoTabla) {
                      return;
                    }

                    setPaginaSeleccionada(i);
                    preObtenerRentas(pagina.desde, pagina.asta, dia, mes);
                  }}
                >
                  {i + 1}
                </Pagination.Item>
              );
            })}
          </Pagination>
        </div>
      </Col>
    </Row>
  );
};

export default TablaRentas;

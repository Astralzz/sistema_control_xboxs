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
import Venta from "../../models/Venta";
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
import { ColumnasVentas } from "../../components/tablas/ComponenteTablaVentasPorProducto";
import TarjetaVenta from "./TarjetaVenta";
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
  lista: Venta[];
  totalVentas: number;
  columnas: ColumnasVentas;
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
const TablaVentas: React.FC<Props> = (props) => {
  // * Variables
  const [ventaSeleccionada, setVentaSeleccionada] = useState<Venta | null>(
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

  // * Pre obtener ventas
  const preObtenerVentas = (
    desde: number,
    asta: number,
    dia?: Date,
    mes?: Date
  ): void => props.obtenerMasDatos(desde, asta, dia, mes);

  // * Al cambiar
  useEffect(() => {
    // Total
    const pag: Paginacion[] = calcularPaginaciones(props.totalVentas);
    setListaPaginaciones(pag);
  }, [props.totalVentas]);

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
                      preObtenerVentas(0, 10, diaSeleccionado);
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
                      preObtenerVentas(0, 10, undefined, mesSeleccionado);
                    }}
                  >
                    <IconoBootstrap nombre="Search" />
                  </Button>
                </div>
              </InputGroup>
            </Col>
          </Row>

          <Navbar.Toggle />

          {/* Boton de ultimas ventas */}
          <Navbar.Collapse className="justify-content-end">
            {/* ultimas ventas */}
            <div className="boton-buscar">
              <Button
                className="bt-b"
                onClick={() => {
                  LimpiarFiltros();
                  setPaginaSeleccionada(0);
                  preObtenerVentas(0, 10);
                }}
              >
                Ultimas ventas
              </Button>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* // * TARJETA ------------------ */}
      <Col sm={4}>
        <TarjetaVenta
          venta={ventaSeleccionada}
          setCargandoAccion={props.setCargandoAccion}
          setVentaSeleccionada={setVentaSeleccionada}
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
              <h4>No se encontraron ventas</h4>
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
                  {props.columnas.fecha && <th>fecha</th>}
                  {props.columnas.hora && <th>Hora</th>}
                  {props.columnas.noProductos && <th>Productos</th>}
                  {props.columnas.total && <th>Total</th>}
                  {props.columnas.comentario && <th>Comentario</th>}
                  {props.columnas.masInf && <th>Ver</th>}
                </tr>
              </thead>
              {/* Esta cargando */}
              {props.isCargandoTabla ? (
                // Componente cargando
                <ComponenteCargandoTabla
                  filas={props.lista.length < 1 ? 10 : props.lista.length}
                  columnas={5}
                  pagSeleccionada={pagSeleccionada}
                  paginaciones={listaPaginaciones}
                  no
                />
              ) : (
                // ? Ventas
                <tbody>
                  {/* Recorremos */}
                  {props.lista.map((venta, i) => {
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
                          <td>{formatearFecha(venta.fecha)}</td>
                        )}
                        {/* Hora */}
                        {props.columnas.hora && (
                          <td>{formatearHoraSinSegundos(venta.hora)}</td>
                        )}
                        {/* Productos */}
                        {props.columnas.noProductos && (
                          <td>{venta.noProductos}</td>
                        )}
                        {/* Total */}
                        {props.columnas.total && <td>{"$" + venta.total}</td>}
                        {/* Descripcion */}
                        {props.columnas.comentario && (
                          <TextoLargoTablaElement
                            texto={venta.comentario ?? ""}
                            i={venta.id}
                          />
                        )}
                        {/* Mas información */}
                        {props.columnas.masInf && (
                          <td>
                            <IconoBootstrap
                              onClick={() => setVentaSeleccionada(venta)}
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
                    preObtenerVentas(pagina.desde, pagina.asta, dia, mes);
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

export default TablaVentas;

import React, { Dispatch, useEffect, useState } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  InputGroup,
  Navbar,
  Pagination,
  Row,
  Spinner,
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
import { regexNombre, regexNumerosEnteros } from "../../functions/variables";
import { ColumnasVentas } from "../../components/tablas/ComponenteTablaVentasPorProducto";

// * Estilos
const styles: React.CSSProperties = {
  backgroundColor: "transparent",
  color: "var(--color-letra)",
  border: "none",
  borderBottom: "1px solid white",
};

// * Props
interface Props {
  lista: Venta[];
  totalVentas: number;
  columnas: ColumnasVentas;
  setCargandoTabla: Dispatch<boolean>;
  setVentaSeleccionada: Dispatch<Venta | null>;
  ventaSeleccionada: Venta | null;
  obtenerMasDatos: (
    desde: number,
    asta: number,
    nombre?: string,
    stock?: number
  ) => void;
  isCargandoTabla: boolean;
}

// Todo, Tabla Rentas
const TablaVentas: React.FC<Props> = (props) => {
  // * Variables
  const [listaPaginaciones, setListaPaginaciones] = useState<Paginacion[]>([]);
  const [pagSeleccionada, setPaginaSeleccionada] = useState<number>(0);
  const [textBuscarNombre, setTextBuscarNombre] = useState<string>("");
  const [textBuscarCantidad, setTextBuscarCantidad] = useState<string>("");
  const [isFiltroNombre, setFiltroNombre] = useState<boolean>(false);
  const [isFiltroCantidad, setFiltroCantidad] = useState<boolean>(false);

  // * Limpiar filtros
  const LimpiarFiltros = (): void => {
    setFiltroCantidad(false);
    setFiltroNombre(false);
  };

  // * Pre obtener ventas
  const preObtenerVentas = (desde: number, asta: number): void =>
    props.obtenerMasDatos(desde, asta);

  // * Al cambiar
  useEffect(() => {
    // Total
    const pag: Paginacion[] = calcularPaginaciones(props.totalVentas);
    setListaPaginaciones(pag);
  }, [props.totalVentas]);

  // * Al cambiar
  useEffect(() => {
    // ? No existe
    if (!props.ventaSeleccionada) {
      LimpiarFiltros();
    }
  }, [props.ventaSeleccionada]);

  return (
    <div>
      {/* BARRA SUPERIOR */}
      <Navbar className="bg-body-transparent justify-content-end">
        <Container>
          {/* Todos los ventas */}
          <div className="boton-buscar">
            <Button
              className="bt-b"
              onClick={() => {
                LimpiarFiltros();
                preObtenerVentas(0, 10);
              }}
            >
              Todos
            </Button>
          </div>
          <Navbar.Toggle />

          <Navbar.Collapse className="justify-content-end">
            <Row>
              {/* Nombre */}
              <Col xs={8}>
                <Form
                  onSubmit={(event) => {
                    event.preventDefault();
                    setFiltroCantidad(false);
                    setFiltroNombre(true);
                    // preObtenerVentas(0, 10, textBuscarNombre);
                  }}
                >
                  <InputGroup className="placeholder-blanco">
                    <Form.Control
                      placeholder="Nombre del venta"
                      type="text"
                      style={styles}
                      className={
                        textBuscarNombre === ""
                          ? ""
                          : regexNombre.test(textBuscarNombre)
                          ? "is-valid"
                          : "is-invalid"
                      }
                      value={textBuscarNombre}
                      onChange={(t) => setTextBuscarNombre(t.target.value)}
                    />
                    <div className="boton-buscar">
                      <Button
                        disabled={!regexNombre.test(textBuscarNombre)}
                        type="submit"
                        className="bt-b"
                      >
                        <IconoBootstrap nombre="Search" />
                      </Button>
                      {/* Eliminar */}
                      <Button
                        disabled={textBuscarNombre.length < 1}
                        onClick={() => setTextBuscarNombre("")}
                        className="bt-b"
                      >
                        <IconoBootstrap nombre="X" />
                      </Button>
                    </div>
                  </InputGroup>
                </Form>
              </Col>
              {/* Stock */}
              <Col xs={4}>
                <Form
                  onSubmit={(event) => {
                    event.preventDefault();
                    setFiltroNombre(false);
                    setFiltroCantidad(true);
                    // preObtenerVentas(
                    //   0,
                    //   10,
                    //   undefined,
                    //   Number(textBuscarCantidad)
                    // );
                  }}
                >
                  <InputGroup className="placeholder-blanco">
                    <Form.Control
                      placeholder="stock"
                      type="text"
                      style={styles}
                      className={
                        textBuscarCantidad === ""
                          ? ""
                          : regexNumerosEnteros.test(textBuscarCantidad)
                          ? "is-valid"
                          : "is-invalid"
                      }
                      value={String(textBuscarCantidad)}
                      onChange={(t) => setTextBuscarCantidad(t.target.value)}
                    />
                    <div className="boton-buscar">
                      {/* Buscar */}
                      <Button
                        disabled={!regexNumerosEnteros.test(textBuscarCantidad)}
                        className="bt-b"
                        type="submit"
                      >
                        <IconoBootstrap nombre="Search" />
                      </Button>
                      {/* Eliminar */}
                      <Button
                        disabled={textBuscarCantidad.length < 1}
                        onClick={() => setTextBuscarCantidad("")}
                        className="bt-b"
                      >
                        <IconoBootstrap nombre="X" />
                      </Button>
                    </div>
                  </InputGroup>
                </Form>
              </Col>
            </Row>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {/* TABLA */}
      {props.lista.length < 1 && !props.isCargandoTabla ? (
        // ? Esta vacía y no esta cargando
        <div className="contenedor-centrado">
          <h4>No se encontraron ventas</h4>
        </div>
      ) : (
        <Table responsive bordered variant="dark" style={{ marginBottom: 0 }}>
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
              columnas={6}
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
                          ? listaPaginaciones[pagSeleccionada].desde + (i + 1)
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
                    {props.columnas.noProductos && <td>{venta.noProductos}</td>}
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
                          onClick={() => props.setVentaSeleccionada(venta)}
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
          // Nombre
          const nombre: string | undefined =
            regexNombre.test(textBuscarNombre) && isFiltroNombre
              ? textBuscarNombre
              : undefined;

          // Stock
          const stock: number | undefined =
            regexNumerosEnteros.test(textBuscarCantidad) && isFiltroCantidad
              ? Number(textBuscarCantidad)
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
                // preObtenerVentas(pagina.desde, pagina.asta, nombre, stock);
              }}
            >
              {i + 1}
            </Pagination.Item>
          );
        })}
      </Pagination>
    </div>
  );
};

export default TablaVentas;

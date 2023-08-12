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
  alertaSwal,
  calcularPaginaciones,
  formatearFecha,
  formatearHoraSinSegundos,
} from "../../functions/funcionesGlobales";
import {
  ComponenteCargandoTabla,
  TextoLargoTablaElement,
} from "../../components/oters/Otros";
import {
  FiltroFechasGrafica,
  regexNombre,
  regexNumerosEnteros,
} from "../../functions/variables";
import { ColumnasVentas } from "../../components/tablas/ComponenteTablaVentasPorProducto";

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
  setVentaSeleccionada: Dispatch<Venta | null>;
  ventaSeleccionada: Venta | null;
  obtenerMasDatos: (desde: number, asta: number) => void;
  actualizarGrafica: (tipo: FiltroFechasGrafica, noDatos: number) => void;
  isCargandoTabla: boolean;
}

// Todo, Tabla Rentas
const TablaVentas: React.FC<Props> = (props) => {
  // * Variables
  const [listaPaginaciones, setListaPaginaciones] = useState<Paginacion[]>([]);
  const [pagSeleccionada, setPaginaSeleccionada] = useState<number>(0);
  const [textBuscarNombre, setTextBuscarNombre] = useState<string>("");
  const [textBuscarCantidad, setTextBuscarCantidad] = useState<string>("");
  const [tipoDeGrafica, setTipoDeGrafica] =
    useState<FiltroFechasGrafica>("periodica");
  const [noDatosGrafica, setNoDatosGrafica] = useState<string>("7");

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
        props.actualizarGrafica(tipoDeGrafica, Number(noDatosGrafica));
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
      <Navbar className="bg-body-transparent justify-content-start">
        {/* Parte de la grafica */}
        <InputGroup className="placeholder-blanco">
          {/* Tipo de grafica */}
          <InputGroup.Text style={styles[1]}>Grafica</InputGroup.Text>
          <Form.Select
            aria-label="Tipo de grafica"
            value={tipoDeGrafica}
            onChange={(n) => {
              // Valor
              const valor: FiltroFechasGrafica = n.target
                .value as FiltroFechasGrafica;
              if (
                // ? Es valido
                ["periodica", "semanal", "mensual", "anual"].includes(valor)
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
          {/* Numero de datos */}
          <InputGroup.Text style={styles[1]}>Datos</InputGroup.Text>
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
          {/* Boton */}
          <div className="boton-buscar">
            {/* Buscar */}
            <Button
              disabled={isBloquearBotonGrafica()}
              onClick={() => actualizarGrafica()}
              className="bt-b"
              type="submit"
            >
              Actualizar
            </Button>
          </div>
        </InputGroup>

        {/* Datos de tabla */}
        <Container>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            {/* Todos los ventas */}
            <div className="boton-buscar">
              <Button
                className="bt-b"
                onClick={() => {
                  LimpiarFiltros();
                  preObtenerVentas(0, 10);
                }}
              >
                Por Defecto
              </Button>
            </div>
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

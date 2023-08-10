import React, { useCallback, useEffect, useState } from "react";
import {
  Button,
  ButtonGroup,
  Card,
  Col,
  Form,
  InputGroup,
  ListGroup,
  Row,
} from "react-bootstrap";
import { regexNombre } from "../../functions/variables";
import IconoBootstrap from "../../components/global/IconoBootstrap";
import Producto from "../../models/Producto";
import ComponenteCargando from "../../components/global/ComponenteCargando";
import { RespuestaApi } from "../../apis/apiVariables";
import { apiObtenerListaProductosPorNombre } from "../../apis/apiProductos";
import {
  alertaSwal,
  confirmacionSwal,
  fechaHoraActual,
  generateRandomId,
} from "../../functions/funcionesGlobales";
import ReactLoading from "react-loading";
import { TextoLargoParrafoElement } from "../../components/global/Otros";
import { useLocation } from "react-router";
import { DetalleVenta } from "../../models/Venta";

// * Crear detalles
const crearDetallesDesdeProductosAgregados = (
  productosAgregados: VentaProducto[]
): DetalleVenta[] => {
  // Datos
  const detalles: DetalleVenta[] = [];
  const productoCantidadMap = new Map<number, number>();

  // Recorremos
  productosAgregados.forEach((producto) => {
    // Id
    const idProducto = producto.id;

    // ? Ya esta en la lista?
    if (productoCantidadMap.has(idProducto)) {
      // Cantidad actual
      const cantidadActual = productoCantidadMap.get(idProducto) ?? 0;
      productoCantidadMap.set(idProducto, cantidadActual + 1);
    } else {
      productoCantidadMap.set(idProducto, 1);
    }
  });

  // Recorremos y agregamos
  productoCantidadMap.forEach((cantidad, idProducto) => {
    detalles.push({ id_producto: idProducto, cantidad: cantidad });
  });

  return detalles;
};

// * Estilos
const styles: React.CSSProperties = {
  backgroundColor: "transparent",
  color: "var(--color-letra)",
  border: "none",
  borderBottom: "1px solid white",
};

// * New producto
interface VentaProducto extends Producto {
  idVenta: string;
}

// TODO, Pagina de los xbox
const ContenedorInicioVentas: React.FC = () => {
  // * Variables
  const location = useLocation();
  const [isCargandoProductos, setCargandoProductos] = useState<boolean>(false);
  const [isCargandoAccion, setCargandoAccion] = useState<boolean>(false);
  const [precioTotal, setPrecioTotal] = useState<number>(0);
  const [textBuscarNombre, setTextBuscarNombre] = useState<string>("");
  const [listaProductos, setListaProductos] = useState<VentaProducto[]>([]);
  const [listaProductosAgregados, setListaProductosAgregados] = useState<
    VentaProducto[]
  >([]);

  // * Data
  const obtenerFormData = (): FormData => {
    // Fecha y hora
    const { fecha: f, hora: h } = fechaHoraActual();
    // Total
    const noProductos: string = String(listaProductosAgregados.length);
    // lista de detalles
    const detalles: DetalleVenta[] = crearDetallesDesdeProductosAgregados(
      listaProductosAgregados
    );

    // Datos
    const data: FormData = new FormData();
    data.append("fecha", f);
    data.append("hora", h);
    data.append("noProductos", noProductos);
    data.append("total", String(precioTotal));
    data.append("comentario", "Este es un comentario");
    data.append("detalles", JSON.stringify(detalles));

    return data;
  };

  // * Realizar venta
  const realizarVenta = async (): Promise<void> => {
    try {
      // Confirmacion
      const conf: boolean = await confirmacionSwal(
        "Realizar venta?",
        `Estas seguro/a que deseas realizar esta venta por $${precioTotal} pesos`,
        "Si vender"
      );

      // ? Confirmacion aceptada
      if (conf) {
        setCargandoAccion(true);

        // Obtenemos data
        const data: FormData = obtenerFormData();

      }
    } catch (error) {
      alertaSwal("Error", String(error), "error");
    } finally {
      setCargandoAccion(false);
    }
  };

  // * Obtener productos
  const obtenerProductos = async (
    nombre: string,
    desde: number = 0,
    asta: number = 10
  ): Promise<void> => {
    try {
      setCargandoProductos(true);

      // Respuesta
      const res: RespuestaApi = await apiObtenerListaProductosPorNombre(
        nombre,
        desde,
        asta
      );

      // ? salio mal
      if (!res.estado) {
        alertaSwal("Error", "Ocurrió un error inesperado", "error");
        return;
      }

      // ? Llego la lista
      if (!res.listaProductos) {
        alertaSwal(
          "Error",
          "La lista de productos no llego correctamente",
          "error"
        );
        return;
      }

      // Lista
      let newLista: VentaProducto[] = [];
      // Recorremos
      res.listaProductos.forEach((p) => {
        newLista.push({
          ...p,
          idVenta: generateRandomId(),
        });
      });

      // Ponemos lista
      setListaProductos(newLista);
    } catch (error) {
      alertaSwal("Error", String(error), "error");
    } finally {
      setCargandoProductos(false);
    }
  };

  // * Agregar producto
  const agregarProducto = (producto: VentaProducto): void => {
    // ?No hay stock
    if (producto.stock < 1) {
      alertaSwal(
        "Alerta",
        `${producto} ya no cuenta con existencias`,
        "warning"
      );
      return;
    }

    // Encuentra el índice del producto en la lista listaProductos
    const idProducto = listaProductos.findIndex((p) => p.id === producto.id);

    // ? No es -1
    if (idProducto !== -1) {
      // Disminuye el stock del producto
      const updatedProductos = [...listaProductos];
      updatedProductos[idProducto] = {
        ...updatedProductos[idProducto],
        stock: updatedProductos[idProducto].stock - 1,
      };

      // Agrega el producto a la lista de productos agregados
      setListaProductosAgregados([
        ...listaProductosAgregados,
        { ...producto, idVenta: generateRandomId() },
      ]);

      // Actualiza el estado de listaProductos con el stock disminuido
      setListaProductos(updatedProductos);
      return;
    }
  };

  // * Eliminar de agregados
  const eliminarProductoDeAgregados = (producto: VentaProducto): void => {
    // Indice del producto en la lista listaProductos
    const productoIndex = listaProductos.findIndex((p) => p.id === producto.id);

    //  ? No es -1
    if (productoIndex !== -1) {
      // Aumentamos stock del producto
      const updatedProductos = [...listaProductos];
      updatedProductos[productoIndex] = {
        ...updatedProductos[productoIndex],
        stock: updatedProductos[productoIndex].stock + 1,
      };

      // Actualizamos
      setListaProductos(updatedProductos);
    }

    // Eliminamos de la lista de productos agregados
    const updatedListaProductosAgregados = listaProductosAgregados.filter(
      (p) => p.idVenta !== producto.idVenta
    );
    setListaProductosAgregados(updatedListaProductosAgregados);
  };

  // * Limpiar
  const limpiarDatos = (): void => {
    setTextBuscarNombre("");
    setListaProductos([]);
  };

  // * Al cambiar lista de agregados
  useEffect(() => {
    let total: number = 0;
    // Recorremos
    for (const producto of listaProductosAgregados) {
      total += producto.precio;
    }
    // Actualizamos
    setPrecioTotal(parseFloat(total.toFixed(2)));
  }, [listaProductosAgregados]);

  // * Al cambiar pagina
  useEffect(() => {
    limpiarDatos();
  }, [location.pathname]);

  return (
    <>
      {/* Tarjeta */}
      <Card>
        {/* Encabezado */}
        <Card.Header>
          <Form
            onSubmit={(event) => {
              event.preventDefault();
              obtenerProductos(textBuscarNombre);
            }}
          >
            {/* Nombre */}
            <InputGroup className="placeholder-blanco">
              <Form.Control
                placeholder="buscar producto por nombre"
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
                maxLength={60}
                onChange={(t) => setTextBuscarNombre(t.target.value)}
              />
              <div className="boton-buscar">
                {/* Buscar */}
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
                  <IconoBootstrap nombre="X" size={20} />
                </Button>
              </div>
            </InputGroup>
          </Form>
        </Card.Header>

        {/* Cuerpo */}
        <Card.Body>
          <Row>
            {/* Parte izquierda */}
            <Col xs={6}>
              {isCargandoProductos ? (
                // ? Cargando
                <div className="contenedor-centrado-auto">
                  <ReactLoading type={"bubbles"} color="#FFF" />
                </div>
              ) : listaProductos.length < 1 ? (
                <div className="contenedor-centrado-auto">
                  <p>Ningún resultado</p>
                </div>
              ) : (
                // ? Lista de productos
                <ListGroup variant="flush" as={"ul"}>
                  {listaProductos.map((productoVenta, i) => {
                    return (
                      <ListGroup.Item
                        style={{
                          backgroundColor: "transparent",
                          color: productoVenta.stock > 0 ? "white" : "red",
                        }}
                        className="list-group-item d-flex justify-content-between align-items-center p-1"
                        as={"li"}
                        key={i}
                      >
                        {/* Nombre y stock*/}
                        <TextoLargoParrafoElement
                          lg={18}
                          texto={`${productoVenta.nombre} | ${productoVenta.stock}`}
                          i={i}
                        />

                        {/* Boton agregar */}
                        <div className="boton-buscar">
                          <Button
                            disabled={productoVenta.stock < 1}
                            onClick={() => {
                              agregarProducto(productoVenta);
                            }}
                            className="bt-b"
                          >
                            <IconoBootstrap nombre="BagPlusFill" size={20} />
                          </Button>
                        </div>
                      </ListGroup.Item>
                    );
                  })}
                </ListGroup>
              )}
            </Col>
            <Col xs={6}>
              <h5>Producto agregados</h5>

              {/* Lista de agregados */}
              {listaProductosAgregados.length < 1 ? (
                <div className="contenedor-centrado-auto">
                  <p>Ningún producto agregado</p>
                </div>
              ) : (
                <>
                  {/* Lista de productos */}
                  <ListGroup variant="flush" as={"ul"}>
                    {/* Lista */}
                    {listaProductosAgregados.map((productoVenta, i) => {
                      return (
                        <ListGroup.Item
                          style={{
                            backgroundColor: "transparent",
                            color: "white",
                          }}
                          className="list-group-item d-flex justify-content-between align-items-center p-1"
                          as={"li"}
                          key={i}
                        >
                          {/* Nombre */}
                          <TextoLargoParrafoElement
                            lg={18}
                            texto={`${i + 1}. ${productoVenta.nombre}`}
                            i={i}
                          />

                          {/* Boton eliminar producto */}
                          <div className="boton-buscar">
                            <Button
                              onClick={() => {
                                eliminarProductoDeAgregados(productoVenta);
                              }}
                              className="bt-b"
                            >
                              <IconoBootstrap nombre="X" size={20} />
                            </Button>
                          </div>
                        </ListGroup.Item>
                      );
                    })}
                  </ListGroup>
                  <br className="mb-1" />
                  {/*  Botones */}
                  <div className="botones-tarjeta">
                    <Row>
                      <Col xs={9}>
                        {/* Vender */}
                        <Button
                          className="bt-tr w-100"
                          onClick={() => realizarVenta()}
                        >
                          {`$ ${precioTotal}`}
                        </Button>
                      </Col>
                      <Col xs={3}>
                        {/* Limpiar */}
                        <Button
                          className="bt-tr bt-bcr w-100"
                          onClick={() => {
                            // ? Esta correcto
                            if (regexNombre.test(textBuscarNombre)) {
                              obtenerProductos(textBuscarNombre);
                              setListaProductosAgregados([]);
                              return;
                            }

                            setListaProductos([]);
                            setListaProductosAgregados([]);
                          }}
                        >
                          <IconoBootstrap nombre="Trash2Fill" />
                        </Button>
                      </Col>
                    </Row>
                  </div>
                </>
              )}
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* CARGANDO */}
      <ComponenteCargando tipo={"spin"} estadoModal={isCargandoAccion} />
    </>
  );
};

export default ContenedorInicioVentas;

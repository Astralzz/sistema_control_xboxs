import React, { useEffect, useState } from "react";
import {
  Button,
  ButtonGroup,
  Card,
  Col,
  Form,
  InputGroup,
  ListGroup,
  OverlayTrigger,
  Popover,
  Row,
} from "react-bootstrap";
import { regexDescripcion, regexNombre } from "../../functions/variables";
import IconoBootstrap from "../../components/oters/IconoBootstrap";
import Producto from "../../models/Producto";
import ComponenteCargando from "../../components/oters/ComponenteCargando";
import { RespuestaApi } from "../../apis/apiVariables";
import { apiObtenerListaProductosPorNombre } from "../../apis/apiProductos";
import {
  alertaSwal,
  confirmacionSwal,
  fechaHoraActual,
  generateRandomId,
} from "../../functions/funcionesGlobales";
import ReactLoading from "react-loading";
import { TextoLargoParrafoElement } from "../../components/oters/Otros";
import { useLocation } from "react-router";
import { DetalleVenta } from "../../models/Venta";
import { apiCrearNuevaVenta } from "../../apis/apiVentas";

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

const styleComentario: React.CSSProperties = {
  backgroundColor: "var(--color-variant)",
  color: "var(--color-letra)",
  border: "none",
};

// * New producto
interface VentaProducto extends Producto {
  IdProductoAgregado: string;
}

// TODO, Pagina de los xbox
const TarjetaVenderProducto: React.FC = () => {
  // * Variables
  const location = useLocation();
  const [isCargandoProductos, setCargandoProductos] = useState<boolean>(false);
  const [isCargandoAccion, setCargandoAccion] = useState<boolean>(false);
  const [precioTotal, setPrecioTotal] = useState<number>(0);
  const [textBuscarNombre, setTextBuscarNombre] = useState<string>("");
  const [comentario, setComentario] = useState<string>("");
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

    // ? Comentario valido
    if (regexDescripcion.test(comentario)) {
      data.append("comentario", comentario);
    }

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

        // Hacemos request
        const res: RespuestaApi = await apiCrearNuevaVenta(data);

        // ? salio mal
        if (!res.estado) {
          throw new Error(
            res.detalles_error
              ? String(res.detalles_error)
              : "Ocurrió un error al crear la venta, intenta mas tarde"
          );
        }

        // ? No se puede aumentar
        if (!res.venta) {
          alertaSwal(
            "Casi éxito!",
            "La venta se creo correctamente pero no se vera reflejado el cambio asta que reinicie la sección",
            "warning"
          );
          return;
        }

        // * Éxito
        alertaSwal(
          "Éxito!",
          res.mensaje ?? "Venta creada correctamente",
          "success"
        );

        // Limpiamos
        setListaProductosAgregados([]);
        setComentario("");
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
        throw new Error(
          res.detalles_error
            ? String(res.detalles_error)
            : "Ocurrió un error al crear la venta, intenta mas tarde"
        );
      }

      // ? Llego la lista
      if (!res.listaProductos) {
        throw new Error("La lista de productos no llego correctamente");
      }

      // Lista
      let newLista: VentaProducto[] = [];
      // Recorremos
      res.listaProductos.forEach((p) => {
        newLista.push({
          ...p,
          IdProductoAgregado: generateRandomId(),
        });
      });

      // * disminuimos stock
      const listaDisminuida: VentaProducto[] =
        disminuirStockListaProductos(newLista);

      // Agregamos
      setListaProductos(listaDisminuida);
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
        { ...producto, IdProductoAgregado: generateRandomId() },
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
      (p) => p.IdProductoAgregado !== producto.IdProductoAgregado
    );
    setListaProductosAgregados(updatedListaProductosAgregados);
  };

  //  * Disminuir stock de la lista
  const disminuirStockListaProductos = (
    newLista: VentaProducto[]
  ): VentaProducto[] => {
    // Objeto para rastrear la cantidad total de cada producto
    const cantidadPorProducto: { [key: string]: number } = {};

    // Recorremos los productos agregados
    listaProductosAgregados.forEach((productoAgregado) => {
      // Id
      const idProducto = productoAgregado.id;

      // ? Aun no existe
      if (!cantidadPorProducto[idProducto]) {
        // Iniciamos en 0
        cantidadPorProducto[idProducto] = 0;
      }

      // Incrementamos en 1
      cantidadPorProducto[idProducto] += 1; // Para cuando hay mas de un producto
    });

    // Retornamos la lista con los stock disminuidos
    return newLista.map((producto) => {
      // Id
      const idProducto = producto.id;

      // ? Existe
      if (cantidadPorProducto[idProducto]) {
        // Cantidad a reducir
        const cantidadEnAgregados = cantidadPorProducto[idProducto];
        return {
          ...producto,
          stock: producto.stock - cantidadEnAgregados,
        };
      }

      return producto;
    });
  };

  // * Aumentar stock de la lista
  const aumentarStockListaProductos = (
    newLista: VentaProducto[]
  ): VentaProducto[] => {
    // Objeto para rastrear la cantidad total de cada producto
    const cantidadPorProducto: { [key: string]: number } = {};

    // Recorremos los productos agregados
    listaProductosAgregados.forEach((productoAgregado) => {
      // Id
      const idProducto = productoAgregado.id;

      // ? Aun no existe
      if (!cantidadPorProducto[idProducto]) {
        // Iniciamos en 0
        cantidadPorProducto[idProducto] = 0;
      }

      // Incrementamos en 1
      cantidadPorProducto[idProducto] += 1;
    });

    // Retornamos la lista con los stock aumentados
    return newLista.map((producto) => {
      // Id
      const idProducto = producto.id;

      // ? Existe
      if (cantidadPorProducto[idProducto]) {
        // Cantidad a aumentar
        const cantidadEnAgregados = cantidadPorProducto[idProducto];
        return {
          ...producto,
          stock: producto.stock + cantidadEnAgregados,
        };
      }

      return producto;
    });
  };

  // * Limpiar
  const limpiarDatos = (): void => {
    setTextBuscarNombre("");
    setListaProductos([]);
  };

  // * Limpiar agregados
  const limpiarAgregados = async (): Promise<void> => {
    // Confirmacion
    const conf: boolean = await confirmacionSwal(
      "Limpiar venta?",
      `Estas seguro/a que deseas limpiar esta venta`,
      "Si limpiar"
    );

    // ? Confirmado
    if (conf) {
      // * aumentamos stock
      const listaAumentada: VentaProducto[] =
        aumentarStockListaProductos(listaProductos);

      // Agregamos
      setListaProductos(listaAumentada);

      // * Limpiamos
      setListaProductosAgregados([]);
    }
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

  // * Comentario
  const ComentarioFlotante = (
    <Popover>
      <Popover.Header style={styleComentario} as="h3">
        Comentario
      </Popover.Header>
      <Popover.Body style={styleComentario}>
        <InputGroup style={styles} className="placeholder-blanco">
          <Form.Control
            as="textarea"
            rows={3}
            style={styles}
            className={
              regexDescripcion.test(comentario) ? "is-valid" : "is-invalid"
            }
            value={comentario}
            maxLength={60}
            onChange={(t) => setComentario(t.target.value)}
          />
        </InputGroup>
      </Popover.Body>
    </Popover>
  );

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
                  <IconoBootstrap nombre="X" />
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
                      <Col xs={7}>
                        {/* Vender */}
                        <Button
                          className="bt-tr w-100"
                          onClick={() => realizarVenta()}
                        >
                          {`$ ${precioTotal}`}
                        </Button>
                      </Col>
                      <Col xs={5}>
                        <ButtonGroup>
                          {/* Comentario */}
                          <OverlayTrigger
                            trigger="click"
                            placement="right"
                            rootClose
                            overlay={ComentarioFlotante}
                          >
                            <Button className="bt-tr bt-bcr w-100">
                              <IconoBootstrap nombre="ChatLeftFill" />
                            </Button>
                          </OverlayTrigger>

                          {/* Limpiar */}
                          <Button
                            className="bt-tr bt-bcr w-100"
                            onClick={() => limpiarAgregados()}
                          >
                            <IconoBootstrap nombre="Trash2Fill" />
                          </Button>
                        </ButtonGroup>
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

export default TarjetaVenderProducto;

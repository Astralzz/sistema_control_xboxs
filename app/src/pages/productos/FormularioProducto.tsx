import React, { Dispatch, FormEvent, useEffect, useRef, useState } from "react";
import Producto from "../../models/Producto";
import { Button, Col, Container, Form, Image, Row } from "react-bootstrap";
import {
  regexDescripcion,
  regexNombre,
  regexNumerosDecimales,
  regexNumerosEnteros,
} from "../../functions/variables";
import imgDefecto from "../../assets/imgs/iconProducto.png";
import {
  alertaSwal,
  validarInputFile,
} from "../../functions/funcionesGlobales";
import { RespuestaApi, URL_SERVER } from "../../apis/apiVariables";
import {
  apiActualizarProducto,
  apiCrearProducto,
} from "../../apis/apiProductos";

// * Estilos
const styles: React.CSSProperties = {
  backgroundColor: "transparent",
  color: "var(--color-letra)",
  border: "none",
  borderBottom: "1px solid white",
};

// * Props
interface Props {
  producto?: Producto;
  setCargando: Dispatch<boolean>;
  setProductoSeleccionado: Dispatch<Producto | null>;
  // aumentarXbox?: (x: Xbox) => void;
  // actualizarXbox?: (id: number, xboxActualizado: Xbox) => void;
}

// Todo, Formulario de producto
const FormularioProducto: React.FC<Props> = (props) => {
  // * Variables
  const refFormularioRegistro = useRef<HTMLFormElement>(null);
  const [imgProducto, setImgProducto] = useState<File | null>(null);
  const [nombre, setNombre] = useState<string>(props.producto?.nombre ?? "");
  const [imgCambiada, setImgCambiada] = useState<boolean>(false);
  const [precio, setPrecio] = useState<string>(
    String(props.producto?.precio ?? "")
  );
  const [stock, setStock] = useState<string>(
    String(props.producto?.stock ?? "")
  );
  const [descripcion, setDescripcion] = useState<string>(
    props.producto?.descripcion ?? ""
  );

  // * Validar datos
  const validarDatos = (): void => {
    // ? Llego producto
    if (props.producto) {
      // Producto
      const p: Producto = props.producto;
      const isDescripcionValida =
        p.descripcion === descripcion || (descripcion === "" && !p.descripcion);

      // ? Es lo mismo
      if (
        p.nombre === nombre &&
        p.precio === Number(precio) &&
        p.stock === Number(stock) &&
        isDescripcionValida &&
        !imgCambiada
      ) {
        throw new Error(
          "Para actualizar se tiene que cambiar al menos un dato"
        );
      }
    }

    // ? Nombre erróneo
    if (!regexNombre.test(nombre)) {
      throw new Error("El campo nombre no es valido");
    }
    // ? Precio erróneo
    if (!regexNumerosDecimales.test(precio)) {
      throw new Error("El campo nombre no es valido");
    }
    // ? Cantidad errónea
    if (!regexNumerosEnteros.test(stock)) {
      throw new Error("El campo cantidad no es valido");
    }
    // ? Descripcion errónea
    if (!regexDescripcion.test(descripcion)) {
      throw new Error("El campo descripcion no es valido");
    }
  };

  // * Crear producto
  const crearProducto = async (data: FormData) => {
    // data.forEach((value, key) => {
    //   console.log(`${key}: ${value}`);
    // });

    // Enviamos
    const res: RespuestaApi = await apiCrearProducto(data);

    // ? salio mal
    if (!res.estado) {
      throw new Error(
        res.detalles_error
          ? String(res.detalles_error)
          : "Ocurrió un error al crear el producto, intenta mas tarde"
      );
    }

    // ? No se puede aumentar
    if (!res.producto) {
      alertaSwal(
        "Casi éxito!",
        "El producto se creo correctamente pero no se vera reflejado el cambio asta que reinicie la sección",
        "warning"
      );
      return;
    }

    props.setProductoSeleccionado(res.producto);

    // * Terminamos
    alertaSwal(
      "Éxito!",
      res.mensaje ?? "Producto creado correctamente",
      "success"
    );
  };

  // * Actualizar producto
  const actualizarProducto = async (data: FormData, id: number) => {
    // Enviamos
    const res: RespuestaApi = await apiActualizarProducto(data, id);

    // ? salio mal
    if (!res.estado) {
      throw new Error(
        res.detalles_error
          ? String(res.detalles_error)
          : "Ocurrió un error al actualizar el producto, intenta mas tarde"
      );
    }

    // ? No se puede aumentar
    if (!res.producto) {
      alertaSwal(
        "Casi éxito!",
        "El producto se actualizo correctamente pero no se vera reflejado el cambio asta que reinicie la sección",
        "warning"
      );
      return;
    }

    props.setProductoSeleccionado(res.producto);

    // * Terminamos
    alertaSwal(
      "Éxito!",
      res.mensaje ?? "Producto actualizado correctamente",
      "success"
    );
  };

  // * Preparar registro
  const accionFormulario = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    // Evitamos recarga
    event.preventDefault();

    try {
      // ? No Existe
      if (!refFormularioRegistro.current) {
        alertaSwal(
          "Error",
          "No se pudieron obtener los datos del formulario",
          "error"
        );
        return;
      }

      props.setCargando(true);

      // * Validamos
      validarDatos();

      //Obtenemos datos
      const data = new FormData(refFormularioRegistro.current);

      // ? Llego producto
      if (props.producto) {
        // Actualizamos
        await actualizarProducto(data, props.producto.id);
        return;
      }

      // Creamos
      await crearProducto(data);
    } catch (error: unknown) {
      alertaSwal("Error", String(error), "error");
    } finally {
      props.setCargando(false);
    }
  };

  // * Validar im
  const validarImg = (event: React.ChangeEvent<HTMLInputElement>): void => {
    // ? Archivo
    const file = event.target.files?.[0] || null;

    // Obtenemos resultado
    const archivoValido = validarInputFile(file);

    // ? Es valido
    if (archivoValido.isValido) {
      setImgProducto(file);
      setImgCambiada(true);
      return;
    }

    setImgProducto(null);
    setImgCambiada(false);
    alertaSwal(
      "Error",
      archivoValido.errorInf ?? "La img no es valida",
      "error"
    );
  };

  useEffect(() => {
    setImgCambiada(false);
  }, [props.producto]);

  return (
    <Container>
      {/* Imagen */}
      <div className="contenedor-avatar">
        <Image
          width={160}
          alt="img-producto"
          src={
            imgProducto
              ? URL.createObjectURL(imgProducto)
              : props.producto?.enlace_img
              ? `${URL_SERVER}/${props.producto?.enlace_img}`
              : imgDefecto
          }
          roundedCircle
        />
      </div>

      {/* Separación */}
      <br className="mb-2" />

      <Form
        encType="multipart/form-data"
        method="post"
        ref={refFormularioRegistro}
        onSubmit={accionFormulario}
      >
        {/* Nombre */}
        <Form.Group className="mb-3 placeholder-blanco" controlId="form-grupo1">
          <Form.Label>
            Nombre del producto <strong style={{ color: "red" }}>*</strong>
          </Form.Label>
          <Form.Control
            style={styles}
            value={nombre}
            type="text"
            autoFocus
            maxLength={60}
            name="nombre"
            autoComplete="off"
            required
            onChange={(e) => setNombre(e.target.value)}
            className={regexNombre.test(nombre) ? "is-valid" : "is-invalid"}
          />
        </Form.Group>

        {/* Precio y stock */}
        <Row className="mb-3">
          {/* Precio */}
          <Form.Group className="mb-3 placeholder-blanco" as={Col}>
            <Form.Label column>
              Precio <strong style={{ color: "red" }}>*</strong>
            </Form.Label>
            <Form.Control
              style={styles}
              value={precio}
              type="number"
              maxLength={6}
              name="precio"
              autoComplete="off"
              required
              onChange={(e) => setPrecio(e.target.value)}
              className={
                regexNumerosDecimales.test(precio) ? "is-valid" : "is-invalid"
              }
            />
          </Form.Group>
          {/* Cantidad */}
          <Form.Group className="mb-3 placeholder-blanco" as={Col}>
            <Form.Label column>
              Cantidad <strong style={{ color: "red" }}>*</strong>
            </Form.Label>
            <Form.Control
              style={styles}
              value={stock}
              type="number"
              maxLength={6}
              name="stock"
              autoComplete="off"
              required
              onChange={(e) => setStock(e.target.value)}
              className={
                regexNumerosEnteros.test(stock) ? "is-valid" : "is-invalid"
              }
            />
          </Form.Group>
        </Row>

        {/* Imagen */}
        <Form.Group className="mb-3">
          <Form.Label>Elegir imagen</Form.Label>
          <Form.Control
            style={styles}
            name={imgProducto ? "enlace_img" : undefined}
            type="file"
            className="input-archivos"
            accept=".jpeg, .png, .jpg, .gif, .svg, .webp, .jfif"
            onChange={validarImg}
          />
        </Form.Group>

        {/* Descripcion */}
        <Form.Group className="mb-3 placeholder-blanco" controlId="form-grupo1">
          <Form.Label>Descripcion</Form.Label>
          <Form.Control
            style={styles}
            value={descripcion}
            type="text"
            autoFocus
            maxLength={700}
            name={
              regexDescripcion.test(descripcion) ? "descripcion" : undefined
            }
            autoComplete="off"
            as="textarea"
            rows={5}
            onChange={(e) => setDescripcion(e.target.value)}
            className={
              regexDescripcion.test(descripcion) ? "is-valid" : "is-invalid"
            }
          />
        </Form.Group>

        <br className="md-2" />

        {/* Boton de aceptar */}
        <div className="botones-formulario">
          <Button type="submit" className="bt-fmr">
            {props.producto ? "Actualizar producto" : "Crear producto"}
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default FormularioProducto;

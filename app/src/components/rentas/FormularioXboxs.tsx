import React, { Dispatch, useEffect, useState } from "react";
import Xbox from "../../models/Xbox";
import { Button, Form, Modal } from "react-bootstrap";
import { RespuestaApi } from "../../apis/apiVariables";
import { apiActualizarXbox, apiCrearNuevoXbox } from "../../apis/apiXboxs";
import ComponenteCargando from "../global/ComponenteCargando";
import { alertaSwal } from "../../functions/funcionesGlobales";

// * Estilos
const styles: React.CSSProperties = {
  backgroundColor: "var(--color-fondo)",
  color: "var(--color-letra)",
};

// * Props
interface Props {
  xbox?: Xbox;
  cerrarModal: Dispatch<void>;
  estadoModal: boolean;
  aumentarXbox?: (x: Xbox) => void;
  actualizarXbox?: (id: number, xboxActualizado: Xbox) => void;
}

// * ERS
const regexNombre: RegExp = /^(?!\s)([a-zA-ZñÑáéíóúÁÉÍÓÚ_-\s\d]{2,60})(?<!\s)$/;
const regexDescripcion: RegExp =
  /^([\w\d][\w\d\sZñÑáéíóúÁÉÍÓÚ.,:;!?+_*¡¿/()[\]{}-]{0,699})?$/;

// Todo, Formulario de xbox
const FormularioXboxs: React.FC<Props> = (props) => {
  // * Variables
  const [nombre, setNombre] = useState<string | null>(null);
  const [isCargando, setCargando] = useState<boolean>(false);
  const [estado, setEstado] = useState<"DISPONIBLE" | "NO DISPONIBLE">(
    "DISPONIBLE"
  );
  const [descripcion, setDescripcion] = useState<string | null>(null);

  // * Crear nuevo xbox
  const crearNuevoXbox = async (data: FormData): Promise<void> => {
    // Enviamos
    const res: RespuestaApi = await apiCrearNuevoXbox(data);

    // ? salio mal
    if (!res.estado) {
      throw new Error(
        res.detalles_error
          ? String(res.detalles_error)
          : "Ocurrió un error al crear el xbox, intenta mas tarde"
      );
    }

    // ? No se puede aumentar
    if (!props.aumentarXbox || !res.xbox) {
      alertaSwal(
        "Casi éxito!",
        "El xbox se creo correctamente pero no se vera reflejado el cambio asta que reinicie el programa",
        "warning"
      );
      return;
    }

    // * Terminamos
    props.aumentarXbox(res.xbox);
    alertaSwal("Éxito!", res.mensaje ?? "Xbox creado correctamente", "success");
    limpiar();
  };

  // * Actualizar nuevo xbox
  const actualizarElXbox = async (data: FormData): Promise<void> => {
    // ? No existe id
    if (!props.xbox?.id) {
      throw new Error("No se encontró el ID del xbox");
    }

    // Enviamos
    const res: RespuestaApi = await apiActualizarXbox(data, props.xbox.id);

    // ? salio mal
    if (!res.estado) {
      throw new Error(
        res.detalles_error
          ? String(res.detalles_error)
          : "Ocurrió un error al actualizar el xbox, intenta mas tarde"
      );
    }

    // ? No se puede aumentar
    if (!props.actualizarXbox || !res.xbox) {
      alertaSwal(
        "Casi éxito!",
        "El xbox se actualizo correctamente pero no se vera reflejado el cambio asta que reinicie el programa",
        "warning"
      );
      return;
    }

    // * Terminamos
    props.actualizarXbox(props.xbox.id, res.xbox);
    alertaSwal("Éxito!", "Xbox actualizado correctamente", "success");
  };

  // * Preparar data
  const prepararData = (): FormData => {
    // Creamos
    const formData: FormData = new FormData();

    // ? Existen cambios
    if (
      props.xbox &&
      nombre === props.xbox.nombre &&
      estado === props.xbox.estado &&
      descripcion === props.xbox.descripcion
    ) {
      throw new Error("Para actualizar tienes que cambiar al menos un dato");
    }

    // ? Nombre nulo
    if (!nombre || nombre === "") {
      throw new Error("El nombre no puede ser nulo");
    }

    // ? Estado nulo
    if (estado !== "NO DISPONIBLE" && estado !== "DISPONIBLE") {
      throw new Error("El estado seleccionado no existe");
    }

    // Agregar los datos a formData
    formData.append("nombre", nombre);
    formData.append("estado", estado);

    // ? Descripcion existe
    if (descripcion && descripcion?.length > 0) {
      formData.append("descripcion", descripcion);
    }

    return formData;
  };

  // * Limpiar
  const limpiar = (): void => {
    setNombre(null);
    setEstado("DISPONIBLE");
    setDescripcion(null);
  };

  // * Al cambiar
  useEffect(() => {
    setNombre(props.xbox ? props.xbox.nombre : null);
    setEstado(props.xbox ? props.xbox.estado : "DISPONIBLE");
    setDescripcion(props.xbox ? props.xbox.descripcion : null);
  }, [props]);

  // * Al aceptar
  const accionAceptar = async (): Promise<void> => {
    try {
      setCargando(true);

      // * Obtenemos data
      const data: FormData = prepararData();

      // ? Existe xbox
      if (props.xbox) {
        await actualizarElXbox(data);
        return;
      }

      // Creamos
      await crearNuevoXbox(data);

      // ! Error
    } catch (error: unknown) {
      alertaSwal("Error!", String(error), "error");
    } finally {
      setCargando(false);
    }
  };

  // * Al cerrar
  const accionAlCerrar = (): void => {
    limpiar();
    setCargando(false);
    props.cerrarModal();
  };

  // * Desbloquear boton
  const bloquearBoton = (): boolean => {
    // * lista de validaciones
    const listaValidaciones: boolean[] = [
      regexNombre.test(nombre ?? ""),
      estado === "DISPONIBLE" || estado === "NO DISPONIBLE",
      regexDescripcion.test(descripcion ?? ""),
    ];

    // Recorremos
    for (let i = 0; i < listaValidaciones.length; i++) {
      // ? Es falso
      if (!listaValidaciones[i]) {
        return true;
      }
    }

    return false;
  };

  return (
    <>
      {/* MODAL FORMULARIO */}
      <Modal show={props.estadoModal} onHide={accionAlCerrar}>
        {/* ENCABEZADO */}
        <Modal.Header
          closeButton
          style={{ ...styles, border: "none" }}
          closeVariant="white"
        >
          {/* Titulo */}
          <Modal.Title>
            {props.xbox
              ? `Actualizar ${props.xbox.nombre}`
              : " Crear nuevo xbox"}
          </Modal.Title>
        </Modal.Header>
        {/* CUERPO */}
        <Modal.Body style={styles}>
          {/* Formulario */}
          <Form>
            {/* Nombre */}
            <Form.Group className="mb-3" controlId="form-grupo1">
              <Form.Label>Nombre del xbox</Form.Label>
              <Form.Control
                style={styles}
                onChange={(e) => setNombre(e.target.value)}
                value={nombre ?? ""}
                type="text"
                autoFocus
                maxLength={60}
                autoComplete="off"
                className={
                  regexNombre.test(nombre ?? "") ? "is-valid" : "is-invalid"
                }
              />
            </Form.Group>

            {/* Estado */}
            <Form.Group className="mb-3" controlId="estado">
              <Form.Label>Estado del xbox</Form.Label>
              <Form.Select
                style={styles}
                className={
                  estado === "DISPONIBLE" || estado === "NO DISPONIBLE"
                    ? "is-valid"
                    : "is-invalid"
                }
                value={estado ?? "DISPONIBLE"}
                aria-label="Estado de xbox"
                onChange={(e) =>
                  setEstado(
                    e.target.value === "DISPONIBLE" ||
                      e.target.value === "NO DISPONIBLE"
                      ? e.target.value
                      : "DISPONIBLE"
                  )
                }
              >
                <option value="DISPONIBLE">DISPONIBLE</option>
                <option value="NO DISPONIBLE">NO DISPONIBLE</option>
              </Form.Select>
            </Form.Group>

            {/* Descripcion */}
            <Form.Group className="mb-3" controlId="descripcion">
              <Form.Label>Descripcion</Form.Label>
              <Form.Control
                style={styles}
                onChange={(e) => setDescripcion(e.target.value)}
                className={
                  regexDescripcion.test(descripcion ?? "")
                    ? "is-valid"
                    : "is-invalid"
                }
                value={descripcion ?? ""}
                as="textarea"
                maxLength={699}
                autoComplete="off"
                rows={4}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        {/* PIE */}
        <Modal.Footer style={{ ...styles, border: "none" }}>
          {/* Boton de cerrar */}
          <Button variant="danger" onClick={() => accionAlCerrar()}>
            Cerrar
          </Button>
          {/* Boton de guardar | actualizar */}
          <Button
            variant="success"
            disabled={bloquearBoton()}
            onClick={() => accionAceptar()}
          >
            {props.xbox ? "Actualizar" : " Guardar"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* MODAL CARGANDO */}
      <ComponenteCargando tipo={"spin"} estadoModal={isCargando} />
    </>
  );
};

export default FormularioXboxs;

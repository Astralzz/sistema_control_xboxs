import React, { Dispatch, useEffect, useState } from "react";
import Xbox from "../../models/Xbox";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import { RespuestaApi } from "../../apis/apiVariables";
import { apiCrearNuevoXbox } from "../../apis/apiXboxs";

// * Alerta
interface Alerta {
  estado: boolean;
  variante: "success" | "danger";
  mensaje: string;
}

// * Props
interface Props {
  xbox?: Xbox;
  cerrarModal: Dispatch<void>;
  estadoModal: boolean;
}

// * ERS
const regexNombre: RegExp = /^(?!\s)([a-zA-ZñÑáéíóúÁÉÍÓÚ_-\s\d]{2,60})(?<!\s)$/;
const regexDescripcion: RegExp =
  /^([\w\d][\w\d\sZñÑáéíóúÁÉÍÓÚ.,:;!?+_*¡¿/()[\]{}-]{0,699})?$/;

// Todo, Formulario de xbox
const FormularioXboxs: React.FC<Props> = (props) => {
  // * Variables
  const [nombre, setNombre] = useState<string | null>(null);
  const [estado, setEstado] = useState<"DISPONIBLE" | "NO DISPONIBLE">(
    "DISPONIBLE"
  );
  const [descripcion, setDescripcion] = useState<string | null>(null);
  const [alerta, setAlerta] = useState<Alerta>({
    estado: false,
    mensaje: "Mensaje por defecto",
    variante: "danger",
  });

  // * Crear nuevo xbox
  const crearNuevoXbox = async (data: FormData): Promise<void> => {
    // Enviamos
    const res: RespuestaApi = await apiCrearNuevoXbox(data);

    // ? salio mal
    if (!res.estado) {
      setAlerta({
        estado: true,
        mensaje: res.detalles_error
          ? String(res.detalles_error)
          : "Ocurrió un al crear xbox, intenta mas tarde",
        variante: "danger",
      });
    }

    setAlerta({
      estado: true,
      mensaje: res.mensaje ?? "Xbox guardado correctamente",
      variante: "success",
    });
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
      formData.append("descripcion", estado);
    }

    return formData;
  };

  // * Limpiar
  const limpiar = (): void => {
    setAlerta({
      estado: false,
      mensaje: "Mensaje por defecto",
      variante: "danger",
    });
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
      // * Obtenemos data
      const data: FormData = prepararData();

      console.log("Datos a enviar:");
      data.forEach((value, key) => {
        console.log(key + ": " + value);
      });

      // ? Existe xbox
      if (props.xbox) {
        setAlerta({
          estado: true,
          mensaje: "Xbox actualizado correctamente",
          variante: "success",
        });
        return;
      }

      // Creamos
      await crearNuevoXbox(data);

      // ! Error
    } catch (error: unknown) {
      setAlerta({ estado: true, mensaje: String(error), variante: "danger" });
    }
  };

  // * Al cerrar
  const accionAlCerrar = (): void => {
    limpiar();
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
    <Modal show={props.estadoModal} onHide={accionAlCerrar}>
      {/* ENCABEZADO */}
      <Modal.Header closeButton>
        {/* Titulo */}
        <Modal.Title>
          {props.xbox ? `Actualizar ${props.xbox.nombre}` : " Crear nuevo xbox"}
        </Modal.Title>
      </Modal.Header>
      {/* CUERPO */}
      <Modal.Body>
        {/* Alerta */}
        {alerta.estado && (
          <Alert variant={alerta.variante}>{alerta.mensaje}</Alert>
        )}

        {/* Formulario */}
        <Form>
          {/* Nombre */}
          <Form.Group className="mb-3" controlId="form-grupo1">
            <Form.Label>Nombre del xbox</Form.Label>
            <Form.Control
              onChange={(e) => setNombre(e.target.value)}
              value={nombre ?? ""}
              type="text"
              autoFocus
              maxLength={60}
            />
          </Form.Group>

          {/* Estado */}
          <Form.Group className="mb-3" controlId="estado">
            <Form.Label>Estado del xbox</Form.Label>
            <Form.Select
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
              onChange={(e) => setDescripcion(e.target.value)}
              value={descripcion ?? ""}
              as="textarea"
              maxLength={699}
              rows={4}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        {/* Boton de cerrar */}
        <Button variant="secondary" onClick={() => accionAlCerrar()}>
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
  );
};

export default FormularioXboxs;

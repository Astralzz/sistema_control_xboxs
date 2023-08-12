import React, { Dispatch, useState } from "react";
import {
  Button,
  Col,
  Form,
  FormGroup,
  ListGroup,
  Modal,
  Row,
  Stack,
} from "react-bootstrap";
import Renta from "../../models/Renta";
import {
  alertaSwal,
  confirmacionSwal,
  formatearFechaConDias,
  formatearHoraSinSegundos,
} from "../../functions/funcionesGlobales";
import IconoBootstrap from "../oters/IconoBootstrap";
import { RespuestaApi } from "../../apis/apiVariables";
import { apiActualizarRenta, apiEliminarRenta } from "../../apis/apiRentas";

// * Estilos
const styles: React.CSSProperties = {
  backgroundColor: "var(--color-fondo)",
  color: "var(--color-letra)",
  border: "none",
};

// * ERS
const regexTotal: RegExp = /^(?:\d{1,5}(?:\.\d{1,2})?|\.\d{1,2})$/;
const regexCliente: RegExp =
  /^(?!\s)([a-zA-ZñÑáéíóúÁÉÍÓÚ_-\s\d]{0,60})(?<!\s)$/;
const regexComentario: RegExp =
  /^([\w\d][\w\d\sZñÑáéíóúÁÉÍÓÚ.,:;!?+_*¡¿/()[\]{}-]{0,360})?$/;

// * Props
interface Props {
  renta: Renta | null;
  cerrarModal: Dispatch<void>;
  estadoModal: boolean;
  setCargando: Dispatch<boolean>;
  actualizarRentaLocal: (id: number, rentaActualizada: Renta) => void;
  eliminarRentaLocal: (id: number) => void;
}

// Todo, Modal de renta
const InfModalRenta: React.FC<Props> = (props) => {
  // * Variables
  const [isEditar, setEditar] = useState<boolean>(false);
  const [isPagado, setPagado] = useState<boolean>(props.renta?.isPagado === 1);
  const [cliente, setCliente] = useState<string>(props.renta?.cliente ?? "");
  const [total, setTotal] = useState<string>(String(props.renta?.total ?? "0"));
  const [comentario, setComentario] = useState<string>(
    props.renta?.comentario ?? ""
  );

  // * Actualizar
  const actualizarRenta = async (): Promise<void> => {
    try {
      // Cargando
      props.setCargando(true);

      const preTotal = props.renta?.total ?? "0";
      const preCliente = props.renta?.cliente ?? "";
      const preComentario = props.renta?.comentario ?? "";
      const preIsPagado = props.renta?.isPagado === 1;

      // ? No se cambio nada
      if (
        total === preTotal &&
        cliente === preCliente &&
        comentario === preComentario &&
        isPagado === preIsPagado
      ) {
        throw new Error("Debes de cambiar al menos un dato");
      }

      // Creamos data
      const data: FormData = new FormData();

      // Agregamos los datos a la data
      data.append("id_xbox", String(props.renta?.id_xbox ?? -1));
      data.append("fecha", props.renta?.fecha ?? "N/A");
      data.append("inicio", props.renta?.inicio ?? "N/A");
      data.append("final", props.renta?.final ?? "N/A");
      data.append("duracion", String(props.renta?.duracion));
      data.append("total", String(total ?? "0"));

      // ? Esta pagado
      data.append("isPagado", String(isPagado ? 1 : 0));

      // ? Cliente valido
      data.append(
        "cliente",
        cliente && regexCliente.test(cliente) ? cliente : ""
      );

      // ? Comentario
      data.append(
        "comentario",
        comentario && regexComentario.test(comentario) ? comentario : ""
      );

      console.log("Datos a enviar:");
      data.forEach((value, key) => {
        console.log(key + ": " + value);
      });

      // Enviamos
      const res: RespuestaApi = await apiActualizarRenta(
        data,
        props.renta?.id ?? -1
      );

      // ? salio mal
      if (!res.estado) {
        // ! Error
        throw new Error(
          res.detalles_error
            ? String(res.detalles_error)
            : "Ocurrió un error al actualizar la renta, intenta mas tarde"
        );
      }

      // ? No se puede aumentar
      if (!props.actualizarRentaLocal || !res.renta) {
        alertaSwal(
          "Casi éxito!",
          "La renta se actualizo correctamente pero no se vera reflejado el cambio asta que recargué la tabla",
          "warning"
        );
        return;
      }

      // * Terminamos
      props.actualizarRentaLocal(props.renta?.id ?? -1, res.renta);
      alertaSwal("Éxito!", "Renta actualizada correctamente", "success");

      // ! Error
    } catch (error: unknown) {
      alertaSwal("Error!", String(error), "error");
    } finally {
      props.setCargando(false);
    }
  };

  // * Eliminar
  const eliminarRenta = async (): Promise<void> => {
    try {
      // Confirmacion
      const isEliminar = await confirmacionSwal(
        "Estas seguro?",
        "Si eliminas este registro ya no podrás restaurar sus datos!",
        "Si, eliminar renta"
      );

      // ? Si
      if (isEliminar) {
        // Cargando
        props.setCargando(true);

        // Obtenemos id
        const idRenta: number = props.renta?.id ?? -1;

        // Enviamos
        const res: RespuestaApi = await apiEliminarRenta(idRenta);

        // ? salio mal
        if (!res.estado) {
          throw new Error(
            res.detalles_error
              ? String(res.detalles_error)
              : "Ocurrió un error al eliminar la renta, intenta mas tarde"
          );
        }

        // * Éxito
        alertaSwal(
          "Éxito!",
          res.mensaje ?? "renta eliminada correctamente",
          "success"
        );
        props.eliminarRentaLocal(idRenta);
        accionAlCerrar();
      }
    } catch (error) {
      alertaSwal("Error!", String(error), "error");
    } finally {
      props.setCargando(false);
    }
  };

  // * Al cerrar
  const accionAlCerrar = (): void => {
    // limpiar();
    // setCargando(false);
    props.cerrarModal();
    setEditar(false);
  };

  // * Restableces
  const restablecerDatos = (): void => {
    setCliente(props.renta?.cliente ?? "");
    setComentario(props.renta?.comentario ?? "");
    setPagado(props.renta?.isPagado === 1);
    setTotal(String(props.renta?.total ?? "0"));
  };

  // * Bloquear boton
  const bloquearBoton = (): boolean => {
    // * lista de validaciones
    const listaValidaciones: boolean[] = [
      regexCliente.test(cliente ?? ""),
      regexComentario.test(comentario ?? ""),
      regexTotal.test(total ?? ""),
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

  // Todo, Cuerpo Información
  const CuerpoInf = () => {
    return (
      <Row style={{ fontSize: 20 }}>
        {/* Lista derecha */}
        <Col xs={6}>
          <ListGroup>
            {/* Xbox */}
            <ListGroup.Item style={styles}>{`Xbox: ${
              props.renta?.xbox.nombre ?? "desconocido"
            }`}</ListGroup.Item>

            {/* Cliente */}
            <ListGroup.Item style={styles}>{`Cliente: ${
              props.renta?.cliente ?? "ninguno"
            }`}</ListGroup.Item>

            {/* Comentario */}
            <ListGroup.Item style={styles}>{`Comentario: ${
              props.renta?.comentario ?? "ninguno"
            }`}</ListGroup.Item>
          </ListGroup>
        </Col>
        {/* Lista izquierda */}
        <Col xs={6}>
          <ListGroup>
            {/* Inicio */}
            <ListGroup.Item style={styles}>{`Inicio:: ${
              props.renta?.inicio
                ? formatearHoraSinSegundos(props.renta?.inicio)
                : "N/A"
            }`}</ListGroup.Item>

            {/* Final */}
            <ListGroup.Item style={styles}>{`Final: ${
              props.renta?.final
                ? formatearHoraSinSegundos(props.renta?.final)
                : "N/A"
            }`}</ListGroup.Item>

            {/* Minutos */}
            <ListGroup.Item style={styles}>{`Minutos: ${
              props.renta?.duracion ?? "00:00"
            }`}</ListGroup.Item>

            {/* Controles */}
            <ListGroup.Item style={styles}>{`No. controles: ${
              props.renta?.noControles ?? "desconocido"
            }`}</ListGroup.Item>

            {/* Pagado */}
            <ListGroup.Item
              style={{
                ...styles,
                color:
                  props.renta?.isPagado === 1
                    ? "var(--color-aceptado)"
                    : "var(--color-no-aceptado)",
              }}
            >{`¿Pagado?: ${
              props.renta?.isPagado === 1 ? "SI" : "NO"
            }`}</ListGroup.Item>

            {/* Total */}
            <ListGroup.Item style={styles}>{`Precio: ${
              props.renta?.total ?? "0.00$"
            }`}</ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
    );
  };

  return (
    <Modal show={props.estadoModal} onHide={accionAlCerrar}>
      {/* ENCABEZADO */}
      <Modal.Header style={styles} closeVariant="white">
        <Stack direction="horizontal" gap={5}>
          {/* Titulo */}
          <div className="p-2">
            <Modal.Title>{`${
              props.renta && props.renta.fecha
                ? formatearFechaConDias(props.renta.fecha)
                : "???"
            }`}</Modal.Title>
          </div>
        </Stack>
        {/* Editar */}
        <div className="p-2 ms-auto">
          <IconoBootstrap
            onClick={() => {
              restablecerDatos();
              setEditar(!isEditar);
            }}
            nombre={isEditar ? "EyeFill" : "PenFill"}
          />
        </div>
        {/* Eliminar */}
        <div className="p-2">
          <IconoBootstrap onClick={eliminarRenta} nombre={"Trash2Fill"} />
        </div>
        {/* Salir */}
        <div className="p-2">
          <IconoBootstrap onClick={accionAlCerrar} nombre={"XCircleFill"} />
        </div>
      </Modal.Header>
      {/* CUERPO */}
      <Modal.Body style={styles}>
        {!isEditar ? (
          <CuerpoInf />
        ) : (
          <Row>
            {/* Columna */}
            <Col xs={12}>
              <FormGroup>
                <Row>
                  {/* Pagado */}
                  <Col xs={6}>
                    <Form.Label style={styles}>{"¿Pagado?:"}</Form.Label>
                    <Form.Select
                      aria-label="Pago la renta"
                      value={isPagado ? 1 : 0}
                      onChange={(e) =>
                        setPagado(parseInt(e.target.value) === 1)
                      }
                      className={"is-valid"}
                      style={{ ...styles, borderBottom: "0.5px solid #ffffff" }}
                    >
                      <option value={1}>SI</option>
                      <option value={0}>NO</option>
                    </Form.Select>
                  </Col>
                  {/* Total */}
                  <Col xs={6}>
                    <Form.Label style={styles}>{"Total:"}</Form.Label>
                    <Form.Control
                      style={{
                        ...styles,
                        borderBottom: "0.5px solid #ffffff",
                      }}
                      onChange={(e) => setTotal(e.target.value)}
                      value={total ?? "0"}
                      type="number"
                      aria-label="total de renta"
                      maxLength={6}
                      className={
                        regexTotal.test(total ?? "") ? "is-valid" : "is-invalid"
                      }
                    />
                  </Col>
                </Row>
              </FormGroup>

              <br />

              {/* Cliente */}
              <FormGroup>
                <Form.Label style={styles}>{"Cliente:"}</Form.Label>
                <Form.Control
                  style={{ ...styles, borderBottom: "0.5px solid #ffffff" }}
                  onChange={(e) => setCliente(e.target.value)}
                  value={cliente ?? ""}
                  aria-label="Cliente de renta"
                  maxLength={60}
                  className={
                    regexCliente.test(cliente ?? "") ? "is-valid" : "is-invalid"
                  }
                />
              </FormGroup>

              <br />

              {/* Comentario */}
              <FormGroup>
                <Form.Label style={styles}>{"Comentario:"}</Form.Label>
                <Form.Control
                  style={{ ...styles, borderBottom: "0.5px solid #ffffff" }}
                  onChange={(e) => setComentario(e.target.value)}
                  value={comentario ?? ""}
                  aria-label="Comentario de renta"
                  as="textarea"
                  maxLength={699}
                  rows={3}
                  className={
                    regexComentario.test(comentario ?? "")
                      ? "is-valid"
                      : "is-invalid"
                  }
                />
              </FormGroup>
            </Col>
          </Row>
        )}
      </Modal.Body>
      {/* PIE */}
      <Modal.Footer style={styles}>
        {/* Cerrar */}
        <Button variant="danger" onClick={() => accionAlCerrar()}>
          Cerrar
        </Button>
        {/* Aceptar */}
        {!isEditar ? (
          <Button variant="success" onClick={accionAlCerrar}>
            Aceptar
          </Button>
        ) : (
          // Editar
          <Button
            variant="success"
            disabled={bloquearBoton()}
            onClick={() => actualizarRenta()}
          >
            Guardar
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default InfModalRenta;

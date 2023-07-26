import React, { Dispatch, useState } from "react";
import {
  Button,
  Col,
  Form,
  FormGroup,
  InputGroup,
  ListGroup,
  Modal,
  Row,
  Stack,
} from "react-bootstrap";
import Renta from "../../models/Renta";
import {
  formatearFechaConDias,
  formatearHoraSinSegundos,
} from "../../functions/funcionesGlobales";
import IconoBootstrap from "../global/IconoBootstrap";
import TimePicker from "react-time-picker";

// * Estilos
const styles: React.CSSProperties = {
  backgroundColor: "var(--color-fondo)",
  color: "var(--color-letra)",
  border: "none",
};

// * ERS
const regexCliente: RegExp =
  /^(?!\s)([a-zA-ZñÑáéíóúÁÉÍÓÚ_-\s\d]{0,60})(?<!\s)$/;
const regexComentario: RegExp =
  /^([\w\d][\w\d\sZñÑáéíóúÁÉÍÓÚ.,:;!?+_*¡¿/()[\]{}-]{0,360})?$/;

// * Props
interface Props {
  renta: Renta | null;
  cerrarModal: Dispatch<void>;
  estadoModal: boolean;
}

// Todo, Modal de renta
const InfModalRenta: React.FC<Props> = (props) => {
  // * Variables
  const [isEditar, setEditar] = useState<boolean>(false);
  const [isPagado, setPagado] = useState<boolean>(props.renta?.isPagado === 1);
  const [cliente, setCliente] = useState<string>(props.renta?.cliente ?? "");
  const [comentario, setComentario] = useState<string>(
    props.renta?.comentario ?? ""
  );

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
  };

  // * Cuerpo Información
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
      <Modal.Header closeButton style={styles} closeVariant="white">
        <Stack direction="horizontal" gap={5}>
          {/* Titulo */}
          <div className="p-2">
            <Modal.Title>{`${
              props.renta && props.renta.fecha
                ? formatearFechaConDias(props.renta.fecha)
                : "???"
            }`}</Modal.Title>
          </div>
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
        </Stack>
      </Modal.Header>
      {/* CUERPO */}
      <Modal.Body style={styles}>
        {!isEditar ? (
          <CuerpoInf />
        ) : (
          <Row>
            {/* Lista derecha */}
            <Col xs={12}>
              <FormGroup>
                <Form.Label style={styles}>{"¿Pagado?:"}</Form.Label>
                <Form.Select
                  aria-label="Pago la renta"
                  value={isPagado ? 1 : 0}
                  onChange={(e) => setPagado(parseInt(e.target.value) === 1)}
                  className={"is-valid"}
                >
                  <option value={1}>SI</option>
                  <option value={0}>NO</option>
                </Form.Select>
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
        {!isEditar ? (
          <Button variant="success" onClick={accionAlCerrar}>
            Aceptar
          </Button>
        ) : (
          <Button variant="success" disabled onClick={accionAlCerrar}>
            Guardar
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default InfModalRenta;

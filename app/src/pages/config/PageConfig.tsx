import React, { FormEvent, useState } from "react";
import { Button, Col, Form, Offcanvas, Row } from "react-bootstrap";
import { regexNumerosEnteros } from "../../functions/variables";
import { alertaSwal } from "../../functions/funcionesGlobales";
import { guardarCookie, obtenerCookie } from "../../functions/cookies";

// * Estilos
const styles: React.CSSProperties[] = [
  {
    backgroundColor: "transparent",
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
  estadoModal: boolean;
  cerrarModal: () => void;
}

// TODO, Pagina de los ventas
const PageConfig: React.FC<Props> = (props) => {
  // * Variables
  const [precioPorHora, setPrecioPorHora] = useState<string | null>(
    obtenerCookie("p60m") || "15"
  );
  const [precioPorHoraDosControles, setPrecioPorHoraDosControles] = useState<
    string | null
  >(obtenerCookie("p60m2c") || "21");

  const [precioPorMediaHora, setPrecioPorMediaHora] = useState<string | null>(
    obtenerCookie("p30m") || "9"
  );
  const [precioPorMediaHoraDosControles, setPrecioPorMediaHoraDosControles] =
    useState<string | null>(obtenerCookie("p30m2c") || "12");

  // * Guardar datos
  const guardarDatos = (event: FormEvent<HTMLFormElement>): void => {
    try {
      // Evitamos reinicio
      event.preventDefault();

      // ? Hora correcta
      if (precioPorHora && regexNumerosEnteros.test(precioPorHora)) {
        guardarCookie("p60m", precioPorHora);
      }

      // ? Media hora correcta
      if (precioPorMediaHora && regexNumerosEnteros.test(precioPorMediaHora)) {
        guardarCookie("p30m", precioPorMediaHora);
      }

      // ? 60 m 2 c correcto
      if (
        precioPorHoraDosControles &&
        regexNumerosEnteros.test(precioPorHoraDosControles)
      ) {
        guardarCookie("p60m2c", precioPorHoraDosControles);
      }

      // ? 30 m 2 c correcto
      if (
        precioPorMediaHoraDosControles &&
        regexNumerosEnteros.test(precioPorMediaHoraDosControles)
      ) {
        guardarCookie("p30m2c", precioPorMediaHoraDosControles);
      }

      alertaSwal("Éxito", "Los datos se guardaron correctamente", "success");
    } catch (error) {
      alertaSwal("Error al guardar", `${String(error)}`, "error");
    }
  };

  // * Bloquear boton
  const bloquearBoton = (): boolean => {
    // ? No valido
    if (!regexNumerosEnteros.test(precioPorMediaHora || "")) {
      return false;
    }

    // ? No valido
    if (!regexNumerosEnteros.test(precioPorHora || "")) {
      return false;
    }

    // ? No valido
    if (!regexNumerosEnteros.test(precioPorMediaHoraDosControles || "")) {
      return false;
    }

    // ? No valido
    if (!regexNumerosEnteros.test(precioPorHoraDosControles || "")) {
      return false;
    }

    return true;
  };

  // * Al cerrar
  const alCerrar = (): void => {
    // setCargando(false);
    props.cerrarModal();
  };

  // Todo, componente principal
  return (
    <Offcanvas show={props.estadoModal} onHide={alCerrar} placement="end">
      {/* ENCABEZADO */}
      <Offcanvas.Header
        className="modal-derecho"
        closeButton
        closeVariant="white"
      >
        {/* Titulo */}
        <Offcanvas.Title>Ajustes</Offcanvas.Title>
      </Offcanvas.Header>

      {/* PAGINA */}
      <Offcanvas.Body className="modal-derecho">
        <Form onSubmit={guardarDatos}>
          {/* 60 Minutos */}
          <Row className="mb-3">
            {/* 60 */}
            <Form.Group className="mb-3 placeholder-blanco" as={Col}>
              <Form.Label column>
                ¿Precio de renta por 60 minutos?:{" "}
                <strong style={{ color: "red" }}>*</strong>
              </Form.Label>
              <Form.Control
                style={styles[0]}
                onChange={(e) => setPrecioPorHora(e.target.value)}
                value={precioPorHora ?? ""}
                type="number"
                autoFocus
                maxLength={60}
                autoComplete="off"
                className={
                  precioPorHora && regexNumerosEnteros.test(precioPorHora)
                    ? "is-valid"
                    : "is-invalid"
                }
              />
            </Form.Group>
            {/* 2 Controles */}
            <Form.Group className="mb-3 placeholder-blanco" as={Col}>
              <Form.Label column>
                Con 2 controles: <strong style={{ color: "red" }}>*</strong>
              </Form.Label>
              <Form.Control
                style={styles[0]}
                onChange={(e) => setPrecioPorHoraDosControles(e.target.value)}
                value={precioPorHoraDosControles ?? ""}
                type="number"
                autoFocus
                maxLength={60}
                autoComplete="off"
                className={
                  precioPorHoraDosControles &&
                  regexNumerosEnteros.test(precioPorHoraDosControles)
                    ? "is-valid"
                    : "is-invalid"
                }
              />
            </Form.Group>
          </Row>

          {/* 30 Minutos */}
          <Row className="mb-3">
            {/* 30 */}
            <Form.Group className="mb-3 placeholder-blanco" as={Col}>
              <Form.Label column>
                ¿Precio de renta por 30 minutos?:{" "}
                <strong style={{ color: "red" }}>*</strong>
              </Form.Label>
              <Form.Control
                style={styles[0]}
                onChange={(e) => setPrecioPorMediaHora(e.target.value)}
                value={precioPorMediaHora ?? ""}
                type="number"
                autoFocus
                maxLength={60}
                autoComplete="off"
                className={
                  precioPorMediaHora &&
                  regexNumerosEnteros.test(precioPorMediaHora)
                    ? "is-valid"
                    : "is-invalid"
                }
              />
            </Form.Group>
            {/* 2 controles */}
            <Form.Group className="mb-3 placeholder-blanco" as={Col}>
              <Form.Label column>
                Con 2 controles: <strong style={{ color: "red" }}>*</strong>
              </Form.Label>
              <Form.Control
                style={styles[0]}
                onChange={(e) =>
                  setPrecioPorMediaHoraDosControles(e.target.value)
                }
                value={precioPorMediaHoraDosControles ?? ""}
                type="number"
                autoFocus
                maxLength={60}
                autoComplete="off"
                className={
                  precioPorMediaHoraDosControles &&
                  regexNumerosEnteros.test(precioPorMediaHoraDosControles)
                    ? "is-valid"
                    : "is-invalid"
                }
              />
            </Form.Group>
          </Row>

          {/* Boton de guardar */}
          <div className="botones-formulario">
            <Button
              type="submit"
              disabled={!bloquearBoton()}
              className="bt-fmr"
            >
              Guardar cambios
            </Button>
          </div>
        </Form>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default PageConfig;

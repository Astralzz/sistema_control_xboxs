import React, { Dispatch, useCallback, useEffect, useState } from "react";
import {
  Button,
  Container,
  Form,
  InputGroup,
  ListGroup,
  Offcanvas,
} from "react-bootstrap";
import ComponenteCargando from "../../components/oters/ComponenteCargando";
import { regexNumerosEnteros } from "../../functions/variables";
import { alertaSwal } from "../../functions/funcionesGlobales";
import { guardarCookie, obtenerCookie } from "../../functions/cookies";

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
  estadoModal: boolean;
  cerrarModal: () => void;
}

// TODO, Pagina de los ventas
const PageConfig: React.FC<Props> = (props) => {
  // * Variables
  const [isCargandoAccion, setCargandoAccion] = useState<boolean>(false);
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
  const guardarDatos = (): void => {
    try {
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
        {/* Lista de Ajustes */}
        <ListGroup>
          {/* Precio de hora */}
          <ListGroup.Item
            className="list-group-item d-flex p-1"
            style={{
              backgroundColor: "transparent",
              justifyContent: "flex-start",
              border: "none",
              color: "white",
            }}
          >
            <div className="mb-2">
              {/* Cliente */}
              <InputGroup className="mb-3">
                <InputGroup.Text style={styles[1]}>
                  ¿Precio de renta por 60 minutos?:
                </InputGroup.Text>
                <Form.Control
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
                  style={{ ...styles[0], width: 160 }}
                />
              </InputGroup>
              <InputGroup className="mb-3">
                {/* 2 controles */}
                <InputGroup.Text style={styles[1]}>
                  Con 2 controles:
                </InputGroup.Text>
                <Form.Control
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
                  style={{ ...styles[0], width: 160 }}
                />
              </InputGroup>
            </div>
          </ListGroup.Item>

          {/* Precio de media hora */}
          <ListGroup.Item
            className="list-group-item d-flex p-1"
            style={{
              backgroundColor: "transparent",
              justifyContent: "flex-start",
              border: "none",
              color: "white",
            }}
          >
            <div className="mb-2">
              <InputGroup className="mb-3">
                {/* 1 control */}
                <InputGroup.Text style={styles[1]}>
                  ¿Precio de renta por 30 minutos?:
                </InputGroup.Text>
                <Form.Control
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
                  style={{ ...styles[0], width: 160 }}
                />

                {/* 2 controles */}
                <InputGroup.Text style={styles[1]}>
                  Con 2 controles:
                </InputGroup.Text>
                <Form.Control
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
                  style={{ ...styles[0], width: 160 }}
                />
              </InputGroup>
            </div>
          </ListGroup.Item>

          {/* Boton de guardar */}
          <div
            className="botones-formulario"
            style={{
              marginLeft: 40,
              marginRight: 40,
            }}
          >
            <Button
              onClick={guardarDatos}
              disabled={!bloquearBoton()}
              className="bt-fmr"
            >
              Guardar cambios
            </Button>
          </div>
        </ListGroup>
      </Offcanvas.Body>

      {/* CARGANDO */}
      <ComponenteCargando tipo={"spin"} estadoModal={isCargandoAccion} />
    </Offcanvas>
  );
};

export default PageConfig;

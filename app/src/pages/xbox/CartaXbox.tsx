import React, { useState } from "react";
import {
  Button,
  Card,
  Row,
  Col,
  Toast,
  DropdownButton,
  Dropdown,
  ButtonGroup,
} from "react-bootstrap";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import Xbox from "../../models/Xbox";
import ModalXbox from "./ModalXbox";
import IconoBootstrap from "../../components/Global/IconoBootstrap";
import { formatearTiempo } from "../../functions/funcionesGlobales";
import Swal from "sweetalert2";

// * Seleccionar tiempos
interface SelectTiempo {
  leyenda: string;
  tiempo: number;
}

// * Tiempos establecidos
const selectsTiempo: SelectTiempo[] = [
  {
    leyenda: "15 minutos",
    tiempo: 15,
  },
  {
    leyenda: "media hora",
    tiempo: 30,
  },
  {
    leyenda: "una hora",
    tiempo: 60,
  },
  {
    leyenda: "una hora y media",
    tiempo: 90,
  },
  {
    leyenda: "2 horas",
    tiempo: 120,
  },
  {
    leyenda: "Otra cantidad",
    tiempo: 0,
  },
];

// * Props
interface Props {
  xbox: Xbox;
  eliminarXbox: (id: number) => void;
  actualizarXbox: (id: number, xboxActualizado: Xbox) => void;
}

// Todo, Carta de xbox
const CartaXbox: React.FC<Props> = (props) => {
  // * Variables
  const [tiempoSeleccionado, setTiempoSeleccionado] = useState<number>(-1);
  const [isTiempoCorriendo, setTiempoCorriendo] = useState<boolean>(false);
  const [tiempoRestante, setTiempoRestante] = useState<number>(0);
  const [isEstadoModal, setEstadoModal] = useState<boolean>(false);
  const [keyTemporizador, setKeyTemporizador] = useState<number>(0);
  const [tiempoTotal, setTiempoTotal] = useState<number>(0);

  // * Acciones modal
  const cerrarModal = () => setEstadoModal(false);
  const abrirModal = () => setEstadoModal(true);

  // * Iniciar temporizador
  const iniciarTemporizador = (): void => {
    setTiempoRestante(tiempoSeleccionado);
    setTiempoCorriendo(true);
  };

  // * Pausar temporizador
  const pausarTemporizador = (): void => setTiempoCorriendo(false);

  // * Al completar
  const alTerminar = (): void => {
    setTiempoCorriendo(false);
    setTiempoSeleccionado(-1);
    setTiempoRestante(0);
    setKeyTemporizador((prevKey) => prevKey + 1);
  };

  // * Aumentar tiempo
  const aumentarTiempo = (valor: number): void => {
    setTiempoTotal((prevTiempo) => prevTiempo + valor * 60);
    setTiempoRestante((prevTiempo) => prevTiempo + valor * 60);
  };

  // * Renderizar tiempo
  const renderizarTiempo = ({ remainingTime }: any) => {
    // ? Es menor a 1
    if (remainingTime < 1) {
      return <div>¡Tiempo terminado!</div>;
    }

    // * Tiempo restante
    const tiempoFormat: string = formatearTiempo(remainingTime);

    return (
      <div className="timer">
        <div className="text">Tiempo restante:</div>
        <div className="value">
          {tiempoFormat !== "0" ? tiempoFormat : "00:00"}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* TARJETA DE XBOX */}
      <Card>
        {/* ENCABEZADO DE LA TABLA */}
        <Card.Header className="d-flex align-items-center justify-content-between">
          {/* Titulo */}
          {props.xbox.nombre}

          {/* INFORMACIÓN */}
          <IconoBootstrap
            onClick={abrirModal}
            nombre="InfoCircle"
            color="white"
            size={20}
          />
        </Card.Header>

        {/* CUERPO DE LA CARTA */}
        <Card.Body>
          <Row>
            {/* IZQUIERDA */}
            <Col xs={6}>
              <Toast
                animation
                style={{ backgroundColor: "rgba(240, 240, 240, 0.2)" }}
              >
                {/* CUERPO */}
                <Toast.Body>
                  {props.xbox.estado !== "NO DISPONIBLE" ? (
                    <div className="d-flex justify-content-center h-100">
                      <CountdownCircleTimer
                        rotation="clockwise"
                        key={keyTemporizador}
                        isPlaying={isTiempoCorriendo}
                        duration={tiempoRestante}
                        colors={["#3C9B2C", "#FAB200", "#F2961C", "#A30000"]}
                        colorsTime={[tiempoSeleccionado, 5, 2, 0]}
                        onComplete={alTerminar}
                      >
                        {renderizarTiempo}
                      </CountdownCircleTimer>
                    </div>
                  ) : (
                    // No disponible
                    <div className="d-flex flex-column justify-content-center h-100">
                      <br />
                      <br />
                      <br />
                      <h4>XBOX NO DISPONIBLE</h4>
                      <br />
                      <br />
                      <br />
                    </div>
                  )}
                </Toast.Body>
              </Toast>
            </Col>
            {/* DERECHA */}
            <Col xs={6}>
              {/* -------- CUERPO */}
              <div className="d-flex flex-column">
                <h5>
                  {"Tiempo total: " +
                    (tiempoTotal > 0
                      ? formatearTiempo(tiempoTotal)
                      : "ninguno")}
                </h5>
                <br />
                {/* -------- SELECCIONAR */}
                <div className="d-flex flex-row justify-content-between">
                  {/* Tiempo inicial */}
                  <div className="mb-2">
                    <DropdownButton
                      align="start"
                      title="Seleccionar tiempo"
                      variant={
                        isTiempoCorriendo ||
                        props.xbox.estado === "NO DISPONIBLE"
                          ? "danger"
                          : "success"
                      }
                      disabled={
                        isTiempoCorriendo ||
                        props.xbox.estado === "NO DISPONIBLE"
                      }
                      onSelect={(e) => {
                        setTiempoTotal(Number(e) * 60);
                        setTiempoSeleccionado(Number(e) * 60);
                      }}
                      key={-1}
                    >
                      {selectsTiempo.map((select, i) => {
                        return (
                          <Dropdown.Item key={i} eventKey={select.tiempo}>
                            {select.leyenda}
                          </Dropdown.Item>
                        );
                      })}
                    </DropdownButton>
                  </div>

                  {/* Aumentar tiempo */}
                  <div className="mb-2">
                    <DropdownButton
                      align="end"
                      title="Aumentar"
                      variant={
                        !isTiempoCorriendo ||
                        props.xbox.estado === "NO DISPONIBLE"
                          ? "danger"
                          : "success"
                      }
                      disabled={
                        !isTiempoCorriendo ||
                        props.xbox.estado === "NO DISPONIBLE"
                      }
                      onSelect={(e) => {
                        if (Number(e) < 1 && tiempoRestante < 1) {
                          return;
                        }
                        aumentarTiempo(Number(e));
                      }}
                      id="-1"
                    >
                      {selectsTiempo.map((select, i) => {
                        return (
                          <Dropdown.Item key={i} eventKey={select.tiempo}>
                            {select.leyenda}
                          </Dropdown.Item>
                        );
                      })}
                    </DropdownButton>
                  </div>
                </div>

                {/* -------- BOTONES */}
                <ButtonGroup aria-label="Grupo-botones" className="mb-2">
                  {/* -------- Iniciar */}
                  <Button
                    disabled={
                      isTiempoCorriendo ||
                      tiempoSeleccionado < 0 ||
                      props.xbox.estado === "NO DISPONIBLE"
                    }
                    onClick={iniciarTemporizador}
                    variant={
                      isTiempoCorriendo ||
                      tiempoSeleccionado < 0 ||
                      props.xbox.estado === "NO DISPONIBLE"
                        ? "danger"
                        : "success"
                    }
                  >
                    {props.xbox.estado !== "NO DISPONIBLE"
                      ? "Iniciar"
                      : "No disponible"}
                  </Button>
                  {/* -------- Pausar */}
                  <Button
                    variant={
                      !isTiempoCorriendo ||
                      tiempoSeleccionado < 0 ||
                      props.xbox.estado === "NO DISPONIBLE"
                        ? "danger"
                        : "success"
                    }
                    disabled={
                      !isTiempoCorriendo ||
                      tiempoSeleccionado < 0 ||
                      props.xbox.estado === "NO DISPONIBLE"
                    }
                    onClick={pausarTemporizador}
                  >
                    Pausar
                  </Button>
                  {/* -------- Terminar */}
                  <Button
                    disabled={
                      !isTiempoCorriendo ||
                      props.xbox.estado === "NO DISPONIBLE"
                    }
                    variant={
                      !isTiempoCorriendo ||
                      tiempoSeleccionado < 0 ||
                      props.xbox.estado === "NO DISPONIBLE"
                        ? "danger"
                        : "success"
                    }
                    onClick={() => {
                      // Alerta
                      Swal.fire({
                        title: "¿Seguro?",
                        text: "Quieres terminar este temporizador!",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#53AB28",
                        cancelButtonColor: "#d33",
                        confirmButtonText: "Si, terminar",
                        cancelButtonText: "Cancelar",
                      }).then((result) => {
                        // ? Dijo que si
                        if (result.isConfirmed) {
                          // Terminamos
                          alTerminar();
                        }
                      });
                    }}
                  >
                    Terminar
                  </Button>
                </ButtonGroup>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      {/* CANVAS DE INFORMACIÓN */}
      <ModalXbox
        xbox={props.xbox}
        cerrarModal={cerrarModal}
        estadoModal={isEstadoModal}
        eliminarXbox={props.eliminarXbox}
      />
    </>
  );
};

export default CartaXbox;

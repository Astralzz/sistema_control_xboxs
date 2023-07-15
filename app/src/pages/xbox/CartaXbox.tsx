import React, { useState } from "react";
import { Button, Card, Row, Col, Form, Toast } from "react-bootstrap";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import Xbox from "../../models/Xbox";
import ModalXbox from "./ModalXbox";
import IconoBootstrap from "../../components/IconoBootstrap";

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

// Todo, Carta de xbox
const CartaXbox: React.FC<Xbox> = (xbox) => {
  // * Variables
  const [tiempoSeleccionado, setTiempoSeleccionado] = useState<number>(-1);
  const [isTiempoCorriendo, setTiempoCorriendo] = useState<boolean>(false);
  const [tiempoRestante, setTiempoRestante] = useState<number>(0);
  const [isEstadoModal, setEstadoModal] = useState<boolean>(false);
  const [key, setKey] = useState<number>(0);

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
    setKey((prevKey) => prevKey + 1);
  };

  // * Aumentar tiempo
  const aumentarTiempo = (valor: number): void => {
    setTiempoRestante((prevTiempo) => prevTiempo + valor * 60);
  };

  // * Renderizar tiempo
  const renderizarTiempo = ({ remainingTime }: any) => {
    // ? Es menor a 1
    if (remainingTime < 1) {
      return <div>¡Tiempo terminado!</div>;
    }

    // * Tiempo restante
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;
    const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;

    return (
      <div className="timer">
        <div className="text">Tiempo restante:</div>
        <div className="value">
          {remainingTime > 0 ? formattedTime : "00:00"}
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
          {xbox.nombre}

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
            <Col xs={6}>
              <Toast
                animation
                style={{ backgroundColor: "rgba(240, 240, 240, 0.2)" }}
              >
                <Toast.Body>
                  <div className="d-flex flex-column">
                    {/* -------- TEMPORIZADOR */}
                    <div className="mb-4 d-flex justify-content-center">
                      <CountdownCircleTimer
                        key={key}
                        isPlaying={isTiempoCorriendo}
                        duration={tiempoRestante}
                        colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
                        colorsTime={[7, 5, 2, 0]}
                        onComplete={alTerminar}
                      >
                        {renderizarTiempo}
                      </CountdownCircleTimer>
                    </div>
                    <div className="mb-2">
                      <Button
                        disabled={isTiempoCorriendo || tiempoSeleccionado < 0}
                        onClick={iniciarTemporizador}
                      >
                        Iniciar
                      </Button>
                    </div>
                  </div>
                </Toast.Body>
              </Toast>
            </Col>
            <Col xs={6}>
              {/* -------- BOTONES */}
              <div className="d-flex flex-column">
                <br />
                {/* -------- SELECCIONAR TIEMPO */}
                <Form.Select
                  onChange={(e) =>
                    setTiempoSeleccionado(Number(e.target.value) * 60)
                  }
                  aria-label="seleccionar tiempo"
                  className={
                    "mb-2 " + (isTiempoCorriendo ? " bg-danger text-white" : "")
                  }
                  disabled={isTiempoCorriendo}
                  value={tiempoSeleccionado < 0 ? tiempoSeleccionado / 60 : -1}
                >
                  <option value={-1}>Seleccionar tiempo</option>
                  {selectsTiempo.map((select, i) => {
                    return (
                      <option key={i} value={select.tiempo}>
                        {select.leyenda}
                      </option>
                    );
                  })}
                </Form.Select>
                {/* -------- INICIAR TEMPORIZADOR */}
                <Button
                  className="mb-2"
                  disabled={isTiempoCorriendo || tiempoSeleccionado < 0}
                  onClick={iniciarTemporizador}
                  variant={
                    isTiempoCorriendo || tiempoSeleccionado < 0
                      ? "danger"
                      : "success"
                  }
                >
                  Iniciar
                </Button>
                {/* -------- PAUSAR TEMPORIZADOR */}
                <Button
                  className="mb-2"
                  disabled={!isTiempoCorriendo}
                  onClick={pausarTemporizador}
                >
                  Pausar
                </Button>
                {/* -------- AUMENTAR TIEMPO */}
                <Form.Select
                  onChange={(e) => {
                    if (Number(e.target.value) < 1 && tiempoRestante < 1) {
                      return;
                    }
                    aumentarTiempo(Number(e.target.value));
                  }}
                  aria-label="aumentar tiempo"
                  className="mb-2"
                  disabled={!isTiempoCorriendo}
                  value={-1}
                >
                  <option value={-1}>Aumentar tiempo</option>
                  {selectsTiempo.map((select, i) => {
                    return (
                      <option key={i} value={select.tiempo}>
                        {select.leyenda}
                      </option>
                    );
                  })}
                </Form.Select>
                {/* -------- TERMINAR TEMPORIZADOR */}
                <Button
                  className="mb-2"
                  disabled={!isTiempoCorriendo}
                  onClick={alTerminar}
                >
                  Terminar
                </Button>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      {/* CANVAS DE INFORMACIÓN */}
      <ModalXbox xbox={xbox} acción={cerrarModal} estado={isEstadoModal} />
    </>
  );
};

export default CartaXbox;

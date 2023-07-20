import React, { useRef, useState } from "react";
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
import {
  alertaSwal,
  calcularMontoRecaudado,
  confirmacionSwal,
  fechaHoraActual,
  formatearTiempo,
  seleccionarTiempoManual,
} from "../../functions/funcionesGlobales";
import { apiActualizarRenta, apiCrearNuevaRenta } from "../../apis/apiRentas";
import { RespuestaApi } from "../../apis/apiVariables";
import Renta from "../../models/Renta";
import ComponenteCargando from "../../components/Global/ComponenteCargando";

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
    tiempo: -1,
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
  const [rentaActual, setRentaActual] = useState<null | Renta>(null);
  const [isCargando, setCargando] = useState<boolean>(false);
  const [recaudado, setRecaudado] = useState<number>(0);

  // * Restante bandera
  let restanteBandera: number = 0;
  let banderRecaudado: boolean = true;
  let timeRecaudadoBandera: NodeJS.Timeout;

  // * Acciones modal
  const cerrarModal = () => setEstadoModal(false);
  const abrirModal = () => setEstadoModal(true);

  // * Crear nueva renta
  const crearNuevaRenta = async (data: FormData): Promise<void> => {
    // Enviamos
    const res: RespuestaApi = await apiCrearNuevaRenta(data);

    // ? salio mal
    if (!res.estado) {
      // ! Error
      throw new Error(
        res.detalles_error
          ? String(res.detalles_error)
          : "Ocurrió un error al crear la renta, intenta mas tarde"
      );
    }

    // ? No llego la renta
    if (!res.renta) {
      alertaSwal(
        "Alerta!",
        "La renta se creo correctamente pero esta no retorno, la hora de terminación no se vera reflejada",
        "warning"
      );
      return;
    }

    // Ponemos renta actual
    setRentaActual(res.renta);
  };
  // * Actualizar renta
  const actualizarRenta = async (data: FormData): Promise<void> => {
    // Enviamos
    const res: RespuestaApi = await apiActualizarRenta(
      data,
      rentaActual?.id ?? -1
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
  };

  // * Iniciar temporizador
  const iniciarTemporizador = async (): Promise<void> => {
    try {
      // Cargando
      setCargando(true);

      // Creamos data
      const data: FormData = new FormData();

      // Fecha hora
      const { fecha, hora } = fechaHoraActual();

      // Agregamos los datos a la data
      data.append("id_xbox", String(props.xbox.id ?? -1));
      data.append("fecha", fecha);
      data.append("inicio", hora);

      console.log("Datos a enviar:");
      data.forEach((value, key) => {
        console.log(key + ": " + value);
      });

      // Creamos
      await crearNuevaRenta(data);

      // Iniciamos conteos
      setTiempoRestante(tiempoSeleccionado);
      setTiempoCorriendo(true);

      // ! Error
    } catch (error: unknown) {
      alertaSwal("Error!", String(error), "error");
    } finally {
      setCargando(false);
    }
  };

  // * Terminar temporizador
  const terminarTemporizador = async (): Promise<void> => {
    try {
      // Cargando
      setCargando(true);

      // Creamos data
      const data: FormData = new FormData();
      // Fecha hora
      const { fecha: fechaInicio, hora: horaInicio } = fechaHoraActual();
      const { fecha: fechaFinal, hora: horaFinal } = fechaHoraActual();
      // Recaudado
      const recaudado: number = calcularMontoRecaudado(tiempoTotal);

      // Agregamos los datos a la data
      data.append(
        "id_xbox",
        String(rentaActual?.id_xbox ?? props.xbox.id ?? -1)
      );
      data.append("fecha", rentaActual?.fecha ?? fechaInicio);
      data.append("inicio", rentaActual?.inicio ?? horaInicio);
      data.append("final", horaFinal);
      data.append("duracion", String(tiempoTotal / 60));
      data.append("total", String(recaudado));

      console.log("Datos a enviar:");
      data.forEach((value, key) => {
        console.log(key + ": " + value);
      });

      // Creamos
      await actualizarRenta(data);

      // ! Error
    } catch (error: unknown) {
      alertaSwal("Error!", String(error), "error");
    } finally {
      // Detenemos conteos
      setRecaudado(calcularMontoRecaudado(tiempoTotal));
      setRentaActual(null);
      setTiempoCorriendo(false);
      setTiempoSeleccionado(-1);
      setTiempoRestante(0);
      setKeyTemporizador((prevKey) => prevKey + 1);
      restanteBandera = 0;
      setCargando(false);
    }
  };

  // * Continuar temporizador
  const continuarTemporizador = (): void => setTiempoCorriendo(true);

  // * Pausar temporizador
  const pausarTemporizador = (): void => setTiempoCorriendo(false);

  // * Aumentar tiempo
  const aumentarTiempo = (valor: number): void => {
    setTiempoTotal((prevTiempo) => prevTiempo + valor * 60);
    setTiempoRestante((prevTiempo) => prevTiempo + valor * 60);
  };

  // * Disminuir tiempo
  const disminuirTiempo = (valor: number): void => {
    // ? Es mayor al restante
    if (valor * 60 >= restanteBandera) {
      alertaSwal(
        "Error!",
        "El numero proporcionado no puede ser mayor al tiempo restante",
        "error"
      );
      return;
    }

    // Convertimos a negativo * 60
    const valorNegativo: number = valor * -1 * 60;

    // Ponemos
    setTiempoTotal((prevTiempo) => prevTiempo + valorNegativo);
    setTiempoRestante((prevTiempo) => prevTiempo + valorNegativo);
  };

  // * Renderizar tiempo
  const renderizarTiempo = ({ remainingTime }: any) => {
    // ? Es menor a 1
    if (remainingTime < 1) {
      return (
        <div>
          <h4>¡Tiempo terminado!</h4>
        </div>
      );
    }

    // TR / transcurrido
    const tr = tiempoRestante - remainingTime;

    // Tiempo restante
    const restante: string = formatearTiempo(remainingTime);
    // Tiempo transcurrido
    const trascurrido: string = formatearTiempo(tr);

    // ? es base 10
    if (tr % 5 === 0 && banderRecaudado) {
      // Ponemos false
      banderRecaudado = false;

      // Destruimos el time
      clearTimeout(timeRecaudadoBandera);

      // Accion en 2 s
      timeRecaudadoBandera = setTimeout(() => {
        // Recaudado
        const r: number = calcularMontoRecaudado(tr);
        // Ponemos valor
        setRecaudado(r);
        banderRecaudado = true;
      }, 2000);
    }

    //  Restante bandera
    restanteBandera = remainingTime;

    return (
      <div className="timer">
        <h2>{restante}</h2>
        <h2>{trascurrido}</h2>
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
            <Col xs={5}>
              <Toast
                animation
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  boxShadow: "none",
                }}
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
                        onComplete={(): void => {
                          terminarTemporizador();
                        }}
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
            <Col xs={7}>
              {/* -------- CUERPO */}
              <div className="d-flex flex-column">
                {/* Tiempo total escogido */}
                <h5>
                  {`Tiempo total: ${
                    tiempoTotal > 0 ? formatearTiempo(tiempoTotal) : "ninguno"
                  } | recaudado: ${recaudado} $`}
                </h5>
                <br />
                {/* -------- SELECCIONAR */}
                <div className="d-flex flex-row justify-content-between">
                  {/* Tiempo inicial */}
                  <div className="mb-2">
                    <DropdownButton
                      align="start"
                      title="Seleccionar"
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
                      onSelect={async (e) => {
                        // Convertimos
                        const en: number = Number(e);

                        // ? Menor a 1
                        if (Number(en) < 1) {
                          // Alerta
                          const n: number = await seleccionarTiempoManual(
                            "seleccionado"
                          );

                          // ? Es negativo
                          if (n < 1) {
                            return;
                          }

                          setTiempoTotal(n * 60);
                          setTiempoSeleccionado(n * 60);
                          return;
                        }

                        setTiempoTotal(en * 60);
                        setTiempoSeleccionado(en * 60);
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
                      onSelect={async (e) => {
                        // ? Menor a 1
                        if (tiempoRestante < 1) {
                          return;
                        }

                        // Convertimos
                        const en: number = Number(e);

                        // ? Menor a 1
                        if (en < 1) {
                          // Alerta
                          const n: number = await seleccionarTiempoManual(
                            "aumentado"
                          );

                          // ? Es negativo
                          if (n < 1) {
                            return;
                          }

                          aumentarTiempo(n);
                          return;
                        }

                        aumentarTiempo(en);
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

                  {/* Disminuir tiempo */}
                  <div className="mb-2">
                    <DropdownButton
                      align="end"
                      title="disminuir"
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
                      onSelect={async (e) => {
                        // ? Menor a 1
                        if (tiempoRestante < 1) {
                          return;
                        }

                        // Convertimos
                        const en: number = Number(e);

                        // ? Menor a 1
                        if (en < 1) {
                          // Alerta
                          const n: number = await seleccionarTiempoManual(
                            "disminuido"
                          );

                          // ? Es negativo
                          if (n < 1) {
                            return;
                          }

                          // Disminuimos
                          disminuirTiempo(n);
                          return;
                        }

                        disminuirTiempo(en);
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
                    onClick={() => {
                      // ? Es menor a 1
                      if (tiempoRestante > 1) {
                        continuarTemporizador();
                        return;
                      }

                      iniciarTemporizador();
                    }}
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
                    onClick={async () => {
                      // Confirmacion
                      const res = await confirmacionSwal(
                        "Estas seguro?",
                        "Quieres terminar este temporizador!",
                        "Si, terminar"
                      );

                      // ? Si
                      if (res) {
                        terminarTemporizador();
                      }
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
        actualizarXbox={(id: number, xbox: Xbox) => {
          terminarTemporizador();
          props.actualizarXbox(id, xbox);
        }}
      />
      {/* MODAL CARGANDO */}
      <ComponenteCargando tipo={"spin"} estadoModal={isCargando} />
    </>
  );
};

export default CartaXbox;

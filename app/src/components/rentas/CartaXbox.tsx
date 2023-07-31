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
  Form,
  InputGroup,
  OverlayTrigger,
  Popover,
  Image,
} from "react-bootstrap";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import Xbox from "../../models/Xbox";
import ModalXbox from "./ModalXbox";
import IconoBootstrap from "../global/IconoBootstrap";
import {
  alertaSwal,
  calcularMontoRecaudado,
  confirmacionSwal,
  fechaHoraActual,
  formatearTiempo,
  redondearNumero,
  seleccionarTiempoManual,
} from "../../functions/funcionesGlobales";
import { apiActualizarRenta, apiCrearNuevaRenta } from "../../apis/apiRentas";
import { RespuestaApi } from "../../apis/apiVariables";
import Renta from "../../models/Renta";
import ComponenteCargando from "../global/ComponenteCargando";
import { OverlayChildren } from "react-bootstrap/esm/Overlay";
import { detenerAlarma, reproducirAlarma } from "../../functions/alarma";
import iconoAlarma from "../../assets/imgs/iconoAlarma.png";

// * Seleccionar tiempos
interface SelectTiempo {
  leyenda: string;
  tiempo: number;
}

// * Tiempos establecidos
const selectsTiempo: SelectTiempo[] = [
  {
    leyenda: "Ninguno",
    tiempo: 0,
  },
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

// * ERS
const regexCliente: RegExp =
  /^(?!\s)([a-zA-ZñÑáéíóúÁÉÍÓÚ_-\s\d]{2,60})(?<!\s)$/;
const regexComentario: RegExp =
  /^([\w\d][\w\d\sZñÑáéíóúÁÉÍÓÚ.,:;!?+_*¡¿/()[\]{}-]{0,360})?$/;

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
  const [rentaActual, setRentaActual] = useState<null | Renta>(null);
  const [isCargando, setCargando] = useState<boolean>(false);
  const [idAlarma, setIdAlarma] = useState<string | null>(null);
  // * Datos de la BD
  const [isPagado, setPagado] = useState<boolean>(false);
  const [controlesExtra, setControlesExtra] = useState<boolean>(false);
  const [tiempoTotal, setTiempoTotal] = useState<number>(0);
  const [cliente, setCliente] = useState<string | null>(null);
  const [comentario, setComentario] = useState<string | null>(null);
  const [recaudado, setRecaudado] = useState<number>(0);

  // * Restante bandera
  let restanteBandera: number = 0;
  let recaudadoBandera: number = 0;
  let tiempoTotalBandera: number = 0;
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

  // * Seleccionar tiempo inicial
  const seleccionarTiempoInicial = async (e: string | null): Promise<void> => {
    // ?  nulo
    if (!e) {
      alertaSwal("ERROR!", "Ocurrió un error inesperado", "error");
      return;
    }

    // Convertimos
    const en: number = Number(e);

    // ? es 0
    if (en === 0) {
      setTiempoTotal(0);
      setTiempoSeleccionado(-1);
      return;
    }

    // ? Menor a 0
    if (en < 0) {
      // Alerta
      const n: number = await seleccionarTiempoManual("seleccionado");

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
  const terminarTemporizador = async (
    isAlarma: boolean = true
  ): Promise<void> => {
    try {
      // Cargando
      setCargando(true);

      // ? Sonar alarma
      if (isAlarma && idAlarma === null) {
        // Creamos alarma
        const id: string = reproducirAlarma();
        setIdAlarma(id);
      } else {
        setIdAlarma(null);
      }

      // Creamos data
      const data: FormData = new FormData();
      // Fecha hora
      const { fecha: fechaInicio, hora: horaInicio } = fechaHoraActual();
      const { fecha: fechaFinal, hora: horaFinal } = fechaHoraActual();

      // Agregamos los datos a la data
      data.append(
        "id_xbox",
        String(rentaActual?.id_xbox ?? props.xbox.id ?? -1)
      );
      data.append("fecha", rentaActual?.fecha ?? fechaInicio);
      data.append("inicio", rentaActual?.inicio ?? horaInicio);
      data.append("final", horaFinal);
      data.append("duracion", String(tiempoTotalBandera));
      data.append("total", String(recaudadoBandera));

      // ? Esta pagado
      if (isPagado) {
        data.append("isPagado", String(1));
      }

      // ? Mas de un control
      if (controlesExtra) {
        data.append("noControles", String(1));
      }

      // ? Cliente valido
      if (cliente && regexCliente.test(cliente)) {
        data.append("cliente", cliente);
      }

      // ? Comentario valido
      if (comentario && regexComentario.test(comentario)) {
        data.append("comentario", comentario);
      }

      // console.log("Datos a enviar:");
      // data.forEach((value, key) => {
      //   console.log(key + ": " + value);
      // });

      // Creamos
      await actualizarRenta(data);

      // ! Error
    } catch (error: unknown) {
      alertaSwal("Error!", String(error), "error");
    } finally {
      setCargando(false);
      limpiarDatos();
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

  // * Comentario
  const ComentarioPop: OverlayChildren = (
    <Popover id="popover-comentario">
      <Popover.Header as="h3">Comentario</Popover.Header>
      <Popover.Body>
        <InputGroup>
          <Form.Control
            onChange={(e) => setComentario(e.target.value)}
            value={comentario ?? ""}
            maxLength={360}
            autoComplete="off"
            disabled={
              !isTiempoCorriendo || props.xbox.estado === "NO DISPONIBLE"
            }
            as="textarea"
            rows={3}
            aria-label="area-comentario"
            className={
              comentario && regexComentario.test(comentario)
                ? "is-valid"
                : "is-invalid"
            }
          />
        </InputGroup>
      </Popover.Body>
    </Popover>
  );

  // * Limpiar datos
  const limpiarDatos = (): void => {
    setRecaudado(calcularMontoRecaudado(tiempoTotal, controlesExtra));
    setCliente(null);
    setComentario(null);
    setRentaActual(null);
    setTiempoCorriendo(false);
    setTiempoSeleccionado(-1);
    setTiempoRestante(0);
    setControlesExtra(false);
    setPagado(false);
    setKeyTemporizador((prevKey) => prevKey + 1);
    restanteBandera = 0;
    recaudadoBandera = 0;
    tiempoTotalBandera = 0;
  };

  // Todo, Renderizar tiempo
  const renderizarTiempo = ({ remainingTime }: any) => {
    // ? Es menor a 1
    if (remainingTime < 1) {
      return (
        <div>
          {idAlarma !== null ? (
            <>
              <Col xs={6} md={4}>
                <Image
                  onClick={() => {
                    // ? Es nulo
                    if (!idAlarma) {
                      alertaSwal(
                        "Error",
                        "No se puede detener la alarma reinicia el programa",
                        "error"
                      );
                      return;
                    }

                    detenerAlarma(idAlarma);
                    setIdAlarma(null);
                  }}
                  className="img-alarma"
                  alt="alarma-terminada"
                  src={iconoAlarma}
                  roundedCircle
                />
              </Col>
            </>
          ) : (
            <h4>TERMINADO</h4>
          )}
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
        const r: number = calcularMontoRecaudado(tr, controlesExtra);
        // Redondeado
        const rd: number = redondearNumero(r);
        // Ponemos valor
        setRecaudado(rd);
        banderRecaudado = true;
      }, 2000);
    }

    //  Restante bandera
    restanteBandera = remainingTime;
    // Recaudado
    recaudadoBandera = redondearNumero(
      calcularMontoRecaudado(tr, controlesExtra)
    );
    // Total
    tiempoTotalBandera = parseFloat((tr / 60).toFixed(2));

    return (
      <div className="timer">
        <h1>{restante}</h1>
        <h1>{trascurrido}</h1>
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
            <Col xs={4}>
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
                    <div className="d-flex flex-column justify-content-center">
                      <br className="mb-2" />
                      <CountdownCircleTimer
                        rotation="clockwise"
                        key={keyTemporizador}
                        isPlaying={isTiempoCorriendo}
                        duration={tiempoRestante}
                        colors={["#3C9B2C", "#FAB200", "#F2961C", "#A30000"]}
                        size={230}
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
            <Col xs={8}>
              {/* -------- CUERPO */}
              <div className="d-flex flex-column">
                {/* -------- INFORMACIÓN */}
                <h2>
                  {`Tiempo: ${
                    tiempoTotal > 0 ? formatearTiempo(tiempoTotal) : "00:00"
                  } | recaudado: ${recaudado} $`}
                </h2>
                <br />

                {/* -------- CONTROL DE TIEMPOS */}
                <InputGroup className="mb-2">
                  {/* Tiempo inicial */}
                  <div className="mb-2">
                    <DropdownButton
                      align="start"
                      title="Seleccionar tiempo "
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
                      onSelect={(e) => seleccionarTiempoInicial(e)}
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
                      title="Aumentar minutos "
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
                      title="Disminuir minutos "
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
                </InputGroup>

                {/* -------- BOTONES DE ESTADOS */}
                <ButtonGroup aria-label="grupo-botones" className="mb-4">
                  {/* -------- Iniciar */}
                  <Button
                    disabled={
                      isTiempoCorriendo ||
                      tiempoSeleccionado < 0 ||
                      props.xbox.estado === "NO DISPONIBLE" ||
                      idAlarma !== null
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
                      props.xbox.estado === "NO DISPONIBLE" ||
                      idAlarma !== null
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
                        terminarTemporizador(false);
                      }
                    }}
                  >
                    Terminar
                  </Button>
                </ButtonGroup>

                {/* -------- PAGO Y CONTROLES */}
                <InputGroup className="mb-3">
                  {/* Renta pagada */}
                  <InputGroup.Text className="bg-secondary text-white">
                    ¿Renta pagada?
                  </InputGroup.Text>
                  <Form.Select
                    aria-label="Pago la renta"
                    value={isPagado ? 1 : 0}
                    disabled={
                      !isTiempoCorriendo ||
                      props.xbox.estado === "NO DISPONIBLE"
                    }
                    onChange={(e) => setPagado(parseInt(e.target.value) === 1)}
                    className={"is-valid"}
                  >
                    <option value={1}>SI</option>
                    <option value={0}>NO</option>
                  </Form.Select>

                  {/* Numero de controles */}
                  <InputGroup.Text className="bg-secondary text-white">
                    ¿Cuantos controles?
                  </InputGroup.Text>
                  <Form.Select
                    aria-label="Controles de renta"
                    value={!controlesExtra ? 1 : 2}
                    disabled={
                      !isTiempoCorriendo ||
                      props.xbox.estado === "NO DISPONIBLE"
                    }
                    className={"is-valid"}
                    onChange={(n) =>
                      setControlesExtra(parseInt(n.target.value) !== 1)
                    }
                  >
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                  </Form.Select>
                </InputGroup>

                {/* -------- CLIENTE Y COMENTARIO */}
                <InputGroup className="mb-3">
                  {/* Cliente */}
                  <InputGroup.Text className="bg-secondary text-white">
                    Cliente
                  </InputGroup.Text>
                  <Form.Control
                    className={
                      cliente === "" || !cliente
                        ? ""
                        : cliente && regexCliente.test(cliente)
                        ? "is-valid"
                        : "is-invalid"
                    }
                    onChange={(e) => setCliente(e.target.value)}
                    value={cliente ?? ""}
                    type="text"
                    autoFocus
                    placeholder="Nombre del cliente"
                    aria-label="Nombre del cliente"
                    aria-describedby="Cliente que esta rentando actualmente"
                    maxLength={60}
                    autoComplete="off"
                    disabled={
                      !isTiempoCorriendo ||
                      props.xbox.estado === "NO DISPONIBLE"
                    }
                  />

                  {/* Comentario */}
                  <InputGroup.Text className="bg-secondary text-white">
                    Comentario
                  </InputGroup.Text>
                  <OverlayTrigger
                    rootClose
                    placement="right"
                    trigger="click"
                    overlay={ComentarioPop}
                  >
                    <Button
                      variant="success"
                      disabled={
                        !isTiempoCorriendo ||
                        props.xbox.estado === "NO DISPONIBLE"
                      }
                    >
                      <IconoBootstrap nombre={"PenFill"} />
                    </Button>
                  </OverlayTrigger>
                </InputGroup>
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
          limpiarDatos();
          props.actualizarXbox(id, xbox);
        }}
      />
      {/* MODAL CARGANDO */}
      <ComponenteCargando tipo={"spin"} estadoModal={isCargando} />
    </>
  );
};

export default CartaXbox;

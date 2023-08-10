import React, { useState } from "react";
import {
  Button,
  Card,
  Row,
  Col,
  Toast,
  ButtonGroup,
  Form,
  InputGroup,
  Image,
} from "react-bootstrap";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import Xbox from "../../models/Xbox";
import ModalXbox from "./ModalXbox";
import IconoBootstrap from "../../components/global/IconoBootstrap";
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
import ComponenteCargando from "../../components/global/ComponenteCargando";
import { detenerAlarma, reproducirAlarma } from "../../functions/alarma";
import iconoAlarma from "../../assets/imgs/iconoAlarma.png";

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

// * Seleccionar tiempos
interface SelectTiempo {
  leyenda: string;
  tiempo: number;
}

// * Tiempos establecidos
const selectsTiempo: SelectTiempo[] = [
  {
    leyenda: "N/A",
    tiempo: 0,
  },
  {
    leyenda: "15 m",
    tiempo: 15,
  },
  {
    leyenda: "30 m",
    tiempo: 30,
  },
  {
    leyenda: "1 h",
    tiempo: 60,
  },
  {
    leyenda: "1/30 h",
    tiempo: 90,
  },
  {
    leyenda: "2 h",
    tiempo: 120,
  },
  {
    leyenda: "2/30 h",
    tiempo: 150,
  },
  {
    leyenda: "3 h",
    tiempo: 180,
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
  const [precioEstimado, setPrecioEstimado] = useState<number>(0);
  const [isPausa, setPausa] = useState<boolean>(false);
  // * Datos de la BD
  const [isPagado, setPagado] = useState<boolean>(false);
  const [isControlExtra, setControlExtra] = useState<boolean>(false);
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

    // ? Es NaN
    if (isNaN(en)) {
      alertaSwal(
        "ERROR",
        "Ocurrió un error extraño, comuníquelo al desarrollador",
        "error"
      );
      return;
    }

    // ? es 0
    if (en === 0) {
      setTiempoTotal(0);
      setTiempoSeleccionado(-1);
      setPrecioEstimado(0);
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

      // Minutos
      const m: number = n * 60;

      setTiempoTotal(m);
      setTiempoSeleccionado(m);
      setPrecioEstimado(calcularMontoRecaudado(m, isControlExtra));
      return;
    }

    // Minutos
    const m: number = en * 60;

    setTiempoTotal(m);
    setTiempoSeleccionado(m);
    setPrecioEstimado(calcularMontoRecaudado(m, isControlExtra));
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
      data.append("total", String(precioEstimado));

      // ? Esta pagado
      if (isPagado) {
        data.append("isPagado", String(1));
      }

      // ? Mas de un control
      if (isControlExtra) {
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
  const continuarTemporizador = (): void => {
    setPausa(false);
    setTiempoCorriendo(true);
  };

  // * Pausar temporizador
  const pausarTemporizador = (): void => {
    setPausa(true);
    setTiempoCorriendo(false);
  };

  // * Aumentar tiempo
  const aumentarTiempo = async (e: string | null): Promise<void> => {
    // ? Menor a 1
    if (tiempoRestante < 1) {
      return;
    }

    // Convertimos
    const en: number = Number(e);

    // ? Es NaN
    if (isNaN(en)) {
      alertaSwal(
        "ERROR",
        "Ocurrió un error extraño, comuníquelo al desarrollador",
        "error"
      );
      return;
    }

    // ? Menor a 1
    if (en < 1) {
      // Alerta
      const n: number = await seleccionarTiempoManual("aumentado");

      // ? Es negativo
      if (n < 1) {
        return;
      }

      setTiempoTotal((prevTiempo) => prevTiempo + n * 60);
      setTiempoRestante((prevTiempo) => prevTiempo + n * 60);
      return;
    }

    setTiempoTotal((prevTiempo) => prevTiempo + en * 60);
    setTiempoRestante((prevTiempo) => prevTiempo + en * 60);
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

  // * Limpiar datos
  const limpiarDatos = (): void => {
    setRecaudado(calcularMontoRecaudado(tiempoTotal, isControlExtra));
    setCliente(null);
    setComentario(null);
    setRentaActual(null);
    setTiempoCorriendo(false);
    setTiempoSeleccionado(-1);
    setTiempoRestante(0);
    setControlExtra(false);
    setPagado(false);
    setPausa(false);
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
        const r: number = calcularMontoRecaudado(tr, isControlExtra);
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
      calcularMontoRecaudado(tr, isControlExtra)
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

  // Todo, Componente principal
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
            nombre="EyeFill"
            color="white"
            size={25}
          />
        </Card.Header>

        {/* CUERPO DE LA CARTA */}
        <Card.Body>
          {props.xbox.estado === "NO DISPONIBLE" ? (
            <div className="contenedor-centrado">
              <h4>Xbox no disponible</h4>
            </div>
          ) : (
            <Row>
              {/* TEMPORIZADOR */}
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
                    <div className="d-flex flex-column justify-content-center">
                      <br className="mb-2" />
                      {/* Temporizador */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
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
                      <br className="mb-2" />
                      {/* Botones del temporizador */}
                      <ButtonGroup className="botones-temporizador">
                        {/* Iniciar */}
                        <Button
                          className="b-tp"
                          variant="dark"
                          onClick={() => {
                            // ? Es menor a 1
                            if (tiempoRestante > 1) {
                              continuarTemporizador();
                              return;
                            }
                            iniciarTemporizador();
                          }}
                          disabled={
                            isTiempoCorriendo ||
                            tiempoSeleccionado < 0 ||
                            idAlarma !== null
                          }
                        >
                          <IconoBootstrap nombre="PlayFill" size={25} />
                        </Button>
                        {/* Pausar */}
                        <Button
                          className="b-tp"
                          variant="dark"
                          disabled={
                            !isTiempoCorriendo || tiempoSeleccionado < 0
                          }
                          onClick={pausarTemporizador}
                        >
                          <IconoBootstrap nombre="PauseFill" size={25} />
                        </Button>
                        {/* Terminar */}
                        <Button
                          className="b-tp"
                          variant="dark"
                          disabled={!isTiempoCorriendo}
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
                          <IconoBootstrap nombre="X" size={25} />
                        </Button>
                      </ButtonGroup>
                    </div>
                  </Toast.Body>
                </Toast>
              </Col>
              {/* CONTROLES */}
              <Col xs={8}>
                {/* -------- CUERPO */}
                <div className="d-flex flex-column">
                  <br className="mb-3" />
                  {/* -------- INFORMACIÓN */}
                  <h3>
                    {`Tiempo: ${
                      tiempoTotal > 0 ? formatearTiempo(tiempoTotal) : "00:00"
                    } | Recaudado: ${recaudado} $ | Estimado: ${precioEstimado} $
              `}
                  </h3>
                  <br />
                  {/* -------- CONTROL DE TIEMPOS */}
                  <InputGroup className="mb-2">
                    {/* Tiempo inicial */}
                    <InputGroup.Text style={styles[1]}>
                      Seleccionar
                    </InputGroup.Text>
                    <Form.Select
                      disabled={isTiempoCorriendo || isPausa}
                      onChange={(e) => seleccionarTiempoInicial(e.target.value)}
                      value={tiempoSeleccionado / 60 ?? 0}
                      className={
                        isTiempoCorriendo || isPausa ? "is-invalid" : "is-valid"
                      }
                      style={styles[0]}
                    >
                      {selectsTiempo.map((select, i) => {
                        return (
                          <option key={i} value={select.tiempo}>
                            {select.leyenda}
                          </option>
                        );
                      })}
                    </Form.Select>

                    {/* Aumentar tiempo */}
                    <InputGroup.Text style={styles[1]}>
                      Aumentar
                    </InputGroup.Text>
                    <Form.Select
                      disabled={!isTiempoCorriendo}
                      onChange={async (e) => aumentarTiempo(e.target.value)}
                      value={0}
                      className={!isTiempoCorriendo ? "is-invalid" : "is-valid"}
                      style={styles[0]}
                    >
                      {selectsTiempo.map((select, i) => {
                        return (
                          <option key={i} value={select.tiempo}>
                            {select.leyenda}
                          </option>
                        );
                      })}
                    </Form.Select>

                    {/* Disminuir tiempo */}
                    <InputGroup.Text style={styles[1]}>
                      Disminuir
                    </InputGroup.Text>
                    <Form.Select
                      disabled={!isTiempoCorriendo}
                      onChange={async (e) => {
                        // ? Menor a 1
                        if (tiempoRestante < 1) {
                          return;
                        }

                        // Convertimos
                        const en: number = Number(e.target.value);

                        // ? Es NaN
                        if (isNaN(en)) {
                          alertaSwal(
                            "ERROR",
                            "Ocurrió un error extraño, comuníquelo al desarrollador",
                            "error"
                          );
                          return;
                        }

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
                      value={0}
                      className={!isTiempoCorriendo ? "is-invalid" : "is-valid"}
                      style={styles[0]}
                    >
                      {selectsTiempo.map((select, i) => {
                        return (
                          <option key={i} value={select.tiempo}>
                            {select.leyenda}
                          </option>
                        );
                      })}
                    </Form.Select>
                  </InputGroup>
                  {/* -------- PAGO Y CONTROLES */}
                  <InputGroup className="mb-3">
                    {/* Renta pagada */}
                    <InputGroup.Text style={styles[1]}>
                      ¿Renta pagada?
                    </InputGroup.Text>
                    <Form.Select
                      aria-label="Pago la renta"
                      value={isPagado ? 1 : 0}
                      disabled={!isTiempoCorriendo}
                      onChange={(e) =>
                        setPagado(parseInt(e.target.value) === 1)
                      }
                      className={"is-valid"}
                      style={styles[0]}
                    >
                      <option value={1}>SI</option>
                      <option value={0}>NO</option>
                    </Form.Select>

                    {/* Numero de controles */}
                    <InputGroup.Text style={styles[1]}>
                      ¿Cuantos controles?
                    </InputGroup.Text>
                    <Form.Select
                      aria-label="Controles de renta"
                      value={!isControlExtra ? 1 : 2}
                      disabled={!isTiempoCorriendo}
                      onChange={(n) =>
                        setControlExtra(parseInt(n.target.value) !== 1)
                      }
                      className={"is-valid"}
                      style={styles[0]}
                    >
                      <option value={1}>1</option>
                      <option value={2}>2</option>
                    </Form.Select>
                  </InputGroup>
                  {/* -------- CLIENTE Y COMENTARIO */}
                  <div>
                    {/* Cliente */}
                    <InputGroup className="mb-3">
                      <InputGroup.Text style={styles[1]}>
                        Cliente
                      </InputGroup.Text>
                      <Form.Control
                        onChange={(e) => setCliente(e.target.value)}
                        value={cliente ?? ""}
                        type="text"
                        autoFocus
                        aria-label="Nombre del cliente"
                        aria-describedby="Cliente que esta rentando actualmente"
                        maxLength={60}
                        autoComplete="off"
                        disabled={!isTiempoCorriendo}
                        className={
                          !isTiempoCorriendo
                            ? "is-invalid"
                            : cliente === "" || !cliente
                            ? ""
                            : cliente && regexCliente.test(cliente)
                            ? "is-valid"
                            : "is-invalid"
                        }
                        style={styles[0]}
                      />
                    </InputGroup>
                    {/* Comentario */}
                    <InputGroup>
                      <InputGroup.Text style={styles[1]}>
                        Comentario
                      </InputGroup.Text>
                      <Form.Control
                        onChange={(e) => setComentario(e.target.value)}
                        value={comentario ?? ""}
                        maxLength={360}
                        autoComplete="off"
                        disabled={!isTiempoCorriendo}
                        as="textarea"
                        rows={3}
                        aria-label="area-comentario"
                        className={
                          !isTiempoCorriendo
                            ? "is-invalid"
                            : comentario === "" || !comentario
                            ? ""
                            : comentario && regexComentario.test(comentario)
                            ? "is-valid"
                            : "is-invalid"
                        }
                        style={styles[0]}
                      />
                    </InputGroup>
                  </div>
                </div>
              </Col>
            </Row>
          )}
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

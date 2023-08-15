import React, { Dispatch } from "react";
import Renta from "../../models/Renta";
import { Button, Card, Container, ListGroup } from "react-bootstrap";
import {
  alertaSwal,
  confirmacionSwal,
  formatearFechaConDias,
  formatearHoraSinSegundos,
} from "../../functions/funcionesGlobales";
import { RespuestaApi } from "../../apis/apiVariables";
import { apiEliminarRenta } from "../../apis/apiRentas";

// * Props
interface Props {
  renta: Renta | null;
  setCargandoAccion: Dispatch<boolean>;
  setRentaSeleccionada: Dispatch<Renta | null>;
  recargarTabla: () => void;
}

// Todo, Pagina tarjeta renta
const TarjetaRenta: React.FC<Props> = (props) => {
  // * Eliminar renta
  const eliminarRenta = async (): Promise<void> => {
    try {
      // Confirmacion
      const conf = await confirmacionSwal(
        "Estas seguro?",
        "Si eliminas esta renta ya no podrás restaurar sus datos!",
        "Si, eliminar renta"
      );

      // ? Se confirmo
      if (conf) {
        //  Cargando
        props.setCargandoAccion(true);

        // Obtenemos id
        const idRenta: number = props?.renta?.id ?? -1;

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

        // Eliminamos y recargamos
        props.setRentaSeleccionada(null);
        props.recargarTabla();

        // * Éxito
        alertaSwal("Éxito!", "Renta eliminada correctamente", "success");
      }

      // ! Error
    } catch (error: unknown) {
      alertaSwal("Error!", String(error), "error");
    } finally {
      props.setCargandoAccion(false);
    }
  };

  return (
    <Container className="tarjeta-inf">
      <br className="mb-3" />
      {/* TARJETA */}
      <Card style={{ height: "auto" }}>
        <br className="mb-1" />

        {/* Cuerpo */}
        <Card.Body className="align-items-center cuerpo-tarjeta">
          {/* Fecha */}
          <Card.Title>
            {props.renta?.fecha
              ? formatearFechaConDias(props.renta?.fecha)
              : "Ninguna renta seleccionada"}
          </Card.Title>
          {/* Hora */}
          <Card.Subtitle>
            {props.renta?.inicio
              ? formatearHoraSinSegundos(props.renta?.inicio)
              : "N/A"}
            {" - "}
            {props.renta?.final
              ? formatearHoraSinSegundos(props.renta?.final)
              : "N/A"}
          </Card.Subtitle>

          <br className="md-2" />

          {/* Descripcion */}
          <Card.Text>{props.renta?.comentario ?? "Sin comentarios"}</Card.Text>

          {/* Cliente */}
          {props.renta?.cliente && (
            <Card.Text>{props.renta?.cliente}</Card.Text>
          )}

          <ListGroup>
            {/* Total */}
            <ListGroup.Item
              style={{
                backgroundColor: "transparent",
                border: "none",
                color: "white",
              }}
              className="list-group-item d-flex justify-content-between align-items-center p-1"
            >
              <p className="mb-0">Total:</p>
              <p className="mb-0">
                {props.renta?.total ? "$" + props.renta.total : "N/A"}
              </p>
            </ListGroup.Item>

            {/* Duracion */}
            <ListGroup.Item
              style={{
                backgroundColor: "transparent",
                border: "none",
                color: "white",
              }}
              className="list-group-item d-flex justify-content-between align-items-center p-1"
            >
              <p className="mb-0">Duracion:</p>
              <p className="mb-0">{props.renta?.duracion ?? "N/A"}</p>
            </ListGroup.Item>

            {/* Xbox */}
            <ListGroup.Item
              style={{
                backgroundColor: "transparent",
                border: "none",
                color: "white",
              }}
              className="list-group-item d-flex justify-content-between align-items-center p-1"
            >
              <p className="mb-0">Xbox:</p>
              <p className="mb-0">{props.renta?.xbox.nombre ?? "N/A"}</p>
            </ListGroup.Item>

            {/* Pagado */}
            <ListGroup.Item
              style={{
                backgroundColor: "transparent",
                border: "none",
                color: "white",
              }}
              className="list-group-item d-flex justify-content-between align-items-center p-1"
            >
              <p className="mb-0">¿Esta pagado?:</p>
              <p className="mb-0">
                {props.renta?.isPagado === 1 ? "Si" : "No"}
              </p>
            </ListGroup.Item>

            {/* Numero de controles */}
            <ListGroup.Item
              style={{
                backgroundColor: "transparent",
                border: "none",
                color: "white",
              }}
              className="list-group-item d-flex justify-content-between align-items-center p-1"
            >
              <p className="mb-0">No. de controles:</p>
              <p className="mb-0">{props.renta?.noControles ?? "N/A"}</p>
            </ListGroup.Item>

            <br className="md-2" />
          </ListGroup>

          <hr className="hr" />
          <div className="d-flex botones-tarjeta">
            <Button
              disabled={props.renta === null}
              onClick={eliminarRenta}
              className="bt-tr bt-bcr"
            >
              ELIMINAR VENTA
            </Button>
          </div>
        </Card.Body>
      </Card>
      <br className="mb-2" />
    </Container>
  );
};

export default TarjetaRenta;

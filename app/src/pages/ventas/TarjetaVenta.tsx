import React, { Dispatch } from "react";
import Venta from "../../models/Venta";
import { Button, Card, Container, ListGroup } from "react-bootstrap";
import {
  alertaSwal,
  confirmacionSwal,
  formatearFechaConDias,
  formatearHoraSinSegundos,
} from "../../functions/funcionesGlobales";
import { RespuestaApi } from "../../apis/apiVariables";
import { apiEliminarVenta } from "../../apis/apiVentas";

// * Props
interface Props {
  venta: Venta | null;
  setCargandoAccion: Dispatch<boolean>;
  setVentaSeleccionada: Dispatch<Venta | null>;
  recargarTabla: () => void;
}

// Todo, Pagina tarjeta venta
const TarjetaVenta: React.FC<Props> = (props) => {
  // * Eliminar venta
  const eliminarVenta = async (): Promise<void> => {
    try {
      // Confirmacion
      const conf = await confirmacionSwal(
        "Estas seguro?",
        "Si eliminas esta venta ya no podrás restaurar sus datos!",
        "Si, eliminar venta"
      );

      // ? Se confirmo
      if (conf) {
        //  Cargando
        props.setCargandoAccion(true);

        // Obtenemos id
        const idVenta: number = props?.venta?.id ?? -1;

        // Enviamos
        const res: RespuestaApi = await apiEliminarVenta(idVenta);

        // ? salio mal
        if (!res.estado) {
          throw new Error(
            res.detalles_error
              ? String(res.detalles_error)
              : "Ocurrió un error al eliminar la venta, intenta mas tarde"
          );
        }

        // Eliminamos y recargamos
        props.setVentaSeleccionada(null);
        props.recargarTabla();

        // * Éxito
        alertaSwal("Éxito!", "Venta eliminada correctamente", "success");
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
            {props.venta?.fecha
              ? formatearFechaConDias(props.venta?.fecha)
              : "Ninguna venta seleccionada"}
          </Card.Title>
          {/* Hora */}
          <Card.Subtitle>
            {props.venta?.hora
              ? formatearHoraSinSegundos(props.venta?.hora)
              : "- - - - -"}
          </Card.Subtitle>

          <br className="md-2" />

          {/* Descripcion */}
          <Card.Text>{props.venta?.comentario ?? "Sin comentarios"}</Card.Text>

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
                {props.venta?.total ? "$" + props.venta.total : "N/A"}
              </p>
            </ListGroup.Item>

            {/* Numero de productos */}
            <ListGroup.Item
              style={{
                backgroundColor: "transparent",
                border: "none",
                color: "white",
              }}
              className="list-group-item d-flex justify-content-between align-items-center p-1"
            >
              <p className="mb-0">Productos vendidos:</p>
              <p className="mb-0">{props.venta?.noProductos ?? "N/A"}</p>
            </ListGroup.Item>

            <br className="md-2" />

            {/* Detalles */}
            {props.venta &&
              props.venta.detalles.map((detalle, i) => {
                return (
                  <ListGroup.Item
                    key={i}
                    style={{
                      backgroundColor: "transparent",
                      border: "none",
                      color: "white",
                    }}
                    className="list-group-item d-flex justify-content-between align-items-center p-1"
                  >
                    <p className="mb-0">
                      {detalle.nombre_producto ?? "Desconocido"}
                    </p>
                    <p className="mb-0">{detalle.cantidad ?? "N/A"}</p>
                  </ListGroup.Item>
                );
              })}
          </ListGroup>

          <hr className="hr" />
          <div className="d-flex botones-tarjeta">
            <Button
              disabled={props.venta === null}
              onClick={eliminarVenta}
              className="bt-tr bt-bcr"
            >
              ELIMINAR VENTA
            </Button>
          </div>
        </Card.Body>
      </Card>
      <br className="mb-2"/>
    </Container>
  );
};

export default TarjetaVenta;

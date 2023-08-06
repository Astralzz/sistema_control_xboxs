import React, { Dispatch } from "react";
import Producto from "../../models/Producto";
import {
  Button,
  ButtonGroup,
  Card,
  Container,
  Image,
  ListGroup,
} from "react-bootstrap";
import iconProducto from "../../assets/imgs/iconProducto.png";
import IconoBootstrap from "../../components/global/IconoBootstrap";
import {
  alertaSwal,
  confirmacionSwal,
} from "../../functions/funcionesGlobales";
import { RespuestaApi } from "../../apis/apiVariables";
import { apiEliminarProducto } from "../../apis/apiProductos";

// * Props
interface Props {
  producto: Producto | null;
  setCargandoAccion: Dispatch<boolean>;
  setProductoSeleccionado: Dispatch<Producto | null>;
  setAbrirModal: Dispatch<void>;
  cambiarTituloModal: (newTitulo: string) => void;
  recargarTabla: () => void;
}

// Todo, Pagina tarjeta producto
const TarjetaProducto: React.FC<Props> = (props) => {
  // * Eliminar producto
  const eliminarProducto = async (): Promise<void> => {
    try {
      // Confirmacion
      const conf = await confirmacionSwal(
        "Estas seguro?",
        "Si eliminas este producto ya no podrás restaurar sus datos!",
        "Si, eliminar producto"
      );

      // ? Se confirmo
      if (conf) {
        //  Cargando
        props.setCargandoAccion(true);

        // Obtenemos id
        const idProducto: number = props?.producto?.id ?? -1;

        // Enviamos
        const res: RespuestaApi = await apiEliminarProducto(idProducto);

        // ? salio mal
        if (!res.estado) {
          throw new Error(
            res.detalles_error
              ? String(res.detalles_error)
              : "Ocurrió un error al eliminar el xbox, intenta mas tarde"
          );
        }

        // Eliminamos y recargamos
        props.setProductoSeleccionado(null);
        props.recargarTabla();

        // * Éxito
        alertaSwal(
          "Éxito!",
          // res.mensaje ?? "Xbox eliminado correctamente",
          "Xbox eliminado correctamente",
          "success"
        );
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

        {/* Imagen */}
        <div className="align-items-center">
          <Image
            src={props.producto?.enlace_img ?? iconProducto}
            roundedCircle
            height={140}
            width={140}
          />
        </div>

        <br className="mb-1" />

        {/* Encabezado */}
        <Card.Header>
          {/* Nombre */}
          <Card.Title>
            {props.producto?.nombre ?? "Ningún producto seleccionado"}
          </Card.Title>
          {/* Descripcion */}
          <Card.Text>
            {props.producto?.descripcion ?? "Sin descripcion"}
          </Card.Text>
        </Card.Header>

        {/* Cuerpo */}
        <Card.Body className="align-items-center cuerpo-tarjeta">
          <ListGroup>
            {/* Precio */}
            <ListGroup.Item
              style={{
                backgroundColor: "transparent",
                border: "none",
                color: "white",
              }}
              className="list-group-item d-flex justify-content-between align-items-center p-1"
            >
              <p className="mb-0">Precio:</p>
              <p className="mb-0">
                {props.producto?.precio ? "$" + props.producto.precio : "N/A"}
              </p>
            </ListGroup.Item>

            {/* Stock */}
            <ListGroup.Item
              style={{
                backgroundColor: "transparent",
                border: "none",
                color: "white",
              }}
              className="list-group-item d-flex justify-content-between align-items-center p-1"
            >
              <p className="mb-0">Cantidad actual:</p>
              <p className="mb-0">{props.producto?.stock ?? "N/A"}</p>
            </ListGroup.Item>

            <hr className="hr" />

            {/* Botones */}
            <ListGroup.Item
              style={{
                backgroundColor: "transparent",
                border: "none",
                color: "white",
              }}
              className="list-group-item d-flex justify-content-between align-items-center p-1 botones-tarjeta"
            >
              {/* Ultimas ventas */}
              <p className="mb-0">
                <Button
                  disabled={props.producto === null}
                  variant="secondary"
                  className="bt-tr"
                  onClick={() => {
                    props.setAbrirModal();
                    props.cambiarTituloModal(
                      "Ultimas ventas de " + props.producto?.nombre ?? "???"
                    );
                  }}
                >
                  <IconoBootstrap nombre="EyeFill" />
                </Button>
              </p>

              <ButtonGroup>
                {/* Editar producto */}
                <Button
                  disabled={props.producto === null}
                  className="bt-tr"
                  onClick={() => {
                    props.setAbrirModal();
                    props.cambiarTituloModal("Editar producto");
                  }}
                >
                  <IconoBootstrap nombre="PencilFill" />
                </Button>
                {/* Eliminar producto */}
                <Button
                  disabled={props.producto === null}
                  onClick={eliminarProducto}
                  className="bt-tr"
                >
                  <IconoBootstrap nombre="TrashFill" />
                </Button>
              </ButtonGroup>
            </ListGroup.Item>
          </ListGroup>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default TarjetaProducto;

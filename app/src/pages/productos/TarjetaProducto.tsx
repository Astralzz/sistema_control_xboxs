import React from "react";
import Producto from "../../models/Producto";
import {
  Badge,
  Button,
  ButtonGroup,
  Card,
  Container,
  Image,
  ListGroup,
} from "react-bootstrap";
import iconProducto from "../../assets/imgs/iconProducto.png";
import IconoBootstrap from "../../components/global/IconoBootstrap";

// * Props
interface Props {
  producto: Producto | null;
}

// Todo, Pagina tarjeta producto
const TarjetaProducto: React.FC<Props> = (props) => {
  console.log(props.producto);

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

            <ListGroup.Item
              style={{
                backgroundColor: "transparent",
                border: "none",
                color: "white",
              }}
              className="list-group-item d-flex justify-content-between align-items-center p-1"
            >
              <p className="mb-0">
                <Button variant="secondary">
                  <IconoBootstrap nombre="EyeFill" />
                </Button>
              </p>

              {/* BOTONES */}
              <ButtonGroup>
                <Button variant="success">
                  <IconoBootstrap nombre="PencilFill" />
                </Button>
                <Button variant="danger">
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

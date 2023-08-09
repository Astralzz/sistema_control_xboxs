import React, { Dispatch } from "react";
import { Offcanvas } from "react-bootstrap";
import { OpcionesModalProducto } from "./PaginaProductos";
import ComponenteTablaVentas, {
  ColumnasVentas,
} from "../../components/tablas/ComponenteTablaVentas";
import FormularioProducto from "./FormularioProducto";
import Producto from "../../models/Producto";

// * Props
interface Props {
  estadoModal: boolean;
  cerrarModal: Dispatch<void>;
  opcionesModalProducto: OpcionesModalProducto;
  setCargando: Dispatch<boolean>;
  setProductoSeleccionado: Dispatch<Producto | null>;
  recargarProductos: () => void;
  // aumentarXbox?: (x: Xbox) => void;
  // actualizarXbox?: (id: number, xboxActualizado: Xbox) => void;
}

// Todo, Modal del producto
const ModalProducto: React.FC<Props> = (props) => {
  // * Al cerrar
  const alCerrar = (): void => {
    // setCargando(false);
    props.cerrarModal();
  };

  // * Componente escogido
  const SeccionEscogida = () => {
    // opciones
    const opc = props.opcionesModalProducto;

    // ? Tabla ventas
    if (opc.opcion === "VENTAS") {
      // ? Tiene producto
      if (opc.producto) {
        // columnas
        const columnas: ColumnasVentas = {
          fecha: true,
          hora: true,
          noProductos: true,
          total: true,
        };

        return (
          <ComponenteTablaVentas
            producto={opc.producto}
            isEstadoModal={props.estadoModal}
            columnas={columnas}
            asta={20}
          />
        );
      }

      // ! Error
      return (
        <div className="contenedor-centrado">
          <h4>No se pudo obtener el producto</h4>
        </div>
      );
    }

    // ? Crear producto
    if (opc.opcion === "CREAR") {
      return (
        <FormularioProducto
          setCargando={props.setCargando}
          setProductoSeleccionado={props.setProductoSeleccionado}
          recargarProductos={props.recargarProductos}
        />
      );
    }

    // ? Editar producto
    if (opc.opcion === "EDITAR") {
      // ? Tiene producto
      if (opc.producto) {
        return (
          <FormularioProducto
            producto={opc.producto}
            setCargando={props.setCargando}
            setProductoSeleccionado={props.setProductoSeleccionado}
            recargarProductos={props.recargarProductos}
            actualizarOpcionesProducto={(p: Producto) => {
              props.opcionesModalProducto.producto = p;
            }}
          />
        );
      }

      // ! Error
      return (
        <div className="contenedor-centrado">
          <h4>No se pudo obtener el producto</h4>
        </div>
      );
    }

    // ! Error
    return (
      <div className="contenedor-centrado">
        <h4>No se pudo obtener la opcion escogida</h4>
      </div>
    );
  };

  return (
    <Offcanvas show={props.estadoModal} onHide={alCerrar} placement="end">
      {/* ENCABEZADO */}
      <Offcanvas.Header
        className="modal-derecho"
        closeButton
        closeVariant="white"
      >
        {/* Titulo */}
        <Offcanvas.Title>{props.opcionesModalProducto.titulo}</Offcanvas.Title>
      </Offcanvas.Header>

      {/* CUERPO */}
      <Offcanvas.Body className="modal-derecho">
        <SeccionEscogida />
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default ModalProducto;

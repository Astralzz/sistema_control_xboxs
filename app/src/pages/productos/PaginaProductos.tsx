import React, { useCallback, useEffect, useState } from "react";
import { Button, Col, Container, Pagination, Row } from "react-bootstrap";
import Producto from "../../models/Producto";
import TablaProductos, {
  ColumnasProducto,
} from "../../components/tablas/TablaProductos";
import ComponentError, {
  DataError,
} from "../../components/global/ComponentError";
import ReactLoading from "react-loading";
import { RespuestaApi } from "../../apis/apiVariables";
import { apiObtenerListaProductos } from "../../apis/apiProductos";

// * Pagina
interface Pagina {
  leyenda?: string;
  desde: number;
  asta: number;
}

// * Columnas de tabla
const columnas: ColumnasProducto = {
  no: true,
  nombre: true,
  precio: true,
  stock: true,
  descripcion: true,
  masInf: true,
};

// TODO, Pagina de los productos
const PaginaProductos: React.FC = () => {
  // * Variables
  const [isCargandoTabla, setCargandoTabla] = useState<boolean>(false);
  const [productoSeleccionado, setProductoSeleccionado] =
    useState<Producto | null>(null);
  const [listaProductos, setListaProductos] = useState<Producto[]>([]);
  const [isErrorTabla, setErrorTabla] = useState<DataError>({
    estado: true,
  });

  //* Paginas
  const paginas: Pagina[] = [
    {
      desde: 0,
      asta: 10,
    },
    {
      desde: 10,
      asta: 20,
    },
    {
      desde: 20,
      asta: 30,
    },
    {
      desde: 30,
      asta: 40,
    },
  ];

  // * Obtener xbox
  const obtenerProductos = useCallback(async () => {
    try {
      setCargandoTabla(true);

      // * Buscamos
      const res: RespuestaApi = await apiObtenerListaProductos();

      // ? salio mal
      if (!res.estado) {
        setErrorTabla({
          estado: true,
          titulo: res.noEstado ? String(res.noEstado) : undefined,
          detalles: res.detalles_error ? String(res.detalles_error) : undefined,
        });
        return;
      }

      // * Sin errores
      setErrorTabla({ estado: false });

      // Ponemos lista
      setListaProductos(res.listaProductos ?? []);
    } catch (error) {
      console.error(String(error));
    } finally {
      setCargandoTabla(false);
    }
  }, []);

  // * Al iniciar
  useEffect(() => {
    obtenerProductos();
  }, [obtenerProductos]);

  // Todo, componente principal
  return (
    <Container className="contenedor-completo">
      <br className="mb-2" />
      <Row>
        {/* Administrador */}
        <Col sm={4}>
          <Container>
            <h4>Administrador</h4>
          </Container>
        </Col>
        {/* Tabla */}
        <Col sm={8}>
          <Container>
            {/* Cargando tabla */}
            {isCargandoTabla ? (
              <div className="contenedor-centrado">
                <ReactLoading type={"bubbles"} color="#FFF" />
              </div>
            ) : // ! Error de tabla
            isErrorTabla.estado ? (
              <ComponentError
                titulo={isErrorTabla.titulo ?? "Error 404"}
                detalles={
                  isErrorTabla.detalles ?? "No se pudieron cargar los productos"
                }
                accionVoid={obtenerProductos}
              />
            ) : (
              // * Tabla de productos
              <>
                <TablaProductos
                  lista={listaProductos}
                  columnas={columnas}
                  setCargandoTabla={setCargandoTabla}
                  setProductoSeleccionado={setProductoSeleccionado}
                />
                {/* Pagination */}
                <Pagination size="sm">
                  {paginas.map((pagina, i) => {
                    return (
                      <Pagination.Item key={i} active={i === 2}>
                        {pagina.leyenda ?? i + 1}
                      </Pagination.Item>
                    );
                  })}
                </Pagination>
              </>
            )}
          </Container>
        </Col>
      </Row>
    </Container>
  );
};

export default PaginaProductos;

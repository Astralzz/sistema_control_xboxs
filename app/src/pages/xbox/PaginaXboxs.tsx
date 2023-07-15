import React, { useEffect, useState } from "react";
import { Container, Tab, Tabs } from "react-bootstrap";
import CartaXbox from "./CartaXbox";
import Xbox from "../../models/Xbox";
import apiObtenerListaXboxs from "../../apis/apiXboxs";
import { RespuestaApi } from "../../apis/apiVariables";
import ComponentError, {
  DataError,
} from "../../components/Global/ComponentError";

// TODO, Pagina de los xbox
const PaginaXboxs: React.FC = () => {
  // * Variables
  const [listaXboxs, setListaXboxs] = useState<Xbox[]>([]);
  const [isError, setError] = useState<DataError>({
    estado: false,
  });

  // * Obtener xbox
  const obtenerXboxs = async () => {
    // * Buscamos
    const res: RespuestaApi = await apiObtenerListaXboxs();

    // ? Es falso
    if (!res.estado) {
      setError({
        estado: true,
        titulo: res.noEstado ? String(res.noEstado) : undefined,
        detalles: res.detalles_error ? String(res.detalles_error) : undefined,
      });
      return;
    }

    // * Sin errores
    setError({ estado: false });

    // Ponemos lista
    setListaXboxs(res.listaXboxs ?? []);
  };

  // * Buscamos
  useEffect(() => {
    obtenerXboxs();
  }, []);

  // ! Error
  if (isError.estado) {
    return (
      <ComponentError
        titulo={isError.titulo}
        detalles={isError.detalles}
        accionVoid={() => obtenerXboxs().catch(console.error)}
      />
    );
  }

  return (
    <Container>
      <br />
      <h3>Rentas de xbox</h3>
      <br />
      {/* Es un arreglo y no esta vació */}
      {Array.isArray(listaXboxs) && listaXboxs.length > 0 ? (
        <Tabs defaultActiveKey="xbox-0" id="id-tab-xbox">
          {/* Lista de xboxs */}
          {listaXboxs.map((xbox, i) => {
            // ? No esta disponible
            if (xbox.estado === "NO DISPONIBLE") {
              return <React.Fragment key={i} />;
            }
            // Xbox
            return (
              <Tab key={i} eventKey={"xbox-" + i} title={"X-" + (i + 1)}>
                <CartaXbox {...xbox} />
              </Tab>
            );
          })}
        </Tabs>
      ) : (
        <ComponentError titulo={"Lista vacía"} />
      )}
    </Container>
  );
};

export default PaginaXboxs;

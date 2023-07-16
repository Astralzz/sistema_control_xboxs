import React, { useEffect, useState } from "react";
import { Container, Tab, Tabs } from "react-bootstrap";
import CartaXbox from "./CartaXbox";
import Xbox from "../../models/Xbox";
import { apiObtenerListaXboxs } from "../../apis/apiXboxs";
import { RespuestaApi } from "../../apis/apiVariables";
import ComponentError, {
  DataError,
} from "../../components/Global/ComponentError";
import FormularioXboxs from "./FormularioXboxs";

// TODO, Pagina de los xbox
const PaginaXboxs: React.FC = () => {
  // * Variables
  const [key, setKey] = useState<string | null>(null);
  const [listaXboxs, setListaXboxs] = useState<Xbox[]>([]);
  const [isEstadoModal, setEstadoModal] = useState<boolean>(false);
  const [isError, setError] = useState<DataError>({
    estado: false,
  });

  // * Acciones modal
  const cerrarModal = () => setEstadoModal(false);
  const abrirModal = () => setEstadoModal(true);

  // * Obtener xbox
  const obtenerXboxs = async (): Promise<void> => {
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

  // * Abrir formulario
  const abrirFormulario = (k: string | null): void => {
    // ? Es agregar
    if (k === "add-xbox") {
      // Abrimos modal
      abrirModal();

      // Es nulo
      setKey(null);
      return;
    }

    setKey(k);
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
    <>
      {/* PAGINA COMPLETA */}
      <Container>
        <br />
        <h3>Rentas de xbox</h3>
        <br />
        {/* Es un arreglo y no esta vació */}
        {Array.isArray(listaXboxs) && listaXboxs.length > 0 ? (
          <Tabs
            defaultActiveKey={key ?? "xbox-0"}
            transition={false}
            activeKey={key ?? "xbox-0"}
            onSelect={abrirFormulario}
            id="id-tab-xbox"
          >
            {/* Lista de xboxs */}
            {listaXboxs.map((xbox, i) => {
              // ? No esta disponible
              if (xbox.estado === "NO DISPONIBLE") {
                return <React.Fragment key={i} />;
              }
              // Xbox
              return (
                <Tab
                  tabClassName="tab-xbox"
                  key={i}
                  eventKey={"xbox-" + i}
                  title={i + 1}
                >
                  <CartaXbox {...xbox} />
                </Tab>
              );
            })}
            {/* Tap de agregar */}
            <Tab tabClassName="tab-xbox" title="+" eventKey={"add-xbox"} />
          </Tabs>
        ) : (
          <ComponentError titulo={"Lista vacía"} />
        )}
      </Container>
      {/* MODAL */}
      <FormularioXboxs estadoModal={isEstadoModal} cerrarModal={cerrarModal} />
    </>
  );
};

export default PaginaXboxs;

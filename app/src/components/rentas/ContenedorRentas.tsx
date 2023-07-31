import React, { useEffect, useState } from "react";
import { Container, Tab, Tabs } from "react-bootstrap";
import CartaXbox from "./CartaXbox";
import Xbox from "../../models/Xbox";
import { apiObtenerListaXboxs } from "../../apis/apiXboxs";
import { RespuestaApi } from "../../apis/apiVariables";
import ComponentError, { DataError } from "../global/ComponentError";
import FormularioXboxs from "./FormularioXboxs";

// TODO, Contenedor rentas
const ContenedorRentas: React.FC = () => {
  // * Variables
  const [keyTab, setKeyTab] = useState<string | null>(null);
  const [listaXboxs, setListaXboxs] = useState<Xbox[]>([]);
  const [isEstadoModal, setEstadoModal] = useState<boolean>(false);
  const [isError, setError] = useState<DataError>({
    estado: false,
  });

  // * Acciones xbox
  const aumentarXbox = (x: Xbox) =>
    setListaXboxs((prevLista) => [...prevLista, x]);
  const eliminarXbox = (id: number) => {
    // Cambiamos key
    setKeyTab("xbox-0");

    // Eliminamos
    setListaXboxs((prevLista) => prevLista.filter((xbox) => xbox.id !== id));
  };
  const actualizarXbox = (id: number, xboxActualizado: Xbox) =>
    setListaXboxs((prevLista) =>
      prevLista.map((xbox) => (xbox.id === id ? xboxActualizado : xbox))
    );

  // * Acciones modal
  const cerrarModal = () => setEstadoModal(false);
  const abrirModal = () => setEstadoModal(true);

  // * Obtener xbox
  const obtenerXboxs = async (): Promise<void> => {
    // * Buscamos
    const res: RespuestaApi = await apiObtenerListaXboxs();

    // ? salio mal
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
      setKeyTab(null);
      return;
    }

    setKeyTab(k);
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

  // TODO, Pagina
  return (
    <>
      {/* PAGINA COMPLETA */}
      <div>
        {/* Es un arreglo y no esta vació */}
        {Array.isArray(listaXboxs) && listaXboxs.length > 0 ? (
          <Tabs
            defaultActiveKey={keyTab ?? "xbox-0"}
            transition={false}
            activeKey={keyTab ?? "xbox-0"}
            onSelect={abrirFormulario}
            id="id-tab-xbox"
          >
            {/* Lista de xboxs */}
            {listaXboxs.map((xbox, i) => {
              // Xbox
              return (
                <Tab
                  tabClassName={
                    "tab-xbox" +
                    (xbox.estado === "NO DISPONIBLE" ? "-invalido" : "")
                  }
                  key={i}
                  eventKey={"xbox-" + i}
                  title={i + 1}
                >
                  {xbox.estado === "DISPONIBLE" ? (
                    <CartaXbox
                      xbox={xbox}
                      actualizarXbox={actualizarXbox}
                      eliminarXbox={eliminarXbox}
                    />
                  ) : (
                    <Container>
                      <br />
                      <h3>Xbox no disponible</h3>
                    </Container>
                  )}
                </Tab>
              );
            })}
            {/* Tap de agregar */}
            <Tab tabClassName="tab-xbox" title="+" eventKey={"add-xbox"} />
          </Tabs>
        ) : (
          <ComponentError
            titulo={"Lista vacía"}
            accionVoid={() => abrirModal()}
            icono={"PlusSquare"}
          />
        )}
      </div>
      {/* MODAL */}
      <FormularioXboxs
        estadoModal={isEstadoModal}
        cerrarModal={cerrarModal}
        aumentarXbox={aumentarXbox}
      />
    </>
  );
};

export default ContenedorRentas;

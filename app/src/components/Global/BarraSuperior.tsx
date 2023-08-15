import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import { alertaSwal } from "../../functions/funcionesGlobales";
import { Spinner } from "react-bootstrap";
import { apiObtenerTotalesTablas } from "../../apis/apiAll";
import { RespuestaApi } from "../../apis/apiVariables";
import ComponenteReloj from "../oters/ComponenteReloj";

// * Props
interface Props {
  titulo: string;
}

//Todo,  Barra superior
const BarraSuperior: React.FC<Props> = (props) => {
  // * Variables
  const [isCargando, setCargando] = useState<boolean>(true);
  const [noXboxs, setNoXboxs] = useState<string | null>(null);
  const [noProductos, setNoProductos] = useState<string | null>(null);

  // * Obtener totales
  const obtenerTotales = async () => {
    try {
      setCargando(true);

      // Obtenemos
      const res: RespuestaApi = await apiObtenerTotalesTablas();

      // ? Error
      if (!res.estado) {
        throw new Error(
          res.detalles_error ?? "No se pudieron obtener los totales"
        );
      }

      // ? No llegaron los xboxs
      if (!res.noXboxs) {
        throw new Error("Los xboxs no llegaron correctamente");
      }

      // ? No llegaron los productos
      if (!res.noProductos) {
        throw new Error("Los productos no llegaron correctamente");
      }

      // Datos
      setNoXboxs(String(res.noXboxs));
      setNoProductos(String(res.noProductos));
    } catch (error: unknown) {
      alertaSwal("Error", String(error), "error");
    } finally {
      setCargando(false);
    }
  };

  // * Al cambiar
  useEffect(() => {
    obtenerTotales();
  }, [props]);

  return (
    <Navbar expand="lg" className="barra-superior">
      <Container className="justify-content-start">
        <div className="separador-vertical"></div>

        {/* Titulo */}
        <Navbar.Text>
          <strong className="text-white">{props.titulo}</strong>
        </Navbar.Text>

        <div className="separador-vertical"></div>
        <div className="separador-vertical">{"|"}</div>
        <div className="separador-vertical"></div>

        {/* Esta cargando */}
        {isCargando ? (
          <>
            {[0, 1, 2].map((i) => {
              return (
                <Navbar.Collapse key={i}>
                  <Spinner animation="border" size="sm" />
                </Navbar.Collapse>
              );
            })}
          </>
        ) : (
          <>
            <Navbar.Text>
              <strong className="text-white">{`Xboxs: ${
                noXboxs ?? "???"
              }`}</strong>
            </Navbar.Text>
            <div className="separador-vertical"></div>
            <Navbar.Text>
              <strong className="text-white">
                {`Productos: ${noProductos ?? "???"}`}
              </strong>
            </Navbar.Text>
          </>
        )}
      </Container>

      <Container className="justify-content-end">
        {/* Reloj */}
        <Navbar.Text>
          <ComponenteReloj zonaHoraria="America/Mexico_City" />
        </Navbar.Text>
      </Container>
    </Navbar>
  );
};

export default BarraSuperior;

import React from "react";
import RoutesController from "./routes/RoutesController";
import { Container } from "react-bootstrap";

// * Paginas
import { BrowserRouter } from "react-router-dom";
import PieDePagina from "./components/PieDePagina";

// * Estilos
import "./styles/_variables.scss";
import "./styles/global.scss";
import "./styles/pages.scss";
import "./styles/componentes.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import MenuPrincipal from "./components/MenuPrincipal";

// TODO, App
const App: React.FC = () => {
  return (
    <BrowserRouter>
      {/* Aplicación */}
      <div className="app">
        {/* Contenedor principal */}
        <Container className="contendor-principal">
          {/* Menu */}
          <MenuPrincipal />

          {/* Rutas */}
          <RoutesController />
        </Container>

        <PieDePagina />
      </div>
    </BrowserRouter>
  );
};

export default App;

import React from "react";
import RoutesController from "./routes/RoutesController";
import { Container } from "react-bootstrap";

// * Paginas
import { HashRouter as Router } from "react-router-dom";
import PieDePagina from "./components/global/PieDePagina";

// * Estilos
import "./styles/_variables.scss";
import "./styles/global.scss";
import "./styles/pages.scss";
import "./styles/componentes.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import "react-datepicker/dist/react-datepicker.css";
import MenuPrincipal from "./components/global/MenuPrincipal";

// TODO, App
const App: React.FC = () => {
  return (
    <Router>
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
    </Router>
  );
};

export default App;

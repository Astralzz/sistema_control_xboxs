import React from "react";
import RoutesController from "./routes/RoutesController";

// * Paginas
import { BrowserRouter } from "react-router-dom";
import BarraSuperior from "./components/BarraSuperior";
import PieDePagina from "./components/PieDePagina";

// * Estilos
import "./styles/_variables.scss";
import "./styles/global.scss";
import "./styles/componentes.scss";
import "bootstrap/dist/css/bootstrap.min.css";

// TODO, App
const App: React.FC = () => {
  return (
    <BrowserRouter>
      {/* Aplicación */}
      <div className="app">
        {/*  Barra superior */}
        <BarraSuperior />

        {/*  Rutas */}
        <RoutesController />

        {/*  Pie de pagina  */}
        <PieDePagina />
      </div>
    </BrowserRouter>
  );
};

export default App;

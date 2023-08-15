import React, { useState, useEffect } from "react";
import moment from "moment-timezone";
import "moment/locale/es"; // Configura el idioma local de Moment.js
import { Card } from "react-bootstrap";

// * Props
interface Props {
  zonaHoraria: string;
  isTitulo?: boolean;
  nombreClase?: string;
}

// Todo, Reloj
const ComponenteReloj: React.FC<Props> = ({
  zonaHoraria,
  isTitulo,
  nombreClase,
}) => {
  // * Variables
  const [currentTime, setCurrentTime] = useState(moment().tz(zonaHoraria));

  // *  Intervalo
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(moment().tz(zonaHoraria));
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [zonaHoraria]);

  // * Hora
  const formattedTime = currentTime.format("hh:mm:ss A");

  return (
    <div className={nombreClase ?? "reloj-barra"}>
      <Card.Body>
        {isTitulo && <Card.Title>Reloj ({zonaHoraria})</Card.Title>}
        <Card.Subtitle>{formattedTime}</Card.Subtitle>
      </Card.Body>
    </div>
  );
};

export default ComponenteReloj;

import React from "react";
import DatePicker from "react-datepicker";
import es from "date-fns/locale/es";
import moment from "moment";

// * Años
const anioActual = new Date().getFullYear();
const anios = Array.from(
  { length: anioActual - 1989 },
  (_, índice) => anioActual - índice
);

// * Meses
const meses: string[] = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

// * Props
interface Props {
  fechaSeleccionada: Date;
  setFechaSeleccionada: React.Dispatch<React.SetStateAction<Date>>;
  opcion: "MENSUAL" | "PERIODICA";
  estilo?: React.CSSProperties;
  nombreClase?: string;
}

// Todo, Componente para seleccionar fecha
const ComponenteSelectFecha: React.FC<Props> = ({
  fechaSeleccionada,
  setFechaSeleccionada,
  opcion,
  estilo = {
    margin: 10,
    display: "flex",
    justifyContent: "center",
  },
  nombreClase = "select-fecha-global",
}) => {
  // Es mensual
  if (opcion === "MENSUAL") {
    return (
      <DatePicker
        className={nombreClase}
        selected={fechaSeleccionada}
        onChange={(date) => setFechaSeleccionada(date as Date)}
        dateFormat="MM/yyyy"
        showMonthYearPicker
        locale={es}
      />
    );
  }

  // * Cambiar año
  const cambiarAnio = (value: string) => {
    setFechaSeleccionada((prevDate) => {
      const newDate = moment(prevDate).year(parseInt(value)).toDate();
      return newDate;
    });
  };

  // * Cambiar mes
  const cambiarMes = (value: string) => {
    setFechaSeleccionada((prevDate) => {
      const newDate = moment(prevDate).month(meses.indexOf(value)).toDate();
      return newDate;
    });
  };

  return (
    <DatePicker
      selected={fechaSeleccionada}
      onChange={(date) => setFechaSeleccionada(date as Date)}
      className={nombreClase}
      locale={es}
      // Cuadro de meses y años
      renderCustomHeader={() => (
        <div style={estilo}>
          {/* SeleccionarAño */}
          <select
            value={fechaSeleccionada.getFullYear()}
            onChange={(e) => cambiarAnio(e.target.value)}
          >
            {anios.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {/* Seleccionar Mes */}
          <select
            value={meses[fechaSeleccionada.getMonth()]}
            onChange={(e) => cambiarMes(e.target.value)}
          >
            {meses.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      )}
    />
  );
};

export default ComponenteSelectFecha;

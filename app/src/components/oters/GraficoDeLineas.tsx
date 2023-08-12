import React, { CSSProperties } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Brush,
  BrushProps,
  ResponsiveContainer,
} from "recharts";
import { CurveType } from "recharts/types/shape/Curve";
import { Margin } from "recharts/types/util/types";

// * Datos
export interface DatosGrafica {
  fecha: string;
  total: number;
}

// * Barra de zoom
interface BarraDeZoom extends BrushProps {
  color: string;
  alto: number;
}

// * Datos editable
interface DatosEditables {
  datos: any[];
  keyDatos: string;
  keyY: string;
}

// * Cuadro flotante
interface CuadroFlotante {
  isVisible: boolean;
  estilo?: CSSProperties;
}

// * Props
interface Props {
  datos: DatosGrafica[];
  datosEditables?: DatosEditables;
  ancho?: number | string;
  alto?: number;
  aspectRatio?: number;
  tipoDeCurva?: CurveType;
  colorDeLinea?: string;
  colorDeCuadricula?: string;
  margen?: Margin;
  barraDeZoom?: BarraDeZoom;
  colorDeFondo?: string;
  mostrarEtiquetasEjeX?: boolean;
  mostrarEtiquetasEjeY?: boolean;
  patronTrasoPunteado?: string;
  nombreDeClase?: string;
  cuadroFlotante?: CuadroFlotante;
  titulo?: string;
  descripcion?: string;
}

// Todo, Gráfica de lineas
const GraficoDeLineas: React.FC<Props> = (props) => {
  const {
    barraDeZoom,
    colorDeFondo,
    datosEditables,
    mostrarEtiquetasEjeX = true,
    mostrarEtiquetasEjeY = true,
    datos,
    ancho = "100%",
    alto = 300,
    aspectRatio = 0, //16 / 9,
    tipoDeCurva = "monotone",
    colorDeLinea = "#8884d8",
    colorDeCuadricula = "#ccc",
    patronTrasoPunteado = "5, 5",
    titulo,
    descripcion,
    nombreDeClase = "grafica-lineas-g",
    cuadroFlotante = { isVisible: true, estilo: { color: "black" } },
    margen = { top: 5, right: 20, bottom: 5, left: 0 },
    ...restProps
  } = props;

  return (
    <div
      style={{ background: colorDeFondo || "transparent" }}
      className={nombreDeClase}
    >
      {/* Título */}
      {titulo && <h4>{titulo}</h4>}
      {/* Descripción */}
      {descripcion && <p>{descripcion}</p>}

      {/* Contenedor responsivo */}
      <ResponsiveContainer width={ancho} height={alto} aspect={aspectRatio}>
        {/* Grafico */}
        <LineChart data={datos} margin={margen}>
          {/* Linea */}
          <Line
            type={tipoDeCurva}
            dataKey={datosEditables ? datosEditables.keyDatos : "total"}
            stroke={colorDeLinea}
          />

          {/* Cuadricula */}
          <CartesianGrid
            stroke={colorDeCuadricula}
            strokeDasharray={patronTrasoPunteado}
          />

          {/* Eje X */}
          {mostrarEtiquetasEjeX && (
            <XAxis
              dataKey={datosEditables ? datosEditables.keyDatos : "fecha"}
            />
          )}

          {/* Eje Y */}
          {mostrarEtiquetasEjeY && <YAxis />}

          {/* Cuadro flotante */}
          {cuadroFlotante.isVisible && (
            <Tooltip
              itemStyle={cuadroFlotante.estilo}
              labelStyle={{ display: "none" }}
              formatter={(value) => [`$${value}`]}
            />
          )}

          {/* Barra del zoom */}
          {barraDeZoom && (
            <Brush
              dataKey={datosEditables ? datosEditables.keyDatos : "fecha"}
              height={barraDeZoom?.alto}
              stroke={barraDeZoom?.color}
              {...restProps}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraficoDeLineas;

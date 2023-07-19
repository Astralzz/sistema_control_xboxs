import Swal, { SweetAlertIcon, SweetAlertResult } from "sweetalert2";

// * Variables de estilos
const colorFondo: string = "var(--color-fondo)";
const colorLetra: string = "var(--color-letra)";
const colorAceptar: string = "var(--color-confirmar)";
const colorCancelar: string = "var(--color-cancelar)";

// * Formatear fecha
export function formatearFecha(fecha: string): string | null {
  try {
    // * Creamos fecha
    const date = new Date(fecha);

    // * Obtenemos
    const dia = date.getDate();
    const mes = date.getMonth() + 1;
    const anio = date.getFullYear();

    // Formateamos
    const fechaFormateada = `${dia.toString().padStart(2, "0")}/${mes
      .toString()
      .padStart(2, "0")}/${anio}`;

    return fechaFormateada;

    // ! Error
  } catch (error) {
    return null;
  }
}

// * Formatear hora sin segundos
export function formatearHoraSinSegundos(hora: string): string | null {
  try {
    // Obtenemos
    const [horas, minutos] = hora.split(":");
    let horaFormateada = "";

    // ? Es menor a 12
    if (+horas < 12) {
      horaFormateada = `${horas}:${minutos} am`;
    } else {
      const horas12 = +horas % 12 || 12;
      horaFormateada = `${horas12}:${minutos} pm`;
    }

    return horaFormateada;

    // ! Error
  } catch (error) {
    return null;
  }
}

// * Formatear tiempo
export function formatearTiempo(t: number): string {
  // ? es 0
  if (t < 1) {
    return "00:00";
  }

  const minutos = Math.floor(t / 60);
  const segundos = t % 60;
  return `${minutos.toString().padStart(2, "0")}:${segundos
    .toString()
    .padStart(2, "0")}`;
}

// * Crear color claro
export function generarColorClaroAleatorio(opacidad: number): string {
  const r = Math.floor(Math.random() * 156) + 100;
  const g = Math.floor(Math.random() * 156) + 100;
  const b = Math.floor(Math.random() * 156) + 100;

  return `rgb(${r}, ${g}, ${b}, ${opacidad})`;
}

// * Crear color medio
export function generarColorMedioAleatorio(opacidad: number): string {
  const r = Math.floor(Math.random() * 100) + 50;
  const g = Math.floor(Math.random() * 100) + 50;
  const b = Math.floor(Math.random() * 100) + 50;

  return `rgb(${r}, ${g}, ${b}, ${opacidad})`;
}

// * Crear color oscuro
export function generarColorOscuroAleatorio(opacidad: number): string {
  const r = Math.floor(Math.random() * 100);
  const g = Math.floor(Math.random() * 100);
  const b = Math.floor(Math.random() * 100);

  return `rgb(${r}, ${g}, ${b}, ${opacidad})`;
}

// * Alerta swal
export const alertaSwal = (
  titulo: string,
  texto: string,
  icono: SweetAlertIcon
) =>
  Swal.fire({
    background: colorFondo,
    color: colorLetra,
    confirmButtonColor: colorAceptar,
    cancelButtonColor: colorCancelar,
    title: titulo,
    text: texto,
    icon: icono,
  });

// * Confirmación swal
export const confirmacionSwal = (
  titulo: string,
  texto: string,
  textoConfirmar: string
): Promise<boolean> =>
  new Promise((resolve) => {
    Swal.fire({
      title: titulo,
      text: texto,
      icon: "warning",
      showCancelButton: true,
      background: colorFondo,
      color: colorLetra,
      confirmButtonColor: colorAceptar,
      cancelButtonColor: colorCancelar,
      confirmButtonText: textoConfirmar,
      cancelButtonText: "Cancelar",
      // * Resultado
    }).then((result) => resolve(result.isConfirmed));
  });

// * Tiempo manual
type estadoSeleccion = "seleccionado" | "aumentado" | "disminuido";
export const seleccionarTiempoManual = (
  texSeleccion: estadoSeleccion
): Promise<number> =>
  new Promise((resolve) => {
    Swal.fire({
      text: `Escribe los minutos necesarios`,
      input: "number",
      background: colorFondo,
      color: colorLetra,
      inputAttributes: {
        min: "1",
        max: "1440",
        step: "1",
      },
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      confirmButtonColor: colorAceptar,
      cancelButtonColor: colorCancelar,
      allowOutsideClick: false,
      allowEscapeKey: false,
      icon: "question",
    })
      // * Éxito
      .then((resultado: SweetAlertResult<any>) => {
        // ? Confirmado
        if (resultado.isConfirmed) {
          // Convertimos
          const minutos = parseInt(resultado.value);

          // ? Se puede formatear y es menor a 0
          if (isNaN(minutos) || minutos < 0) {
            alertaSwal(
              "Error!",
              "Por favor, ingresa un número válido.",
              "error"
            );

            resolve(-1);
            return;
          }

          // ? Son 24 horas
          if (minutos > 1440) {
            alertaSwal("Error!", "No puedes poner mas de 24 horas", "error");
            resolve(-1);
            return;
          }

          // * Éxito
          alertaSwal(
            "Éxito!",
            `Se han ${texSeleccion} ${minutos} minutos.`,
            "success"
          );

          resolve(minutos);
          return;
        }

        resolve(-1);
      });
  });

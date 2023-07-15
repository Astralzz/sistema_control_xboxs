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

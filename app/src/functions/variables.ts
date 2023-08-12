// Todo. ER

// * Para nombre
export const regexNombre: RegExp =
  /^(?!\s)([a-zA-ZñÑáéíóúÁÉÍÓÚ_-\s\d]{2,60})(?<!\s)$/;

// * Para descripcion
export const regexDescripcion: RegExp =
  /^([\w\d][\w\d\sZñÑáéíóúÁÉÍÓÚ.,:;!?+_*¡¿/()[\]{}-]{0,699})?$/;

// * Para Numeros enteros
export const regexNumerosEnteros: RegExp = /^[0-9]{1,5}$/;

// * Para Numeros decimales
export const regexNumerosDecimales: RegExp =
  /^(?:\d{1,5}(?:\.\d{1,2})?|\.\d{1,2})$/;

// sin 0 ->   /^(?:[1-9]\d{0,4}(?:\.\d{1,2})?|\.\d{1,2})$/;

// Todo, Tipos de datos
export type FiltroFechasGrafica = "periodica" | "semanal" | "mensual" | "anual";

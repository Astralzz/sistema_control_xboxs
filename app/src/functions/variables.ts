// * ER
export const regexBuscarTitulo: RegExp =
  /^(?!\s)([a-zA-ZñÑáéíóúÁÉÍÓÚ_-\s\d]{2,60})(?<!\s)$/;

export const regexNumerosEnteros: RegExp = /^[0-9]{1,5}$/;

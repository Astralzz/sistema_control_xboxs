type nameCookiesType = "p60m" | "p60m2c" | "p30m" | "p30m2c";

// * Guardar cookie
export function guardarCookie(nombre: nameCookiesType, value: string) {
  document.cookie = nombre + "=" + value + ";path=/";
}

// * Obtener cookie
export function obtenerCookie(nombre: nameCookiesType): string | null {
  const cookieName = nombre + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(";");

  // Recorremos
  for (let i = 0; i < cookieArray.length; i++) {
    let cookie = cookieArray[i];
    while (cookie.charAt(0) === " ") {
      cookie = cookie.substring(1);
    }

    // ? Existe
    if (cookie.indexOf(cookieName) === 0) {
      return cookie.substring(cookieName.length, cookie.length);
    }
  }
  return null;
}

// * Eliminar cookie
export function eliminarCookie(name: string) {
  document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

/**
 * Utilidades internas para reubicar el cursor de un input después de
 * formatear su contenido. No forman parte de la API pública: se exportan
 * solo para poder testearlas de forma aislada.
 */

const SIGNIFICANT_CHAR = /[0-9kK]/;

/**
 * Cuenta caracteres significativos (dígitos y `K`) en los primeros
 * `length` caracteres de `value`.
 *
 * La posición absoluta del cursor cambia cuando el formateo inserta puntos
 * y guion, pero la cantidad de caracteres significativos a su izquierda no.
 * Esa es la referencia estable para reubicarlo.
 */
export function countSignificantChars(value: string, length: number): number {
  let count = 0;
  const limit = Math.min(length, value.length);
  for (let i = 0; i < limit; i++) {
    if (SIGNIFICANT_CHAR.test(value[i])) {
      count++;
    }
  }
  return count;
}

/**
 * Devuelve el índice de `value` que deja exactamente `count` caracteres
 * significativos a su izquierda.
 */
export function indexAfterSignificantChars(value: string, count: number): number {
  if (count <= 0) {
    return 0;
  }
  let seen = 0;
  for (let i = 0; i < value.length; i++) {
    if (SIGNIFICANT_CHAR.test(value[i])) {
      seen++;
      if (seen === count) {
        return i + 1;
      }
    }
  }
  return value.length;
}

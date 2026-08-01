import { Injectable } from '@angular/core';

/**
 * Valor aceptado en la frontera pública de la librería.
 *
 * Los controles de formulario entregan `any`: un `<input type="number">` o un
 * `setValue(12345678)` producen un `number`, y un control vacío produce `null`.
 * El tipo refleja esa realidad en vez de mentir con `string`.
 */
export type RutInput = string | number | null | undefined;

@Injectable({ providedIn: 'root' })
export class RutService {
  /**
   * Largo mínimo de un RUT ya limpio: al menos un dígito de cuerpo más el
   * dígito verificador. RUTs bajos como `1-9` o `999-7` son válidos.
   */
  private static readonly MIN_LENGTH = 2;

  /**
   * Normaliza un RUT: deja solo dígitos y `K`, elimina ceros a la izquierda
   * y pasa a mayúscula. Devuelve `''` si la entrada no es utilizable.
   */
  public rutClean(rut: RutInput): string {
    const raw = RutService.normalize(rut);
    if (raw === null) {
      return '';
    }
    return raw
      .replace(/[^0-9kK]+/g, '')
      .replace(/^0+/, '')
      .toUpperCase();
  }

  /**
   * Valida un RUT chileno con el algoritmo módulo 11.
   * Devuelve siempre `boolean`, nunca lanza.
   */
  public rutValidate(rut: RutInput): boolean {
    const cleaned = this.rutClean(rut);
    if (cleaned.length < RutService.MIN_LENGTH) {
      return false;
    }
    const body = cleaned.slice(0, -1);
    // La `K` solo es válida como dígito verificador, nunca dentro del cuerpo.
    if (!/^\d+$/.test(body)) {
      return false;
    }
    return RutService.checkDigit(body) === cleaned.slice(-1);
  }

  /**
   * Formatea un RUT como `12.345.678-5`.
   * Devuelve siempre `string`, nunca lanza.
   */
  public rutFormat(rut: RutInput): string {
    const cleaned = this.rutClean(rut);
    if (cleaned.length <= 1) {
      return cleaned;
    }
    let result = `${cleaned.slice(-4, -1)}-${cleaned.slice(-1)}`;
    for (let i = 4; i < cleaned.length; i += 3) {
      result = `${cleaned.slice(-3 - i, -i)}.${result}`;
    }
    return result;
  }

  private static normalize(value: RutInput): string | null {
    if (typeof value === 'string') {
      return value;
    }
    // Un número no puede transportar una `K`, pero sí un RUT numérico completo.
    if (typeof value === 'number' && Number.isFinite(value)) {
      return String(value);
    }
    return null;
  }

  /**
   * Calcula el dígito verificador módulo 11 recorriendo el cuerpo como texto.
   * Trabajar sobre el string evita el desbordamiento de precisión que produce
   * convertir cuerpos largos a `number`.
   */
  private static checkDigit(body: string): string {
    let sum = 0;
    let multiplier = 2;
    for (let i = body.length - 1; i >= 0; i--) {
      sum += Number(body[i]) * multiplier;
      multiplier = multiplier === 7 ? 2 : multiplier + 1;
    }
    const remainder = 11 - (sum % 11);
    if (remainder === 11) {
      return '0';
    }
    if (remainder === 10) {
      return 'K';
    }
    return String(remainder);
  }
}

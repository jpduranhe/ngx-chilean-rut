import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RutService {

  /**
   * Clean a Chilean RUT
   * @param rut
   */
  public  rutClean(rut: string) {
    return rut
      .replace(/[^0-9kK]+/g, '')
      .replace(/^0+/, '')
      .toUpperCase();
  }

  /**
   * Validate a Chilean RUT
   * @param rut
   */
  public  rutValidate(rut: string) {
    const _rut: string = this.rutClean(rut);
    if(_rut.length < 6 ) return false;
    let rutDigits: number = parseInt(_rut.slice(0, -1), 10);
    let m: number = 0;
    let s: number = 1;

    while (rutDigits > 0) {
      s = (s + rutDigits % 10 * (9 - m++ % 6)) % 11;
      rutDigits = Math.floor(rutDigits / 10);
    }
    const checkDigit: string = (s > 0) ? String((s - 1)) : 'K';
    return (checkDigit === _rut.slice(-1));
  }

  /**
   * Format a Chilean RUT
   * @param rut
   * @returns {string}
   */
  public  rutFormat(rut: string): string {
    const _rut: string = this.rutClean(rut);
    if (_rut.length <= 1) {
      return _rut;
    }
    let result: string = `${_rut.slice(-4, -1)}-${_rut.substring(_rut.length - 1)}`;
    for (let i: number = 4; i < _rut.length; i += 3) {
      result = `${_rut.slice(-3 - i, -i)}.${result}`;
    }
    return result;
  }
}

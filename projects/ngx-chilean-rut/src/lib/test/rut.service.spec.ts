import { TestBed } from '@angular/core/testing';

import { RutService } from '../service/rut.service';

describe('RutService', () => {
  let service: RutService;

  beforeEach(() => {
    service = TestBed.inject(RutService);
  });

  it('se resuelve sin providers explícitos gracias a providedIn: root', () => {
    expect(service).toBeTruthy();
  });

  describe('rutClean', () => {
    it('quita puntos y guion', () => {
      expect(service.rutClean('12.345.678-5')).toEqual('123456785');
    });

    it('elimina ceros a la izquierda', () => {
      expect(service.rutClean('012.345.678-5')).toEqual('123456785');
    });

    it('pasa la K a mayúscula', () => {
      expect(service.rutClean('1.000.005-k')).toEqual('1000005K');
    });

    it('devuelve string vacío para entradas no utilizables', () => {
      expect(service.rutClean(null)).toEqual('');
      expect(service.rutClean(undefined)).toEqual('');
      expect(service.rutClean('')).toEqual('');
    });
  });

  describe('rutValidate', () => {
    it('acepta un RUT válido', () => {
      expect(service.rutValidate('12.345.678-5')).toBe(true);
    });

    it('rechaza un dígito verificador incorrecto', () => {
      expect(service.rutValidate('12.345.678-3')).toBe(false);
    });

    it('acepta dígito verificador K en mayúscula y minúscula', () => {
      expect(service.rutValidate('1.000.005-K')).toBe(true);
      expect(service.rutValidate('1.000.005-k')).toBe(true);
    });

    it('acepta RUTs bajos, que son matemáticamente válidos', () => {
      expect(service.rutValidate('1-9')).toBe(true);
      expect(service.rutValidate('25-6')).toBe(true);
      expect(service.rutValidate('999-7')).toBe(true);
      expect(service.rutValidate('1.234-3')).toBe(true);
    });

    it('acepta un number sin lanzar', () => {
      expect(service.rutValidate(123456785)).toBe(true);
      expect(service.rutValidate(123456783)).toBe(false);
    });

    it('rechaza una K dentro del cuerpo', () => {
      expect(service.rutValidate('12K45678-5')).toBe(false);
    });

    it('devuelve false, nunca string ni excepción, ante entradas inválidas', () => {
      for (const input of ['', '   ', 'abc', '........-', null, undefined]) {
        expect(service.rutValidate(input)).toBe(false);
      }
    });

    it('no pierde precisión con cuerpos muy largos', () => {
      expect(service.rutValidate('99999999999999999999-5')).toBe(false);
    });
  });

  describe('rutFormat', () => {
    it('formatea un RUT completo', () => {
      expect(service.rutFormat('123456785')).toEqual('12.345.678-5');
    });

    it('formatea RUTs cortos', () => {
      expect(service.rutFormat('19')).toEqual('1-9');
      expect(service.rutFormat('1234')).toEqual('123-4');
    });

    it('es idempotente', () => {
      expect(service.rutFormat(service.rutFormat('123456785'))).toEqual('12.345.678-5');
    });

    it('acepta un number sin lanzar', () => {
      expect(service.rutFormat(123456785)).toEqual('12.345.678-5');
    });

    it('devuelve string vacío ante entradas no utilizables', () => {
      expect(service.rutFormat(null)).toEqual('');
      expect(service.rutFormat(undefined)).toEqual('');
      expect(service.rutFormat('')).toEqual('');
    });
  });
});

import { FormControl, Validators } from '@angular/forms';

import { countSignificantChars, indexAfterSignificantChars } from '../directive/caret';
import { cleanRut, formatRut, validateRut } from '../service/rut.service';
import { rutValidator } from '../validation/rut.reactive-form.validation';

describe('funciones puras de RUT', () => {
  // Sin TestBed a propósito: estas funciones no dependen de Angular.

  describe('cleanRut', () => {
    it('quita puntos, guion y ceros a la izquierda', () => {
      expect(cleanRut('012.345.678-5')).toEqual('123456785');
    });

    it('devuelve vacío para entradas no utilizables', () => {
      expect(cleanRut(null)).toEqual('');
      expect(cleanRut(undefined)).toEqual('');
    });
  });

  describe('validateRut', () => {
    it('valida con módulo 11', () => {
      expect(validateRut('12.345.678-5')).toBe(true);
      expect(validateRut('12.345.678-3')).toBe(false);
    });

    it('acepta number y null sin lanzar', () => {
      expect(validateRut(123456785)).toBe(true);
      expect(validateRut(null)).toBe(false);
    });
  });

  describe('formatRut', () => {
    it('formatea y es idempotente', () => {
      expect(formatRut('123456785')).toEqual('12.345.678-5');
      expect(formatRut('12.345.678-5')).toEqual('12.345.678-5');
    });
  });

  describe('countSignificantChars', () => {
    it('cuenta solo dígitos y K, ignorando puntos y guion', () => {
      // Los primeros 6 caracteres son '12.345': cinco dígitos y un punto.
      expect(countSignificantChars('12.345.678-5', 6)).toEqual(5);
      expect(countSignificantChars('12.345.678-5', 0)).toEqual(0);
      expect(countSignificantChars('1.000.005-K', 11)).toEqual(8);
    });

    it('no se pasa del largo del texto', () => {
      expect(countSignificantChars('12', 99)).toEqual(2);
    });
  });

  describe('indexAfterSignificantChars', () => {
    it('ubica el índice que deja N significativos a la izquierda', () => {
      // '12.345.678-5' → 4 significativos son '1','2','3','4' y el '4'
      // está en el índice 4, así que el cursor va en 5.
      expect(indexAfterSignificantChars('12.345.678-5', 4)).toEqual(5);
    });

    it('devuelve 0 para cero o menos', () => {
      expect(indexAfterSignificantChars('12.345.678-5', 0)).toEqual(0);
    });

    it('devuelve el largo total si pide más de los que hay', () => {
      expect(indexAfterSignificantChars('12', 99)).toEqual(2);
    });
  });
});

describe('rutValidator (ValidatorFn funcional)', () => {
  it('funciona sin contexto de inyección', () => {
    expect(rutValidator(new FormControl('12.345.678-5'))).toBeNull();
    expect(rutValidator(new FormControl('12.345.678-3'))).toEqual({
      rutInvalid: true,
    });
  });

  it('se combina con otros validadores en un FormControl', () => {
    const control = new FormControl('', [Validators.required, rutValidator]);

    expect(control.hasError('required')).toBe(true);

    control.setValue('12.345.678-3');
    expect(control.hasError('rutInvalid')).toBe(true);

    control.setValue('12.345.678-5');
    expect(control.valid).toBe(true);
  });
});

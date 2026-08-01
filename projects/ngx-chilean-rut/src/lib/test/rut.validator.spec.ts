import { TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';

import { RutValidator } from '../validation/rut.reactive-form.validation';

describe('RutValidator', () => {
  let validator: RutValidator;

  beforeEach(() => {
    validator = TestBed.inject(RutValidator);
  });

  it('se resuelve sin providers explícitos gracias a providedIn: root', () => {
    expect(validator).toBeTruthy();
  });

  it('acepta un RUT válido', () => {
    expect(validator.validate(new FormControl('12.345.678-5'))).toBeNull();
  });

  it('rechaza un RUT con dígito verificador incorrecto', () => {
    expect(validator.validate(new FormControl('12.345.678-3'))).toEqual({
      rutInvalid: true,
    });
  });

  it('acepta un RUT con dígito verificador K', () => {
    expect(validator.validate(new FormControl('1.000.005-K'))).toBeNull();
  });

  it('no lanza cuando el control entrega un number (input type="number")', () => {
    expect(() => validator.validate(new FormControl(123456785))).not.toThrow();
    expect(validator.validate(new FormControl(123456785))).toBeNull();
  });

  it('rechaza un control vacío o nulo sin lanzar', () => {
    expect(validator.validate(new FormControl(''))).toEqual({ rutInvalid: true });
    expect(validator.validate(new FormControl(null))).toEqual({ rutInvalid: true });
  });

  it('funciona conectado como ValidatorFn de un FormControl', () => {
    const control = new FormControl('12.345.678-5', validator.validate);

    expect(control.valid).toBe(true);

    control.setValue('12.345.678-3');
    expect(control.hasError('rutInvalid')).toBe(true);
  });
});

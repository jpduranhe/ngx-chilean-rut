import { inject, Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

import { RutService, validateRut } from '../service/rut.service';

/**
 * Validador de RUT para Reactive Forms.
 *
 * Es una `ValidatorFn` corriente: no necesita inyección ni contexto de
 * injector, así que se puede usar en cualquier parte.
 *
 * ```typescript
 * const rut = new FormControl('', [Validators.required, rutValidator]);
 * ```
 *
 * Marca el control con el error `rutInvalid` cuando el RUT no supera la
 * validación módulo 11.
 */
export const rutValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => (validateRut(control.value) ? null : { rutInvalid: true });

/**
 * Versión inyectable del validador.
 *
 * Se mantiene para el código que ya la usa y para quienes prefieren
 * sustituirla en tests. Si no necesitas inyección, usa `rutValidator`.
 */
@Injectable({ providedIn: 'root' })
export class RutValidator {
  private readonly rutService = inject(RutService);

  /**
   * Validador para Reactive Forms. Marca el control con `rutInvalid`
   * cuando el RUT no supera la validación módulo 11.
   */
  public readonly validate = (control: AbstractControl): ValidationErrors | null =>
    this.rutService.rutValidate(control.value) ? null : { rutInvalid: true };
}

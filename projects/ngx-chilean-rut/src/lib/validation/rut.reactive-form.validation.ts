import { inject, Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';

import { RutService } from '../service/rut.service';

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


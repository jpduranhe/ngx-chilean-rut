import { inject, Pipe, PipeTransform } from '@angular/core';

import { RutInput, RutService } from '../service/rut.service';

/**
 * Formatea un RUT chileno para mostrarlo: `{{ '123456785' | rut }}` → `12.345.678-5`.
 * Es idempotente: aplicarlo sobre un RUT ya formateado devuelve lo mismo.
 */
@Pipe({ name: 'rut' })
export class RutPipe implements PipeTransform {
  private readonly rutService = inject(RutService);

  public transform(value: RutInput): string {
    return this.rutService.rutFormat(value);
  }
}

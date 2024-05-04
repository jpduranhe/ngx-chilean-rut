import { inject, Pipe, PipeTransform } from '@angular/core';

import { RutService } from '../service/rut.service';

@Pipe({
  name: 'rut',
  standalone: true,
})
export class RutPipe implements PipeTransform {
  private rutService = inject(RutService);
  constructor() {}
  transform(value: string): string {

    return this.rutService.rutFormat(value);
  }
}

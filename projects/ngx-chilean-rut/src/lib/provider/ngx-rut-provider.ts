import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

import { RutService } from '../service/rut.service';
import { RutValidator } from '../validation/rut.reactive-form.validation';

/**
 * Registra los servicios de ngx-chilean-rut en el injector de entorno.
 *
 * **Opcional.** `RutService` y `RutValidator` ya están declarados con
 * `providedIn: 'root'`, así que funcionan sin llamar a esta función. Úsala
 * solo si necesitas acotar las instancias a un injector específico (por
 * ejemplo, una ruta lazy) o sobrescribirlas en tests.
 *
 * Nota: las directivas y pipes NO se registran por DI. `RutDirective` y
 * `RutPipe` se consumen agregándolos al arreglo `imports` del componente.
 */
export function provideNgxRut(): EnvironmentProviders {
  return makeEnvironmentProviders([RutService, RutValidator]);
}

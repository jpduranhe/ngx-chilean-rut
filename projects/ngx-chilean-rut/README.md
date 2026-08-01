# ngx-chilean-rut

Validación y formateo de RUT chileno para Angular: un servicio, un pipe, una directiva y un validador de Reactive Forms.

- Sin dependencias más allá de Angular
- Componentes standalone: se importan directo, sin NgModule
- Validación módulo 11 completa, incluido dígito verificador `K`
- Nunca lanza excepciones: acepta `string`, `number`, `null` y `undefined`

## Requisitos

| ngx-chilean-rut | Angular |
| --------------- | ------- |
| `1.x`           | `>= 22` |
| `0.0.x`         | `21`    |

## Instalación

```bash
npm install ngx-chilean-rut
```

No hace falta ningún `provide*`: los servicios están declarados con
`providedIn: 'root'` y funcionan apenas los inyectas.

## Uso

### Pipe — formatear para mostrar

```typescript
import { Component } from '@angular/core';
import { RutPipe } from 'ngx-chilean-rut';

@Component({
  selector: 'app-root',
  imports: [RutPipe],
  template: `<p>{{ '123456785' | rut }}</p>`, // 12.345.678-5
})
export class AppComponent {}
```

Es idempotente: aplicarlo sobre un RUT ya formateado devuelve lo mismo.

### Directiva — formatear mientras se escribe

Implementa `ControlValueAccessor`, así que el valor mostrado y el del
formulario nunca se desincronizan.

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RutDirective } from 'ngx-chilean-rut';

@Component({
  selector: 'app-root',
  imports: [RutDirective, FormsModule],
  template: `<input type="text" ngxRut [(ngModel)]="rut" />`,
})
export class AppComponent {
  protected rut = '';
}
```

El valor que llega al modelo es el RUT **formateado** (`12.345.678-5`). Si
necesitas el valor sin puntos ni guion, usa `RutService.rutClean()`.

### Validador — Reactive Forms

`rutValidator` es una `ValidatorFn` corriente: no necesita inyección ni
contexto de injector, así que se usa en cualquier parte.

```typescript
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { RutDirective, rutValidator } from 'ngx-chilean-rut';

@Component({
  selector: 'app-root',
  imports: [RutDirective, ReactiveFormsModule],
  template: `
    <input type="text" ngxRut [formControl]="rut" />

    @if (rut.touched && rut.hasError('required')) {
      <p role="alert">El campo es requerido.</p>
    }
    @if (rut.touched && rut.hasError('rutInvalid')) {
      <p role="alert">El RUT ingresado no es válido.</p>
    }
  `,
})
export class AppComponent {
  protected readonly rut = new FormControl('', [Validators.required, rutValidator]);
}
```

Cuando el RUT no pasa la validación, el control queda con el error
`rutInvalid`.

Si prefieres inyectar una dependencia — por ejemplo para sustituirla en un
test — también existe la clase `RutValidator`, con el mismo comportamiento:

```typescript
private readonly validator = inject(RutValidator);
protected readonly rut = new FormControl('', this.validator.validate);
```

### Funciones puras — sin Angular de por medio

`cleanRut`, `formatRut` y `validateRut` no dependen de Angular ni de la
inyección de dependencias. Sirven en un componente, en un guard, en Node o
en un test sin `TestBed`.

```typescript
import { cleanRut, formatRut, validateRut } from 'ngx-chilean-rut';

cleanRut('12.345.678-5');    // '123456785'
formatRut('123456785');      // '12.345.678-5'
validateRut('12.345.678-5'); // true
validateRut('12.345.678-3'); // false
validateRut(null);           // false — no lanza
validateRut(123456785);      // true — acepta number
```

### Servicio — la misma API, inyectable

```typescript
import { inject } from '@angular/core';
import { RutService } from 'ngx-chilean-rut';

const rutService = inject(RutService);

rutService.rutClean('12.345.678-5');    // '123456785'
rutService.rutFormat('123456785');      // '12.345.678-5'
rutService.rutValidate('12.345.678-5'); // true
```

`RutService` delega en las funciones puras. Usa la clase si necesitas
inyección; usa las funciones si no.

## API

| Símbolo                     | Descripción                                                         |
| --------------------------- | ------------------------------------------------------------------- |
| `cleanRut(v)`               | Quita puntos, guion y ceros a la izquierda. Devuelve `string`.       |
| `formatRut(v)`              | Formatea como `12.345.678-5`. Devuelve `string`.                     |
| `validateRut(v)`            | Valida con módulo 11. Devuelve `boolean`.                            |
| `rutValidator`              | `ValidatorFn` que marca el error `rutInvalid`. Sin DI.               |
| `RutPipe`                   | Pipe `rut` para formatear en plantillas.                             |
| `RutDirective`              | Formatea un `<input>` al escribir. Selectores `[ngxRut]` y `[rut]`.  |
| `RutService`                | Envoltorio inyectable de las funciones puras.                        |
| `RutValidator.validate`     | Versión inyectable de `rutValidator`.                                |
| `provideNgxRut()`           | Opcional. Solo para acotar instancias a un injector específico.      |
| `RutInput`                  | `string \| number \| null \| undefined`.                             |

Todas las funciones aceptan `RutInput` y ninguna lanza excepciones.

## Notas de la versión 1.0.0

Cambios que pueden afectarte al subir desde `0.0.x`:

- **Requiere Angular 22.** Las versiones `0.0.x` soportan Angular 21.
- La directiva ahora implementa `ControlValueAccessor`. Si usabas `[(ngModel)]`
  o `formControlName`, el modelo y el input dejan de desincronizarse.
- El selector se restringe a elementos `<input>`. Aplicarlo a otro elemento
  antes no hacía nada útil.
- `rutValidate()` devuelve siempre `boolean`. Antes devolvía `''` para entradas
  vacías o nulas.
- `rutValidate()` y `rutFormat()` aceptan `number` sin lanzar. Antes reventaban
  con `TypeError`.
- Se aceptan RUTs bajos válidos (`1-9`, `999-7`). Antes se rechazaban por una
  guardia de largo mínimo incorrecta.
- `provideNgxRut()` ya no registra la directiva, porque las directivas no se
  resuelven por inyección de dependencias.

Además, sin romper nada:

- Se exportan las funciones puras `cleanRut`, `formatRut` y `validateRut`, que
  funcionan sin Angular.
- Se exporta `rutValidator`, una `ValidatorFn` que no necesita inyección.
- La directiva conserva la posición del cursor al formatear.

El selector legado `[rut]` sigue funcionando. `[ngxRut]` es el recomendado para
código nuevo.

## Limitación conocida

La directiva conserva la posición del cursor al formatear: si editas en medio
del RUT, el cursor se queda donde estaba, aunque el formateo haya insertado o
quitado puntos.

Queda un caso sin resolver, común a cualquier máscara de este tipo: borrar un
separador — un punto o el guion — no hace nada visible, porque el formateo lo
vuelve a insertar de inmediato. Para eliminar un dígito hay que pararse sobre
el dígito.

## Licencia

MIT — [Juan Pablo Duran Herrera](https://www.jpduranhe.cl)

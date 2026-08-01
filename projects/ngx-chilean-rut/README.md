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

```typescript
import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { RutDirective, RutValidator } from 'ngx-chilean-rut';

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
  private readonly rutValidator = inject(RutValidator);

  protected readonly rut = new FormControl('', [
    Validators.required,
    this.rutValidator.validate,
  ]);
}
```

Cuando el RUT no pasa la validación, el control queda con el error
`rutInvalid`.

### Servicio — uso programático

```typescript
import { inject } from '@angular/core';
import { RutService } from 'ngx-chilean-rut';

const rutService = inject(RutService);

rutService.rutClean('12.345.678-5');    // '123456785'
rutService.rutFormat('123456785');      // '12.345.678-5'
rutService.rutValidate('12.345.678-5'); // true
rutService.rutValidate('12.345.678-3'); // false
rutService.rutValidate(null);           // false — no lanza
```

## API

| Símbolo                     | Descripción                                                         |
| --------------------------- | ------------------------------------------------------------------- |
| `RutService.rutClean(v)`    | Quita puntos, guion y ceros a la izquierda. Devuelve `string`.       |
| `RutService.rutFormat(v)`   | Formatea como `12.345.678-5`. Devuelve `string`.                     |
| `RutService.rutValidate(v)` | Valida con módulo 11. Devuelve `boolean`.                            |
| `RutPipe`                   | Pipe `rut` para formatear en plantillas.                             |
| `RutDirective`              | Formatea un `<input>` al escribir. Selectores `[ngxRut]` y `[rut]`.  |
| `RutValidator.validate`     | `ValidatorFn` que marca el error `rutInvalid`.                       |
| `provideNgxRut()`           | Opcional. Solo para acotar instancias a un injector específico.      |
| `RutInput`                  | `string \| number \| null \| undefined`.                             |

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

El selector legado `[rut]` sigue funcionando. `[ngxRut]` es el recomendado para
código nuevo.

## Limitación conocida

La directiva reescribe el valor del `<input>` en cada evento `input`, lo que
mueve el cursor al final. Escribir al final del campo — el caso normal —
funciona bien; editar en medio del texto reposiciona el cursor.

## Licencia

MIT — [Juan Pablo Duran Herrera](https://www.jpduranhe.cl)

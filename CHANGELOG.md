# Changelog

Todos los cambios relevantes de este proyecto se documentan acá.

El formato sigue [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/)
y el versionado sigue [SemVer](https://semver.org/lang/es/).

## [1.0.0]

Primera versión estable. Requiere **Angular 22**.

### Cómo migrar desde `0.0.x`

| Si tu código… | Ahora… |
| --- | --- |
| Está en Angular 21 | Debe subir a Angular 22. La `0.0.18` sigue disponible para v21. |
| Lee `control.value` esperando `12.345.678-5` | Recibe `123456785`. Usa `formatRut(value)` al enviar si tu API espera puntos y guion. |
| Usa `<div rut>` o similar | El selector solo aplica a `<input>`. Antes en otros elementos no hacía nada útil. |
| Llama `provideNgxRut()` | Sigue funcionando, pero ya no hace falta: los servicios son `providedIn: 'root'`. |
| Usa `[rut]` en el template | Sigue funcionando. `[ngxRut]` es el recomendado para código nuevo. |
| Guarda el retorno de `rutValidate()` | Ahora es siempre `boolean`. Antes devolvía `''` para entradas vacías o nulas. |

### Corregido

- **`RutService` y `RutValidator` no tenían el decorador `@Injectable`.**
  Solo funcionaban si el consumidor llamaba `provideNgxRut()`; en cualquier
  otro caso el resultado era un `NullInjectorError`. Ahora se declaran con
  `providedIn: 'root'`.
- **`rutValidate()` y `rutFormat()` lanzaban `TypeError` al recibir un
  `number`.** Un `<input type="number">` o un `setValue(12345678)` bastaba
  para romper la validación. Ahora aceptan `string`, `number`, `null` y
  `undefined`, y nunca lanzan.
- **Se rechazaban RUTs bajos válidos** como `1-9`, `999-7` o `1.234-3`, por
  una guardia de largo mínimo incorrecta.
- **`rutValidate()` devolvía `''`** para entrada vacía o nula, con tipo de
  retorno `string | boolean`. Ahora devuelve `boolean` siempre.
- **El cursor saltaba al final** al escribir, porque la directiva reescribía
  el `value` del input en cada evento. Editar en medio del RUT era
  inutilizable.
- **La suite de tests estaba completamente rota** y lo estaba desde la
  `0.0.10`. La librería se publicó unas ocho veces con los tests caídos.
- **`peerDependencies` declaraba `@angular/common`**, que no se usa, y omitía
  `@angular/forms`, que sí se importa.

### Cambiado

- **BREAKING** — Requiere Angular 22. Las versiones `0.0.x` soportan Angular 21.
- **BREAKING** — `RutDirective` implementa `ControlValueAccessor`. El `<input>`
  muestra el RUT formateado (`12.345.678-5`) y al formulario llega el valor
  canónico limpio (`123456785`). Antes ambos llevaban el formateado.
- **BREAKING** — El selector se restringe a elementos `<input>`.
- **BREAKING** — `provideNgxRut()` ya no registra `RutDirective`: las
  directivas las resuelve el compilador de plantillas, no la inyección de
  dependencias.
- El cálculo del dígito verificador ya no usa `parseInt`, lo que elimina la
  pérdida de precisión con entradas largas. La equivalencia con la
  implementación anterior se verificó en 104.665 entradas.
- `@HostListener` se reemplaza por el objeto `host` del decorador, y la
  escritura en el DOM pasa por `Renderer2`.

### Agregado

- `cleanRut()`, `formatRut()` y `validateRut()`: funciones puras, sin
  dependencia de Angular. Sirven en un componente, en un guard, en Node o en
  un test sin `TestBed`.
- `rutValidator`: una `ValidatorFn` que no necesita contexto de inyección.
  `new FormControl('', [Validators.required, rutValidator])`.
- Selector prefijado `[ngxRut]`, además del legado `[rut]`.
- Tipo `RutInput` exportado.
- `setDisabledState` en la directiva: el input refleja el estado deshabilitado
  del control.

### Interno

- Toolchain migrado a `@angular/build`: `ng-packagr` para el build y
  `unit-test` con Vitest para los tests. Se eliminan Analog y el target de
  Karma que estaba muerto.
- TypeScript fijado en `~6.0.3`, que es lo que exige el `peerDependency` de
  `@angular/compiler-cli`.
- ESLint con `angular-eslint`.
- Umbrales de cobertura exigidos en CI (95/90/95/95).
- CI que corre lint, tests y build en cada PR, y que bloquea la publicación
  si algo falla.
- Dependabot para npm y GitHub Actions.

### Limitación conocida

Borrar un separador — un punto o el guion — no tiene efecto visible, porque
el formateo lo reinserta de inmediato. Para eliminar un dígito hay que
pararse sobre el dígito. Es un comportamiento común a las máscaras de este
tipo.

## [0.0.18] y anteriores

Sin changelog. Ver el
[historial de commits](https://github.com/jpduranhe/ngx-chilean-rut/commits/master).

[1.0.0]: https://github.com/jpduranhe/ngx-chilean-rut/releases/tag/v1.0.0
[0.0.18]: https://github.com/jpduranhe/ngx-chilean-rut/releases/tag/v0.0.18

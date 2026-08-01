# ngx-chilean-rut

Monorepo de la librería [`ngx-chilean-rut`](https://www.npmjs.com/package/ngx-chilean-rut):
validación y formateo de RUT chileno para Angular.

**La documentación de uso está en [projects/ngx-chilean-rut/README.md](projects/ngx-chilean-rut/README.md)**
— es la que se publica junto al paquete en npm.

Ejemplo en vivo: [StackBlitz](https://stackblitz.com/~/github.com/jpduranhe/test-ngx-chilean-rut)

## Desarrollo

Requiere Node `>= 22.22.3` y pnpm 10.

```bash
pnpm install

pnpm run test    # suite de tests (Vitest vía @angular/build:unit-test)
pnpm run lint    # ESLint + angular-eslint
pnpm run build   # compila la librería a dist/ngx-chilean-rut
```

## Estructura

```
projects/ngx-chilean-rut/
├── src/lib/
│   ├── service/      RutService — clean, format, validate (módulo 11)
│   ├── pipe/         RutPipe — formateo en plantillas
│   ├── directive/    RutDirective — formateo en <input> + ControlValueAccessor
│   ├── validation/   RutValidator — ValidatorFn para Reactive Forms
│   ├── provider/     provideNgxRut() — opcional
│   └── test/         specs
└── src/public-api.ts API pública publicada
```

## Publicación

La publicación a npm la dispara el workflow
[`.github/workflows/publish.yml`](.github/workflows/publish.yml) al crear un
release o al pushear un tag `v*`. El workflow corre **lint y tests antes de
publicar**: si alguno falla, no se publica nada.

## Licencia

MIT — [Juan Pablo Duran Herrera](https://www.jpduranhe.cl)

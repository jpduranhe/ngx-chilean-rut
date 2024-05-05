# NgxRut

Esta librería permite validar en ReactiveForm y formatear RUT chilenos en Angular.



##Instalacion

```typescript
    npm install ngx-chilean-rut;
```

## Uso


```typescript
    import { Component } from '@angular/core';

    @Component({
        selector: 'app-root',
        standalone: true,
        imports: [RutPipe, RutDirective],
        templateUrl: './app.component.html',
        styleUrls: ['./app.component.css']
      template: `
        <input type="text" rut [(ngModel)]="textRut" />
        <h1>  {{textRut | rut}}</h1>
      `
    })
    export class AppComponent {
        textRut: string;
    }
```


Ejemplo de uso [Link](https://stackblitz.com/~/github.com/jpduranhe/test-ngx-chilean-rut)

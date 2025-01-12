# NgxRut

Esta librería permite validar en ReactiveForm y formatear RUT chilenos en Angular.



##Instalacion

```typescript
    npm install ngx-chilean-rut;
```

## Uso
```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    ...
    provideNgxRutProvider(),
  ]};
```

```typescript
    import { Component } from '@angular/core';
    import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import 'zone.js';

import { RutValidator, RutDirective, RutPipe } from 'ngx-chilean-rut';

    @Component({
  selector: 'app-root',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, RutPipe, RutDirective],
  template: `
    <div class="container">
  <div class="row">
   <h1>Rut Tester</h1>
    <div class="col-md-12">
      <form [formGroup]="formulario" class="form-horizontal">
        <input class="form-control" rut formControlName="rut" name="rut" type="text" placeholder="" />
      </form>

      @if(formulario.get('rut')!.invalid){

        

          @if(formulario.get('rut')!.errors?.['required']){
            <p style="color: #ff0000;">
            <span>El campo es requerido</span>
            </p>
          }
          @if(formulario.get('rut')!.errors?.['rutInvalid']){
            <p style="color: #ff0000;">
            <span >El rut no es válido</span>
            </p>
          }
       
      }

      </div>
      <div class="col-md-12">
        <p> Pipe rut: {{formulario.get('rut')!.value | rut}}</p>
      </div>

  </div>

</div>
  `,
})
export class App {
  public formulario: FormGroup;
  public rut2 = '111111111';
  private rutValidator= inject(RutValidator);
  constructor(private formBuilder: FormBuilder) {
    this.formulario = this.formBuilder.group({
      rut: ['', [Validators.required, this.rutValidator.validate]],
    });
  }
}
```


Ejemplo de uso [Link](https://stackblitz.com/~/github.com/jpduranhe/test-ngx-chilean-rut)

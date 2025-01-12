import {inject} from "@angular/core";
import {RutService} from "../service/rut.service";
import {AbstractControl, ValidatorFn} from "@angular/forms";


export class RutValidator {
  private rutService= inject(RutService) ;

   validate= (control: AbstractControl): { [key: string]: any } | null => {
    return this.rutService.rutValidate(control.value)  ? null : { rutInvalid: true };
  };
}


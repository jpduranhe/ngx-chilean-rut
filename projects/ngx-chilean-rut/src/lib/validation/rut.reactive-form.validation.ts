import {inject} from "@angular/core";
import {RutService} from "../service/rut.service";
import {AbstractControl, ValidatorFn} from "@angular/forms";

export function rutValid(): ValidatorFn {
  const rutService= inject(RutService) ;
  return (control: AbstractControl): { [key: string]: any } | null => {
    return rutService.rutValidate(control.value)  ? null : { rutInvalid: true };
  };
}

import {Directive, ElementRef, HostListener, inject, Output, signal, WritableSignal} from '@angular/core';
import {RutService} from "../service/rut.service";

@Directive({
  selector: '[rut]',
  standalone: true
})
export class RutDirective {
  private elem= inject(ElementRef) ;
  private rutService= inject(RutService) ;

  @HostListener('focus')
  public onFocus() {
    this.elem.nativeElement.value = this.rutService.rutClean(this.elem.nativeElement.value);
  }
  @HostListener('blur')
  public onBlur() {
    this.elem.nativeElement.value = this.rutService.rutFormat(this.elem.nativeElement.value) || '';
  }




}

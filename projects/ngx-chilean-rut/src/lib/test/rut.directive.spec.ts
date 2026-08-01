import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { RutDirective } from '../directive/rut.directive';

@Component({
  template: `<input type="text" rut />`,
  imports: [RutDirective],
})
class PlainHostComponent {}

@Component({
  template: `<input type="text" ngxRut [formControl]="control" />`,
  imports: [RutDirective, ReactiveFormsModule],
})
class ReactiveHostComponent {
  public readonly control = new FormControl('123456785');
}

function inputOf<T>(fixture: ComponentFixture<T>): HTMLInputElement {
  return fixture.debugElement.query(By.directive(RutDirective)).nativeElement;
}

describe('RutDirective', () => {
  describe('sin formulario, con el selector legado [rut]', () => {
    let fixture: ComponentFixture<PlainHostComponent>;
    let input: HTMLInputElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(PlainHostComponent);
      fixture.detectChanges();
      input = inputOf(fixture);
    });

    it('se instancia', () => {
      const debugEl = fixture.debugElement.query(By.directive(RutDirective));
      expect(debugEl.injector.get(RutDirective)).toBeTruthy();
    });

    it('limpia el RUT al enfocar', () => {
      input.value = '12.345.678-5';
      input.dispatchEvent(new Event('focus'));
      expect(input.value).toEqual('123456785');
    });

    it('formatea el RUT al salir del campo', () => {
      input.value = '123456785';
      input.dispatchEvent(new Event('blur'));
      expect(input.value).toEqual('12.345.678-5');
    });

    it('formatea mientras se escribe', () => {
      input.value = '123456785';
      input.dispatchEvent(new Event('input'));
      expect(input.value).toEqual('12.345.678-5');
    });
  });

  describe('conectado a un Reactive Form con [ngxRut]', () => {
    let fixture: ComponentFixture<ReactiveHostComponent>;
    let component: ReactiveHostComponent;
    let input: HTMLInputElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(ReactiveHostComponent);
      fixture.detectChanges();
      component = fixture.componentInstance;
      input = inputOf(fixture);
    });

    it('formatea el valor inicial que entrega el formulario', () => {
      expect(input.value).toEqual('12.345.678-5');
    });

    it('propaga al control el valor formateado, sin desincronizarse del input', () => {
      input.value = '123456789';
      input.dispatchEvent(new Event('input'));

      expect(input.value).toEqual('12.345.678-9');
      expect(component.control.value).toEqual('12.345.678-9');
    });

    it('refleja en el input los cambios que vienen del formulario', () => {
      component.control.setValue('99999999');
      fixture.detectChanges();

      expect(input.value).toEqual('9.999.999-9');
    });

    it('marca el control como tocado al salir del campo', () => {
      expect(component.control.touched).toBe(false);

      input.dispatchEvent(new Event('blur'));

      expect(component.control.touched).toBe(true);
    });

    it('deshabilita el input cuando el control se deshabilita', () => {
      component.control.disable();
      fixture.detectChanges();

      expect(input.disabled).toBe(true);
    });
  });

  describe('posición del cursor al formatear', () => {
    let fixture: ComponentFixture<PlainHostComponent>;
    let input: HTMLInputElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(PlainHostComponent);
      fixture.detectChanges();
      input = inputOf(fixture);
    });

    function type(value: string, caret: number): number | null {
      input.value = value;
      input.setSelectionRange(caret, caret);
      input.dispatchEvent(new Event('input'));
      return input.selectionStart;
    }

    it('deja el cursor al final cuando se escribe al final', () => {
      // '1234' → '123-4': el cursor estaba tras 4 significativos.
      expect(type('1234', 4)).toEqual('123-4'.length);
    });

    it('conserva el cursor al escribir en medio del texto', () => {
      // '12345678' con el cursor tras el 4º dígito. Al formatear a
      // '1.234.567-8' el cursor debe seguir tras ese mismo dígito.
      const position = type('12345678', 4);

      expect(input.value).toEqual('1.234.567-8');
      expect(position).toEqual(5);
      expect(input.value.slice(0, position ?? 0)).toEqual('1.234');
    });

    it('mantiene el cursor al inicio', () => {
      expect(type('12345678', 0)).toEqual(0);
    });
  });
});

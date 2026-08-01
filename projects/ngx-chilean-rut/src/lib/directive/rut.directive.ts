import { Directive, ElementRef, forwardRef, inject, Renderer2 } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { formatRut, RutInput, RutService } from '../service/rut.service';
import { countSignificantChars, indexAfterSignificantChars } from './caret';

type OnChangeFn = (value: string) => void;
type OnTouchedFn = () => void;

/**
 * Formatea un RUT chileno mientras se escribe en un `<input>`.
 *
 * Implementa `ControlValueAccessor`, así que el valor mostrado y el valor del
 * formulario nunca se desincronizan: funciona igual con `[(ngModel)]`, con
 * `formControlName` o sin formulario alguno.
 *
 * El valor propagado al formulario es el RUT **formateado** (`12.345.678-5`),
 * igual que en versiones anteriores. Usa `RutService.rutClean()` si necesitas
 * el valor sin puntos ni guion.
 *
 * El selector `[rut]` se mantiene por compatibilidad; `[ngxRut]` es el
 * prefijado y el recomendado para código nuevo.
 */
@Directive({
  // El selector sin prefijo `rut` se mantiene deliberadamente para no romper a
  // quienes ya lo usan. `ngxRut` es el que cumple la convención de prefijo.
  selector: 'input[rut], input[ngxRut]',
  host: {
    '(focus)': 'onFocus()',
    '(input)': 'onInput()',
    '(blur)': 'onBlur()',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RutDirective),
      multi: true,
    },
  ],
})
export class RutDirective implements ControlValueAccessor {
  private readonly element = inject<ElementRef<HTMLInputElement>>(ElementRef);
  private readonly renderer = inject(Renderer2);
  private readonly rutService = inject(RutService);

  private notifyChange: OnChangeFn = () => undefined;
  private notifyTouched: OnTouchedFn = () => undefined;

  /** Muestra el RUT sin formato mientras el campo está en edición. */
  public onFocus(): void {
    this.render(this.rutService.rutClean(this.currentValue));
  }

  /**
   * Formatea a medida que se escribe, conservando la posición del cursor.
   *
   * Reescribir el `value` mueve el cursor al final, así que hay que
   * reubicarlo. La posición absoluta no sirve como referencia porque al
   * insertar puntos y guion se corre; lo que se mantiene estable es cuántos
   * caracteres significativos quedan a la izquierda del cursor.
   */
  public onInput(): void {
    const element = this.element.nativeElement;
    const previousValue = element.value;
    const caret = element.selectionStart;
    const formatted = formatRut(previousValue);

    this.propagate(formatted);

    // `selectionStart` es null en inputs que no soportan selección
    // (por ejemplo `type="number"`); ahí no hay cursor que reubicar.
    if (caret !== null) {
      const significant = countSignificantChars(previousValue, caret);
      const position = indexAfterSignificantChars(formatted, significant);
      element.setSelectionRange(position, position);
    }
  }

  /** Formatea al salir del campo y marca el control como tocado. */
  public onBlur(): void {
    this.propagate(this.rutService.rutFormat(this.currentValue));
    this.notifyTouched();
  }

  public writeValue(value: RutInput): void {
    this.render(this.rutService.rutFormat(value));
  }

  public registerOnChange(fn: OnChangeFn): void {
    this.notifyChange = fn;
  }

  public registerOnTouched(fn: OnTouchedFn): void {
    this.notifyTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.renderer.setProperty(this.element.nativeElement, 'disabled', isDisabled);
  }

  private get currentValue(): string {
    return this.element.nativeElement.value;
  }

  /**
   * Escribe en el input a través de `Renderer2` en vez de tocar
   * `nativeElement` directamente, para no depender del DOM del navegador
   * (SSR, web workers).
   */
  private render(value: string): void {
    this.renderer.setProperty(this.element.nativeElement, 'value', value);
  }

  private propagate(value: string): void {
    this.render(value);
    this.notifyChange(value);
  }
}

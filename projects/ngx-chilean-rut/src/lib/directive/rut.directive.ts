import { Directive, ElementRef, forwardRef, inject, Renderer2 } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { cleanRut, formatRut, RutInput, RutService } from '../service/rut.service';
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
 * Separa vista y modelo, que es para lo que existe `ControlValueAccessor`:
 * el `<input>` muestra el RUT **formateado** (`12.345.678-5`) y al formulario
 * llega el valor **canónico y limpio** (`123456785`), que es el que conviene
 * enviar y persistir. Usa `formatRut()` si necesitas mostrarlo en otra parte.
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

  /**
   * Muestra el RUT formateado y propaga al formulario el valor limpio.
   * La vista y el modelo cambian siempre en el mismo paso.
   */
  private propagate(formatted: string): void {
    this.render(formatted);
    this.notifyChange(cleanRut(formatted));
  }
}

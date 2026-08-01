import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RutPipe } from '../pipe/rut.pipe';

@Component({
  template: `{{ value | rut }}`,
  imports: [RutPipe],
})
class HostComponent {
  public value: string | number | null = '123456785';
}

describe('RutPipe', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HostComponent);
  });

  function render(value: string | number | null): string {
    fixture.componentInstance.value = value;
    fixture.detectChanges();
    return (fixture.nativeElement as HTMLElement).textContent ?? '';
  }

  it('formatea un RUT en la plantilla', () => {
    expect(render('123456785')).toEqual('12.345.678-5');
  });

  it('es idempotente sobre un RUT ya formateado', () => {
    expect(render('12.345.678-5')).toEqual('12.345.678-5');
  });

  it('acepta un number', () => {
    expect(render(123456785)).toEqual('12.345.678-5');
  });

  it('devuelve vacío para null sin lanzar', () => {
    expect(render(null)).toEqual('');
  });
});

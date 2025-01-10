import {Component, ElementRef} from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RutDirective } from '../directive/rut.directive';
import { RutService } from '../service/rut.service';

@Component({
    template: `<input type="text" rut>`,
    imports: [
        RutDirective
    ]
})
 class TestComponent {}

describe('RutDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let inputEl: HTMLInputElement;
  let rutDirective: RutDirective;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RutService]
    });
  });

  it('should create an instance', (): void => {
    TestBed.runInInjectionContext((): void => {
      fixture = TestBed.createComponent(TestComponent);
      const debugEl = fixture.debugElement.query(By.directive(RutDirective));
      inputEl = debugEl.nativeElement;
      rutDirective = debugEl.injector.get(RutDirective);
      expect(rutDirective).toBeTruthy();
    });
  });

  it('should clean rut on focus', () => {
    TestBed.runInInjectionContext((): void => {
      fixture = TestBed.createComponent(TestComponent);
      const debugEl = fixture.debugElement.query(By.directive(RutDirective));
      inputEl = debugEl.nativeElement;
      inputEl.value = '12.345.678-5';
      inputEl.dispatchEvent(new Event('focus'));
      expect(inputEl.value).toEqual('123456785');
    });
  });
  it('should clean rut on blur', () => {
    TestBed.runInInjectionContext((): void => {
      fixture = TestBed.createComponent(TestComponent);
      const debugEl = fixture.debugElement.query(By.directive(RutDirective));
      inputEl = debugEl.nativeElement;
      inputEl.value = '123456785';
      inputEl.dispatchEvent(new Event('blur'));
      expect(inputEl.value).toEqual('12.345.678-5');
    });
  });
});

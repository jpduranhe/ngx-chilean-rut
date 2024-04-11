import { RutPipe } from '../pipe/rut.pipe';
import {RutService} from "../service/rut.service";
import {TestBed} from "@angular/core/testing";
import {RutDirective} from "../directive/rut.directive";

describe('RutPipe', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [RutService]});
  });
  it('create an instance', () => {

    TestBed.runInInjectionContext((): void => {
      const pipe = new RutPipe();
      expect(pipe).toBeTruthy();
    });

  });
  it('should format rut', () => {

    TestBed.runInInjectionContext((): void => {
      const pipe = new RutPipe();
      expect(pipe.transform('123456785')).toEqual('12.345.678-5');
    });
  });
});

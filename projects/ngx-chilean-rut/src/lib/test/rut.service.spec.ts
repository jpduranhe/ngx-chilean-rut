import { TestBed } from '@angular/core/testing';

import { RutService } from '../service/rut.service';

import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

describe('RutService', () => {
  let service: RutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should clean rut', () => {
    expect(service.rutClean('12.345.678-5')).toEqual('123456785');
  });

  it('should validate a valid rut', () => {
    expect(service.rutValidate('12.345.678-5')).toBeTruthy();
  });
  it('should validate a invalid rut', () => {
    expect(service.rutValidate('12.345.678-3')).toBeFalsy()
  });
  it('should format rut', () => {
    expect(service.rutFormat('123456785')).toEqual('12.345.678-5');
  });
});

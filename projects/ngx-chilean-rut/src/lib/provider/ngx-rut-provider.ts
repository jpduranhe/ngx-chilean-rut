import { EnvironmentProviders, makeEnvironmentProviders } from "@angular/core";
import { RutDirective } from "../directive/rut.directive";
import { RutService } from "../service/rut.service";
import { RutValidator } from "../validation/rut.reactive-form.validation";

export function provideNgxRut(): EnvironmentProviders {
  return makeEnvironmentProviders([

    {
      provide: RutDirective,
      useClass: RutDirective
    },
    {
      provide: RutService,
      useClass: RutService
    },

    {
      provide: RutValidator,
      useClass: RutValidator
    },

  ]);
}

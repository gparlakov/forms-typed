import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { ProdVersionComponent, ShowFormControlComponent } from './show-form-control.component';

@NgModule({
  imports: [CommonModule],
  declarations: [ShowFormControlComponent],
  exports: [ShowFormControlComponent],
})
export class DevModule {
}

@NgModule({
  imports: [CommonModule],
  declarations: [ProdVersionComponent],
  exports: [ProdVersionComponent],
})
export class ProdModule {
}

@NgModule({
  imports: [CommonModule],
})
export class ShowFormControlModule {
  static for(env: 'prod' | 'dev'): ModuleWithProviders<ShowFormControlModule> {
    return env === 'prod' ?
      {
        ngModule: ProdModule
      } :
      {
        ngModule: DevModule
      };
  }

  // to encourage correct use of module - throw if it's instantiated. It's useless if not imported via the .for() static method
  constructor() {
    // tslint:disable-next-line: max-line-length
    throw new Error('Please use static method for. i.e. ShowFormControlModule.for(`prod`) or ShowFormControlModule.for(environment.production ? `prod` : `dev`)')
  }
}



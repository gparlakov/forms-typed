
import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { ShowFormControlComponent } from './show-form-control.component';
import { Disable } from './show-form-control';

@NgModule({
    imports: [CommonModule],
    declarations: [ShowFormControlComponent],
    exports: [ShowFormControlComponent],
    providers: [{ provide: Disable, useValue: true }]
})
export class ShowFormControlModule {
    static for(env: 'prod' | 'dev'): ModuleWithProviders<ShowFormControlModule> {
        return env === 'prod' ?
            {
                ngModule: ShowFormControlModule
            } :
            {
                ngModule: ShowFormControlModule,
                providers: [{ provide: Disable, useValue: false }]
            };
    }
}

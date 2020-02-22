import { FormGroup, AbstractControl, FormArray, Validators, FormControl } from '@angular/forms';

export type Methods = keyof Pick<AbstractControl, 'markAsDirty' | 'markAsTouched' | 'updateValueAndValidity' | 'disable' | 'enable'>;

export function forEachControlIn(form: FormGroup | FormArray) {
  const controls: AbstractControl[] = Array.isArray(form.controls)
    ? form.controls
    : Object.getOwnPropertyNames(form.controls).map(name => (form as FormGroup).controls[name]);

  const composer = {
    call(...methods: Methods[]) {
      if (controls != null && Array.isArray(controls)) {
        controls.forEach(c => {
          methods.forEach(m => {
            if (c[m] && typeof c[m] === 'function') {
              (c[m] as any)();
            }
          });
        });
      }
      return composer;
    },
    markAsDirtySimultaneouslyWith(c: AbstractControl) {
      if (c != null) {
        const markAsDirtyOriginal = c.markAsDirty.bind(c);
        c.markAsDirty = () => {
          markAsDirtyOriginal();
          composer.call('markAsDirty');
        };
      }
      return composer;
    },
    markAsTouchedSimultaneouslyWith(c: AbstractControl) {
      if (c != null) {
        const markAsTouchedOriginal = c.markAsTouched.bind(c);
        c.markAsTouched = () => {
          markAsTouchedOriginal();
          composer.call('markAsTouched');
        };
      }
      return composer;
    },
    addValidatorsTo(ctrl: AbstractControl) {
      if (ctrl != null) {
        ctrl.validator = Validators.compose([
          ctrl.validator,
          () => {
            // could overwrite some errors - but we only need it to know the "parent" form is valid or not
            const errors = controls.reduce((e, next) => ({ ...e, ...next.errors }), {});

            return controls.some(c => c.errors != null) ? errors : null;
          }
        ]);
      }
      return composer;
    }
  };

  return composer;
}

export function typedFormGroup<K>(controls: { [key in keyof K]: AbstractControl }) {
  return new FormGroup(controls) as FormGroup & { controls: { [Key in keyof typeof controls]: AbstractControl } };
}

// tslint:disable-next-line:interface-over-type-literal
export type Model = {
  name: string;
  email: string;
};

const f = typedFormGroup<Model>({ name: new FormControl(), email: new FormControl() });

import { FormGroup, AbstractControl, FormArray, Validators, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';

export type Methods = keyof Pick<
  AbstractControl,
  | 'markAsDirty'
  | 'markAsTouched'
  | 'updateValueAndValidity'
  | 'disable'
  | 'enable'
  | 'markAsUntouched'
  | 'markAsPristine'
  | 'markAsPending'
>;

// tslint:disable-next-line:interface-over-type-literal
type FormGroupLike = {
  controls: { [key: string]: AbstractControl };
};
// tslint:disable-next-line:interface-over-type-literal
type FormArrayLike = {
  controls: AbstractControl[];
};

export function forEachControlIn(form: FormGroupLike | FormArrayLike) {
  const controls: AbstractControl[] =
    form != null && form.controls != null
      ? Array.isArray(form.controls)
        ? form.controls
        : Object.getOwnPropertyNames(form.controls).map(name => (form as FormGroupLike).controls[name])
      : [];

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
        const markAsPristineOriginal = c.markAsPristine.bind(c);
        c.markAsPristine = () => {
          markAsPristineOriginal();
          composer.call('markAsPristine');
        };
      }
      return composer;
    },
    markAsTouchedSimultaneouslyWith(c: AbstractControl, comingFromBelow?: () => boolean) {
      if (c != null) {
        const markAsTouchedOriginal = c.markAsTouched.bind(c);
        c.markAsTouched = () => {
          markAsTouchedOriginal();
          if (!comingFromBelow || !comingFromBelow()) {
            composer.call('markAsTouched');
          }
        };
        const markAsUntouchedOriginal = c.markAsUntouched.bind(c);
        c.markAsUntouched = () => {
          markAsUntouchedOriginal();
          composer.call('markAsUntouched');
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

export function typedFormGroup<K>(
  controls: { [key in keyof K]: AbstractControl }
): {
  controls: { [Key in keyof typeof controls]: AbstractControl };
  valueChanges: Observable<K>;
  statusChanges: Observable<'VALID' | 'INVALID' | 'PENDING' | 'DISABLED'>;
} & Omit<FormGroup, 'valueChanges' | 'controls' | 'statusChanges'> {
  return new FormGroup(controls) as any;
}

export type TypedFormControl<K> = {
  valueChanges: Observable<K>;
  statusChanges: Observable<'VALID' | 'INVALID' | 'PENDING' | 'DISABLED'>;
} & Omit<AbstractControl, 'valueChanges' | 'statusChanges'>;

// // tslint:disable-next-line:interface-over-type-literal
// export type Model = {
//   name: string;
//   email: string;
// };

// const f = typedFormGroup<Model>({ name: new FormControl(), email: new FormControl() });
// f.valueChanges.subscribe(v => console.log(v));
// console.log(f.controls.email);

// const f1 = new FormGroup({ t: new FormControl() });
// console.log(f1.controls.any.value);
// f1.valueChanges.subscribe(v => console.log(v));

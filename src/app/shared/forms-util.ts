import { FormGroup, AbstractControl, Validators, FormControl, ValidatorFn, AsyncValidatorFn } from '@angular/forms';
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

          // catch the case where we have a control that is form array/group - so for each of the children call methods
          if ((c as any).controls != null) {
            forEachControlIn((c as any).controls).call(...methods);
          }
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

export interface FormEventOptions {
  emitEvent?: boolean;
  onlySelf?: boolean;
}
export interface TypedFormGroup<K>
  extends Omit<FormGroup, 'valueChanges' | 'controls' | 'statusChanges' | 'patchValue' | 'setValue'> {
  controls: { [Key in keyof K]: TypedFormControl<K[Key]> };
  valueChanges: Observable<K>;
  statusChanges: Observable<'VALID' | 'INVALID' | 'PENDING' | 'DISABLED'>;
  patchValue: (v: Partial<K>, options?: FormEventOptions) => void;
  setValue: (v: K, options?: FormEventOptions) => void;
}

export function typedFormGroup<K>(controls: { [key in keyof K]: TypedFormControl<K[key]> }): TypedFormGroup<K> {
  return new FormGroup(controls) as any;
}

export interface TypedFormControl<K> extends AbstractControl {
  valueChanges: Observable<K>;
  statusChanges: Observable<'VALID' | 'INVALID' | 'PENDING' | 'DISABLED'>;
  patchValue: (v: Partial<K>, options?: FormEventOptions) => void;
  setValue: (v: K, options?: FormEventOptions) => void;
}

export function typedFormControl<T>(
  v?: T,
  validators?: ValidatorFn,
  asyncValidators?: AsyncValidatorFn
): TypedFormControl<T> {
  return new FormControl(v, validators, asyncValidators);
}

// tslint:disable-next-line:interface-over-type-literal
export type Model = {
  name: string;
  email: string;
};

const f = typedFormGroup<Model>({ name: new FormControl(), email: new FormControl() });
f.valueChanges.subscribe(v => console.log(v));
console.log(f.controls.email);

const f1 = new FormGroup({ t: new FormControl() });
// console.log(f1.controls.any.value); // will break runtime
// f1.valueChanges.subscribe(v => console.log(v));

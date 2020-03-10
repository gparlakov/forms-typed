import {
  FormGroup,
  AbstractControl,
  Validators,
  FormControl,
  ValidatorFn,
  AsyncValidatorFn,
  FormArray,
  AbstractControlOptions
} from '@angular/forms';
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

interface FormGroupLike {
  controls: { [key: string]: AbstractControl };
}

/**
 * Does an aggregate action on a form's controls.
 *
 * @param form the form to whose controls we want to influence
 *
 * For example we want to call `markAsTouched` on each control in a form, for visualizing validation purposes.
 * @example
 * const form = new FormGroup({name: ..., email: ..., address: ..., ...});
 *
 * forEachControlIn(form).call('markAsTouched') - will iterate over all controls and call that method
 */
export function forEachControlIn(form: FormGroup | FormArray | TypedFormGroup<any> | TypedFormArray<any>) {
  const controls: AbstractControl[] =
    form != null && form.controls != null
      ? Array.isArray(form.controls)
        ? form.controls
        : Object.getOwnPropertyNames(form.controls).map(name => (form as FormGroupLike).controls[name])
      : [];

  const composer = {
    /**
     * Enumerate which methods to call.
     * @param methods which methods to call - as typed string enum
     *
     * @example
     *
     * forEachControlIn(form).call('markAsPristine', 'markAsTouched', 'disable')
     */
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
            forEachControlIn(c as FormArray | FormGroup | TypedFormGroup<any> | TypedFormArray<any>).call(...methods);
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
    markAsTouchedSimultaneouslyWith(c: AbstractControl, touchIsChildInitiated?: () => boolean) {
      if (c != null) {
        const markAsTouchedOriginal = c.markAsTouched.bind(c);
        c.markAsTouched = () => {
          markAsTouchedOriginal();
          if (!touchIsChildInitiated || !touchIsChildInitiated()) {
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
    /**
     * Get the errors in the controls from our form and append their errors to the `form` (in forEachControlIn(form) form)
     * @param ctrl the control that should be invalid if on of our controls is
     */
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

/**
 * Type encapsulating the Angular Form options:
 * `emitEvent` - do we emit event;
 * `onlySelf` - do we bubble up to parent
 */
export interface FormEventOptions {
  emitEvent?: boolean;
  onlySelf?: boolean;
}

/**
 * A type wrapper around the reset value. It could be partial of the type of the form. Or even describe which form fields are to be disabled
 */
export type ResetValue<K> = Partial<{ [key in keyof K]: K[key] | { value: K[key]; disabled: boolean } }>;


/**
 * Typed form control is an `AbstractControl` with strong typed properties and methods. Can be created using `typedFormControl` function
 *
 * @example
 * const c = typedFormControl<string>(): TypedFormControl<string>;
 * c.valueChanges // Observable<string>
 * c.patchValue('s') // expects string
 * c.patchValue(1) //  COMPILE TIME! type error!
 */
export interface TypedFormControl<K> extends FormControl, AbstractControl {
  valueChanges: Observable<K>;
  statusChanges: Observable<'VALID' | 'INVALID' | 'PENDING' | 'DISABLED'>;
  patchValue: (v: Partial<K>, options?: FormEventOptions) => void;
  setValue: (v: K, options?: FormEventOptions) => void;
  value: K;
  reset: (value?: ResetValue<K>, opts?: FormEventOptions) => void;
}
/**
 * A helper function to create a `TypedFormControl`. It only calls the constructor of FormControl, but **strongly types** the result.
 * @param v the value to initialize our `TypedFormControl` with - same as in `new FormControl(v, validators, asyncValidators)`
 * @param validators validators - same as in new `FormControl(v, validators, asyncValidators)`
 * @param asyncValidators async validators - same as in `new FormControl(v, validators, asyncValidators)`
 *
 * @example
 * const c = typedFormControl<string>(): TypedFormControl<string>;
 * c.valueChanges // Observable<string>
 * c.patchValue('s') // expects string
 * c.patchValue(1) //  COMPILE TIME! type error!
 */
export function typedFormControl<T>(
  v?: T,
  validators?: ValidatorFn,
  asyncValidators?: AsyncValidatorFn
): TypedFormControl<T> {
  return new FormControl(v, validators, asyncValidators);
}

/**
 * Typed form control is an `FormArray` with strong typed properties and methods. Can be created using `typedFormArray` function
 *
 * @example
 * const c = typedFormArray<string>([typedFormControl('of type string')]): TypedFormArray<string[], string>;
 * c.valueChanges // Observable<string[]>
 * c.patchValue(['s']) // expects string[]
 * c.patchValue(1) //  COMPILE TIME! type error!
 */
export interface TypedFormArray<K extends Array<T> = any[], T = any> extends FormArray {
  valueChanges: Observable<K>;
  statusChanges: Observable<'VALID' | 'INVALID' | 'PENDING' | 'DISABLED'>;
  patchValue: (v: K, options?: FormEventOptions) => void;
  setValue: (v: K, options?: FormEventOptions) => void;
  controls: Array<TypedFormControl<T>>;
  push: (control: TypedFormControl<T>) => void;
  insert: (index: number, control: TypedFormControl<T>) => void;
  at: (index: number) => TypedFormControl<T>;
  setControl: (index: number, control: TypedFormControl<T>) => void;
  value: K;
}
/**
 * A helper function to create a `TypedFormArray`. It only calls the constructor of FormArray, but **strongly types** the result.
 * @param v the value to initialize our `TypedFormArray` with - same as in `new TypedFormArray(v, validators, asyncValidators)`
 * @param validators validators - same as in new `TypedFormArray(v, validators, asyncValidators)`
 * @param asyncValidators async validators - same as in `new TypedFormArray(v, validators, asyncValidators)`
 *
 * @example
 * const c = typedFormArray<string>([typedFormControl('of type string')]): TypedFormArray<string[], string>;
 * c.valueChanges // Observable<string[]>
 * c.patchValue(['s']) // expects string[]
 * c.patchValue(1) //  COMPILE TIME! type error!
 */
export function typedFormArray<K extends Array<T> = any[], T = any>(
  controls: Array<TypedFormControl<T>>,
  validatorOrOptions?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
  asyncValidators?: AsyncValidatorFn | AsyncValidatorFn[] | null
): TypedFormArray<K, T> {
  return new FormArray(controls, validatorOrOptions, asyncValidators) as any;
}

export type Controls<K> =
  | TypedControlsIn<K>
  | {
      [k in keyof K]: K[k] extends Array<infer T>
        ? TypedFormControl<K[k]> | TypedFormGroup<K[k]> | TypedFormArray<K[k], T>
        : TypedFormControl<K[k]> | TypedFormGroup<K[k]>
    };

/**
 * This is a strongly typed thin wrapper type around `FormGroup`.
 * Can be created using the `typedFormGroup` function
 */
export interface TypedFormGroup<K, C extends Controls<K> = TypedControlsIn<K>> extends FormGroup, TypedFormControl<K> {
  controls: C;
  valueChanges: Observable<K>;
  statusChanges: Observable<'VALID' | 'INVALID' | 'PENDING' | 'DISABLED'>;
  patchValue: (v: Partial<K>, options?: FormEventOptions) => void;
  setValue: (v: K, options?: FormEventOptions) => void;
  value: K;
  setControl: <T extends keyof C>(name: T extends string ? T : never, control: C[T]) => void;
  reset: (value?: ResetValue<K>, options?: FormEventOptions) => void;
}
export function typedFormGroup<K, C extends Controls<K> = TypedControlsIn<K>>(
  controls: C,
  validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
  asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null
): TypedFormGroup<K, C> {
  return new FormGroup(controls, validatorOrOpts, asyncValidator) as any;
}

/**
 * Helper type for specifying what control we expect for each property from the model.
 */
export type TypedControlsIn<K, groups extends keyof K = never, arrays extends keyof K = never> = {
  [key in keyof K]: key extends groups
    ? TypedFormGroup<K[key]>
    : key extends arrays
    ? K[key] extends Array<infer T>
      ? TypedFormArray<T[], T>
      : never
    : TypedFormControl<K[key]>
};

/**
 * Shorthand for a model with `TypedFormControl`s and `TypedFormArray`s only (i.e. no `TypedFormGroup`s in)
 */
export type TypedArraysIn<K, arrays extends keyof K> = TypedControlsIn<K, never, arrays>;
/**
 * Shorthand for a model with `TypedFormControl`s and `TypedFormGroup`s only  (i.e. no `TypedFormArray`s in)
 */
export type TypedGroupsIn<K, groups extends keyof K> = TypedControlsIn<K, groups, never>;

// tests
// tslint:disable-next-line:interface-over-type-literal
export type Model = {
  name: string;
  email: string;
};
export interface Model1 {
  names: string[];
  email: string;
}

const f = typedFormGroup<Model>({ name: new FormControl(), email: new FormControl() });
f.valueChanges.subscribe(v => console.log(v));
console.log(f.controls.email);
f.setControl('name', typedFormControl());

const f1 = new FormGroup({ t: new FormControl() });
// console.log(f1.controls.any.value); // will break runtime
// f1.valueChanges.subscribe(v => console.log(v));

const f2 = typedFormGroup<Model1, TypedControlsIn<Model1, never, 'names'>>({
  names: typedFormArray([]),
  email: typedFormControl()
});
console.log(f2.controls); // controls are loosely typed - one of form control or group

const f3 = typedFormGroup<Model, { name: TypedFormControl<string>; email: TypedFormControl<string> }>({
  name: typedFormControl(),
  email: typedFormControl()
});
console.log(f3.controls); // controls are strongly typed - know exactly what type of control for which key in your model
f3.setControl('email', typedFormControl());

const f4 = typedFormGroup<Model1, TypedControlsIn<Model1, never, 'names'>>({
  names: typedFormArray([]),
  email: typedFormGroup<string>('test')
});
f4.reset({ names: { value: [''], disabled: true }, email: '' });
f4.reset({ names: [''] }, { emitEvent: true });

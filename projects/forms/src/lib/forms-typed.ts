import {
  AbstractControl,
  AbstractControlOptions,
  AsyncValidatorFn,
  FormArray,
  FormControl,
  FormGroup,
  ValidatorFn,
} from '@angular/forms';
import { Observable } from 'rxjs';

/**
 * Type encapsulating the Angular Form options:
 * `emitEvent` - do we emit event;
 * `onlySelf` - do we bubble up to parent
 * `emitModelToViewChange` - When true or not supplied (the default), each change triggers an onChange event to update the view.
 * `emitViewToModelChange` - When true or not supplied (the default), each change triggers an ngModelChange event to update the model.
 */
export interface FormEventOptions {
  emitEvent?: boolean;
  onlySelf?: boolean;
  emitModelToViewChange?: boolean;
  emitViewToModelChange?: boolean;
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
  v?: T | { value: T; disabled: boolean },
  validatorsOrOptions?: ValidatorFn | ValidatorFn[] | AbstractControlOptions,
  asyncValidators?: AsyncValidatorFn | AsyncValidatorFn[]
): TypedFormControl<T> {
  return new FormControl(v, validatorsOrOptions, asyncValidators);
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
export function typedFormArray<T = any, K extends Array<T> = T[]>(
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
        : TypedFormControl<K[k]> | TypedFormGroup<K[k]>;
    };

// tslint:disable-next-line:ban-types
type NonGroup = string | number | boolean | Function | null | undefined | never;
/**
 * This is a strongly typed thin wrapper type around `FormGroup`.
 * Can be created using the `typedFormGroup` function
 */
export interface TypedFormGroup<K, C extends Controls<K> = TypedControlsIn<K>> extends FormGroup, TypedFormControl<K> {
  controls: K extends NonGroup ? never : C;
  valueChanges: Observable<K>;
  statusChanges: Observable<'VALID' | 'INVALID' | 'PENDING' | 'DISABLED'>;
  patchValue: (v: Partial<K>, options?: FormEventOptions) => void;
  setValue: (v: K, options?: FormEventOptions) => void;
  value: K;
  setControl: <T extends keyof C>(name: T extends string ? T : never, control: C[T]) => void;
  reset: (value?: ResetValue<K>, options?: FormEventOptions) => void;
  getRawValue: () => K;
}
export function typedFormGroup<K, C extends Controls<K> = TypedControlsIn<K>, Key extends keyof K = keyof K>(
  controls: K extends NonGroup ? never : C,
  validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
  asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null
): TypedFormGroup<K, C> & { keys: Record<Key, string> } {
  const f = new FormGroup(controls, validatorOrOpts, asyncValidator) as any;
  f.keys = Object.keys(controls).reduce((acc, k) => ({ ...acc, [k]: k }), {});
  return f;
}

/**
 * Helper type for specifying what control we expect for each property from the model.
 */
export type TypedControlsIn<K, groups extends keyof K = never, arrays extends keyof K = never> = {
  [key in keyof K]-?: key extends groups
    ? TypedFormGroup<K[key]>
    : key extends arrays
    ? K[key] extends Array<infer T>
      ? TypedFormArray<T[], T>
      : never
    : TypedFormControl<K[key]>;
};

/**
 * Shorthand for a model with `TypedFormControl`s and `TypedFormArray`s only (i.e. no `TypedFormGroup`s in)
 */
export type TypedArraysIn<K, arrays extends keyof K> = TypedControlsIn<K, never, arrays>;
/**
 * Shorthand for a model with `TypedFormControl`s and `TypedFormGroup`s only  (i.e. no `TypedFormArray`s in)
 */
export type TypedGroupsIn<K, groups extends keyof K> = TypedControlsIn<K, groups, never>;

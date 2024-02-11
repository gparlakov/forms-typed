import { AbstractControl, FormArray, FormGroup, UntypedFormArray, UntypedFormGroup, Validators } from '@angular/forms';
import { TypedFormGroup, TypedFormArray } from './forms-typed';

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
export function forEachControlIn(form: UntypedFormGroup | UntypedFormArray) {
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
     * @param parentControl the control that should be invalid if on of our controls is
     */
    addValidatorsTo(parentControl: AbstractControl) {
      if (parentControl != null) {
        parentControl.validator = Validators.compose([
          parentControl.validator,
          () => {
            // could overwrite some errors - but we only need it to communicate to the "parent" form that
            // these controls here are valid or not
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

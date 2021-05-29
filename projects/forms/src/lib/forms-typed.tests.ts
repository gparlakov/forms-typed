// tests

import { FormControl, FormGroup } from '@angular/forms';
import {
  TypedControlsIn,
  typedFormArray,
  typedFormControl,
  TypedFormControl,
  typedFormGroup,
  TypedFormGroup,
} from './forms-typed';
import { forEachControlIn } from './forms-util';

export interface Model {
  name: string;
  email: string;
}

const form = typedFormGroup({ email: new FormControl(), name: new FormControl() }) as TypedFormGroup<Model>;
console.log(form.controls.email);
form.valueChanges.subscribe((v) => console.log(v));
form.statusChanges.subscribe((s) => console.log(s));

export interface Model1 {
  names: string[];
  email: string;
}

// values in a typed form control are stronlgy typed
const f = typedFormGroup<Model>({ name: new FormControl(), email: new FormControl() });
f.valueChanges.subscribe((v) => console.log(v));
// controls are strongly typed too
console.log(f.controls.email);
f.setControl('name', typedFormControl());

// vs standard form group are - neither controls nor values are typed
const f1 = new FormGroup({ t: new FormControl() });
console.log(f1.controls.any.value); // will break runtime
f1.valueChanges.subscribe((v) => console.log(v)); // v is not strongly typed

// form group with both controls and form arrays - strongly typed
const f2 = typedFormGroup<Model1, TypedControlsIn<Model1, never, 'names'>>({
  names: typedFormArray([]),
  email: typedFormControl(),
});
console.log(f2.controls.email);
console.log(f2.controls.names.setControl(0, typedFormControl('')));
const firstName = f2.controls.names.at(0);

// controls strongly typed
const f3 = typedFormGroup<Model, { name: TypedFormControl<string>; email: TypedFormControl<string> }>({
  name: typedFormControl(),
  email: typedFormControl(),
});
console.log(f3.controls); // controls are strongly typed - know exactly what type of control for which key in your model
f3.setControl('email', typedFormControl());

// do not allow a form group for base types - string/number/etc.
const f4 = typedFormGroup<Model1, TypedControlsIn<Model1, never, 'names'>>({
  names: typedFormArray([]),
  // ❌ should break
  email: typedFormGroup<string>('test'), // we disallow form group for simple types and null
});
f4.reset({ names: { value: [''], disabled: true }, email: '' });

// strong types for method options
f4.reset(
  { names: [''] },
  { emitEvent: true, onlySelf: false, emitModelToViewChange: true, emitViewToModelChange: false }
);

interface Person {
  name: string;
  address: Address;
}
interface Address {
  postCode: string;
  line: string;
}

const person = typedFormGroup<Person>({ name: typedFormControl(), address: typedFormControl() });
const address = typedFormGroup<Address>({ postCode: typedFormControl(), line: typedFormControl() });

// address each control in dot-chain type of API
forEachControlIn(address).addValidatorsTo(person).markAsTouchedSimultaneouslyWith(person);

// AbstractControlOptions in form control
typedFormControl('', { updateOn: 'blur' }, (v) => Promise.resolve(null));
typedFormControl('value', {
  updateOn: 'blur',
  validators: [(v) => null, (v) => ({ error: 'true' })],
  asyncValidators: (v) => Promise.resolve(null),
});
typedFormControl('value', {
  updateOn: 'blur',
  validators: (v) => null,
  asyncValidators: [(v) => Promise.resolve(null), (v) => Promise.resolve({ e: 'error' })],
});

// AbstractControlOptions in form group
typedFormGroup<{ m: string }>(
  { m: typedFormControl() },
  {
    updateOn: 'blur',
    validators: (v) => null,
    asyncValidators: [(v) => Promise.resolve(null), (v) => Promise.resolve({ e: 'error' })],
  }
);

// AbstractControlOptions in form array
typedFormArray<string[]>([typedFormControl()], {
  updateOn: 'blur',
  validators: (v) => null,
  asyncValidators: [(v) => Promise.resolve(null), (v) => Promise.resolve({ e: 'error' })],
});

// typed form array with the single type only
const tags = typedFormArray<string>([
  typedFormControl('javascript'),
  typedFormControl('typescript'),
  typedFormControl('strong types'),
  typedFormControl('strong code'),
]);

// typed form array push ❌ breaks because expecting string
tags.push(typedFormControl(1));
// patch value works with ❌ exception of 1 - not a string
tags.patchValue(['1', '2', '3', 1]);

// typed Form group Keys
const tg = typedFormGroup<Model>({
  name: typedFormControl(),
  email: typedFormControl()
})

tg.keys.email


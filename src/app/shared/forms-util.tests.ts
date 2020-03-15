
// tests

import { FormControl, FormGroup } from '@angular/forms';
import { TypedControlsIn, typedFormArray, typedFormControl, TypedFormControl, typedFormGroup, TypedFormGroup, forEachControlIn } from "./forms-util";
import { Address } from 'cluster';


export interface Model {
  name: string;
  email: string;
}


const form1 = typedFormGroup({ email: new FormControl(), name: new FormControl() }) as TypedFormGroup<Model>;
console.log(form1.controls.email);
form1.valueChanges.subscribe(v => console.log(v));
form1.statusChanges.subscribe(s => console.log(s));













export interface Model1 {
  names: string[];
  email: string;
}

const f = typedFormGroup<Model>({ name: new FormControl(), email: new FormControl() });
f.valueChanges.subscribe(v => console.log(v));
console.log(f.controls.email);
f.setControl('name', typedFormControl());

const f1 = new FormGroup({ t: new FormControl() });
console.log(form1.controls.any.value); // will break runtime
form1.valueChanges.subscribe(v => console.log(v)); // v is not strongly typed


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
  email: typedFormGroup<string>('test') // we disallow form group for simple types and null
});
f4.reset({ names: { value: [''], disabled: true }, email: '' });
f4.reset({ names: [''] }, { emitEvent: true });



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

forEachControlIn(address)
  .addValidatorsTo(person)
  .markAsTouchedSimultaneouslyWith(person);








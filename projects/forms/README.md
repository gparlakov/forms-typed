# Forms Typed (ngx-forms-typed)
This project aims at providing several tools for Angular Forms development, including: 
 - types for strongly typing your `FormControl`s, `FormGroup`s and `FormArray`s based on a Model type
 - functions for instantiating the `TypedFormControl`, `TypedFormGroup` and `TypedFormArray` based on a Model type
 - a helper function that enumerates all controls in a form (group) 
     - calls methods on each of them
     - attaches their validators to a paren form (group) 
     - attaches the touched/untouched behavior to a paren form (group)
 - a helper component that shows the form/group/control and allows for editing of the value emitted 

## Manually applying strong types to existing forms 
![Manually typed example - value - missing image](./assets/manually-typed-value.png)

Example shows adding the strong type to an existing form control and its value is now **strong typed**!

![Manually typed example - missing image](./assets/manually-typed.jpg) 
The controls property is now **strong typed**!

Note: The parameters for the `FormControl` are **not strong typed**. Notice we are passing the `t` as a FormControl and then are trying to access `email`. Hence the `typedFormGroup` function. See [below](#Using-the-helper-functions-to-strong-type-forms)

## Using the helper functions to strong type forms
![auto typed example - parmeter error - missing image](./assets/typed-form-control-error.png)

Using the function, now the parameters passed in are also **strong typed**!

![auto typed example - missing image](./assets/typed-form-control.png)

And the `setValue` (`patchValue` also) method(s)
![auto typed example - missing image](./assets/forms-typed-set-value.png)


And the status changed
![auto typed example - missing image](./assets/forms-typed-status-changes.png)


## Using the helper function to touch all controls in a form
A function allowing easy and type-safe interacting with each form control in a form:
![For each control in - missing image](./assets/for-each-touched.png)
Will iterate over all controls in a form group or form array and call the `markAsTouched` method on them

Type safe:
![For each control in - missing image](./assets/for-each-typed.png)
Multiple methods as params supported:
![For each control in - missing image](./assets/for-each-typed-result.png)

### Interaction in parent-child form scenarios:
![For each control in - missing image](./assets/for-each-parent-child-interact.png)

Here we want the validation of the child `Address` form to influence the parent `Person` form. That's the `addValidatorsTo()` method's job. We also want to make the child form touched if we call the parent form `touch()` method. That's the `markAsTouchedSimultaneouslyWith()` method's job. For more details and how they interact see example implementation:
 - [parent component](src/app/party-form/party-form.component.ts) 
 - [child form](src/app/person-contact/person-contact.component.ts) 
 - [control calue accessor connector](src/app/shared/control-value-accessor-connector.ts)
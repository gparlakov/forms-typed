import { Component, OnInit } from '@angular/core';
import {
  typedFormGroup,
  forEachControlIn,
  typedFormControl,
  typedFormArray,
  TypedFormArray,
  TypedArraysIn
} from 'forms';
import { PartyForm } from './party-form.model';
import { take } from 'rxjs/operators';
import { eventDefault } from '../event-form/event-form.model';
import { PersonContact } from '../person-contact/person-contact.model';

@Component({
  selector: 'fty-party-form',
  templateUrl: './party-form.component.html',
  styleUrls: ['./party-form.component.css']
})
export class PartyFormComponent implements OnInit {
  form = typedFormGroup<PartyForm, TypedArraysIn<PartyForm, 'invitees'>>({
    event: typedFormControl(eventDefault()),
    invitees: typedFormArray([typedFormControl()])
  });

  get invitees() {
    return this.form.controls.invitees;
  }

  submitting = false;

  constructor() {}

  ngOnInit(): void {}

  onPartyFormSubmit() {
    if (!this.submitting) {
      this.submitting = true;

      forEachControlIn(this.form)
        // to show validation
        .call('markAsTouched')
        // to get the valid/invalid state from the "inner" components
        // because we only receive the inner state on status changes or value changes
        .call('updateValueAndValidity');

      if (this.form.pending) {
        this.form.statusChanges.pipe(take(1)).subscribe(() => this.onPartyFormSubmit());
      } else if (this.form.valid) {
        setTimeout(() => {
          // do submit
          this.submitting = false;
          console.log(this.form.value);
        }, 5000);
      } else {
        this.submitting = false;
      }
    }
  }

  onAddInviteeClick(invitees: TypedFormArray<PersonContact[]>) {
    const c = typedFormControl<PersonContact>();
    invitees.push(c);
  }
  onRemoveInviteeClick(invitees: TypedFormArray<PersonContact[]>) {
    if (Array.isArray(invitees.controls) && invitees.controls.length > 0) {
      invitees.removeAt(invitees.controls.length - 1);
    }
  }
}

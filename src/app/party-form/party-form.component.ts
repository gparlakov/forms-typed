import { Component, OnInit } from '@angular/core';
import { typedFormGroup, forEachControlIn, TypedFormControl } from '../shared/forms-util';
import { PartyForm } from './party-form.model';
import { FormControl } from '@angular/forms';
import { take } from 'rxjs/operators';
import { EventForm } from '../event-form/event-form.model';

@Component({
  selector: 'fty-party-form',
  templateUrl: './party-form.component.html',
  styleUrls: ['./party-form.component.css']
})
export class PartyFormComponent implements OnInit {
  form = typedFormGroup<PartyForm>({
    event: new FormControl({}) as TypedFormControl<EventForm>,
    invitees: new FormControl()
  });
  submitting = false;

  constructor() {}

  ngOnInit(): void {}

  onPartyFormSubmit() {
    this.submitting = true;

    forEachControlIn(this.form).call('markAsTouched'); // to show validation
    forEachControlIn(this.form).call('updateValueAndValidity');

    if (this.form.pending) {
      this.form.statusChanges.pipe(take(1)).subscribe(() => this.onPartyFormSubmit());
    } else if (this.form.valid) {
      // do submit
      this.submitting = false;
    } else {
      this.submitting = false;
    }
  }
}

import { Component, OnInit } from '@angular/core';
import {
  typedFormGroup,
  forEachControlIn,
  typedFormControl
} from '../shared/forms-util';
import { PartyForm } from './party-form.model';
import { FormControl } from '@angular/forms';
import { take } from 'rxjs/operators';
import {  eventDefault } from '../event-form/event-form.model';

@Component({
  selector: 'fty-party-form',
  templateUrl: './party-form.component.html',
  styleUrls: ['./party-form.component.css']
})
export class PartyFormComponent implements OnInit {
  form = typedFormGroup<PartyForm>({
    event: typedFormControl(eventDefault()),
    person: typedFormControl()
  });

  private submitting = false;

  constructor() {}

  ngOnInit(): void {}

  onPartyFormSubmit() {
    if (!this.submitting) {
      this.submitting = true;

      forEachControlIn(this.form).call('markAsTouched'); // to show validation
      forEachControlIn(this.form).call('updateValueAndValidity');

      if (this.form.pending) {
        this.form.statusChanges.pipe(take(1)).subscribe(() => this.onPartyFormSubmit());
      } else if (this.form.valid) {
        // do submit
        this.submitting = false;
        console.log(this.form.value);
      } else {
        this.submitting = false;
      }
    }
  }
}

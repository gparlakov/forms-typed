import { Component, OnInit, Optional, Self } from '@angular/core';
import { NgControl, Validators } from '@angular/forms';
import { typedFormGroup, typedFormControl, TypedFormControl } from '../shared/forms-util';
import { EventForm, eventDefault } from './event-form.model';
import { ControlValueAccessorConnector } from '../shared/control-value-accessor-connector';

const { dateStart: defaultDateStart, timeStart: defaultTimeStart } = eventDefault();

@Component({
  selector: 'fty-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.css']
})
export class EventFormComponent
  extends ControlValueAccessorConnector<
    EventForm,
    {
      eventName: TypedFormControl<string>;
      location: TypedFormControl<string>;
      dateStart: TypedFormControl<Date>;
      timeStart: TypedFormControl<string>;
    }
  >
  implements OnInit {
  constructor(@Optional() @Self() directive: NgControl) {
    super(
      directive,
      typedFormGroup({
        eventName: typedFormControl<string>(undefined, Validators.required),
        location: typedFormControl<string>(),
        dateStart: typedFormControl(defaultDateStart),
        timeStart: typedFormControl(defaultTimeStart)
      })
    );
  }

  ngOnInit(): void {
    super.ngOnInit();
  }
  onNameInputBlur() {
    this.onTouch();
  }
  onLocationInputBlur() {
    this.onTouch();
  }
  onStartDateInputBlur() {
    this.onTouch();
  }
  onStartTimeInputBlur() {
    this.onTouch();
  }
}

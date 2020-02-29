import { Component, OnInit, Optional, Self } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl, Validators } from '@angular/forms';
import { typedFormGroup, forEachControlIn } from '../shared/forms-util';
import { EventForm } from './event-form.model';

@Component({
  selector: 'fty-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.css']
})
export class EventFormComponent implements OnInit, ControlValueAccessor {
  form = typedFormGroup<EventForm>({
    eventName: new FormControl(null, Validators.required),
    location: new FormControl(),
    dateStart: new FormControl(new Date()),
    dateEnd: new FormControl()
  });
  callingOnTouchFromBelow: boolean;

  get location() {
    return this.form.controls.location;
  }

  constructor(@Optional() @Self() private directive: NgControl) {
    if (directive) {
      directive.valueAccessor = this;
    }
  }

  ngOnInit(): void {
    if (this.directive && this.directive.control) {
      forEachControlIn(this.form)
        .markAsTouchedSimultaneouslyWith(this.directive.control, () => this.callingOnTouchFromBelow)
        .addValidatorsTo(this.directive.control);
    }

    this.form.valueChanges.subscribe(v => this.onChange(v));
    this.form.statusChanges.subscribe(s => {
      if (this.form.touched) {
        this.callingOnTouchFromBelow = true;
        this.onTouch();
        this.callingOnTouchFromBelow = false;
      }
    });
  }

  private onChange = (_: EventForm) => {};
  private onTouch = () => {};
  writeValue(obj: any): void {
    this.form.patchValue(obj || {});
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
  setDisabledState(disable: boolean) {
    disable ? this.form.disable() : this.form.enable();
    forEachControlIn(this.form).call(disable ? 'disable' : 'enable');
  }
}

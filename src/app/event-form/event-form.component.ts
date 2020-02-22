import { Component, OnInit, Optional, SkipSelf } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';
import { typedFormGroup, forEachControlIn } from '../shared/forms-util';
import { EventForm } from './event-form.model';

@Component({
  selector: 'fty-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.css']
})
export class EventFormComponent implements OnInit, ControlValueAccessor {
  form = typedFormGroup<EventForm>({
    location: new FormControl(),
    eventName: new FormControl(),
    dateStart: new FormControl(),
    dateEnd: new FormControl()
  });

  get location() {
    return this.form.controls.location;
  }

  constructor(@Optional() @SkipSelf() private control: NgControl) {
    if (control) {
      control.valueAccessor = this;
    }
  }

  ngOnInit(): void {
    if (this.control && this.control.control) {
      forEachControlIn(this.form).markAsTouchedSimultaneouslyWith(this.control.control);
    }

    this.form.valueChanges.subscribe(v => this.onChange(v));
    this.form.statusChanges.subscribe(s => {
      if (this.form.touched) {
        this.onTouch();
      }
    });
  }

  private onChange = (_: EventForm) => {};
  private onTouch = () => {};
  writeValue(obj: any): void {
    this.form.patchValue(obj);
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

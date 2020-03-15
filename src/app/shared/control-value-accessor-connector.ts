import { OnInit, Optional, Self, OnDestroy } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { forEachControlIn, TypedFormGroup, Controls } from 'forms';
import { Subscription } from 'rxjs';

export class ControlValueAccessorConnector<T, C extends Controls<T> = Controls<T>>
  implements OnInit, OnDestroy, ControlValueAccessor {
  protected subs = new Subscription();
  protected touchIsChildInitiated: boolean;

  public form: TypedFormGroup<T, C>;

  constructor(@Optional() @Self() private directive: NgControl, form: TypedFormGroup<T, C>) {
    if (directive) {
      directive.valueAccessor = this;
    }
    this.form = form;
  }

  ngOnInit(): void {
    if (this.directive && this.directive.control) {
      forEachControlIn(this.form)
        .markAsTouchedSimultaneouslyWith(this.directive.control, () => this.touchIsChildInitiated)
        .addValidatorsTo(this.directive.control);
    }

    const values = this.form.valueChanges.subscribe(v => this.onChange(v));
    const statuses = this.form.statusChanges.subscribe(s => {
      if (this.form.touched) {
        this.onTouch();
      }
    });

    this.subs.add(values);
    this.subs.add(statuses);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
  protected onChange = (_: T) => {};
  protected onTouch = () => {};
  writeValue(obj: any): void {
    this.form.patchValue(obj || {});
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouch = () => {
      this.touchIsChildInitiated = true;
      fn();
      this.touchIsChildInitiated = false;
    };
  }
  setDisabledState(disable: boolean) {
    disable ? this.form.disable() : this.form.enable();
    forEachControlIn(this.form).call(disable ? 'disable' : 'enable');
  }
}

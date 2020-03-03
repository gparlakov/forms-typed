import { Component, OnInit, Input, HostListener, ElementRef } from '@angular/core';
import { AbstractControl } from '@angular/forms';

let count = 0;

@Component({
  selector: 'fty-show-form-control',
  templateUrl: './show-form-control.component.html',
  styleUrls: ['./show-form-control.component.scss']
})
export class ShowFormControlComponent implements OnInit {
  dragging?: boolean;
  width = 50;
  height?: number;

  @Input()
  closed?: boolean;
  offset: number;

  @Input()
  control?: AbstractControl;

  @Input()
  name = 'Drag here';

  constructor(private host: ElementRef) {
    this.offset = count;
    if (count > 0) {
      this.closed = true;
    }
    count += 1;
  }

  ngOnInit() {
    this.calcWidthAfterRedraw();
    this.addOffsetAfterRedraw();
  }

  private calcWidthAfterRedraw() {
    setTimeout(() => {
      const rect = (this.host.nativeElement as HTMLElement).getBoundingClientRect();
      this.width = rect.width;
      this.height = rect.height;
    }, 1);
  }

  private addOffsetAfterRedraw() {
    setTimeout(() => {
      (this.host.nativeElement as HTMLElement).style.top = `${this.offset}px`;
      (this.host.nativeElement as HTMLElement).style.right = `${this.offset * 5}px`;
    }, 1);
  }

  onToggle() {
    this.calcWidthAfterRedraw();
    this.closed = !this.closed;
  }

  onDragStart(drag: MouseEvent | DragEvent) {
    drag.preventDefault();
    this.dragging = true;
  }

  @HostListener('mouseup')
  onDragEnd() {
    this.dragging = false;
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.dragging === true) {
      (this.host.nativeElement as HTMLElement).style.right = 'unset';
      (this.host.nativeElement as HTMLElement).style.top = event.clientY - 5 - this.offset + 'px';
      (this.host.nativeElement as HTMLElement).style.left = event.clientX - this.width / 2 + 'px';
    }
  }

  onTextAreaInput(e: Event) {
    const v = (e.target as HTMLTextAreaElement).value;
    if (v) {
      try {
        const x = JSON.parse(v);
        this.control?.patchValue(x);
      } catch {
        // do nothing
      }
    }
  }
}

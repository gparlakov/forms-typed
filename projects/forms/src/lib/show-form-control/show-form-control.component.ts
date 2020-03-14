import { Component, OnInit, Input, HostListener, ElementRef, Optional, Inject, HostBinding } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { componentSelector, WindowWidthProvider, WindowAnimationFrameProvider, Disable } from './show-form-control';

let count = 0;

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'show-form-control',
  templateUrl: './show-form-control.component.html',
  styleUrls: ['./show-form-control.component.scss'],
})
export class ShowFormControlComponent implements OnInit {
  private from: { x: number, y: number } | null = null;

  dragging?: boolean;
  width = 50;
  height?: number;

  @HostBinding('class.enabled')
  enabled: boolean;

  @Input()
  closed?: boolean;
  offset: number;

  @Input()
  control?: AbstractControl;

  @Input()
  name = 'Drag here';
  initial: DOMRect | null = null;

  constructor(
    private host: ElementRef,
    @Inject(Disable) disabled: boolean,
    @Optional() @Inject('AnimationFrameProvider') private animationFrame: WindowAnimationFrameProvider,
    @Optional() @Inject('WINDOW') private w: WindowWidthProvider
  ) {
    this.enabled = !Boolean(disabled);
    this.animationFrame = this.animationFrame || window;
    this.w = this.w || window;

    if (this.enabled) {
      this.offset = count;
      if (count > 0) {
        this.closed = true;
      }
      count += 1;
    }
  }

  ngOnInit() {
    if (this.enabled) {
      this.calcWidthAfterRedraw();
      this.addOffsetAfterRedraw();
    }
  }

  private calcWidthAfterRedraw() {
    this.animationFrame.requestAnimationFrame(() => {
      const rect = (this.host.nativeElement as HTMLElement).getBoundingClientRect();
      this.width = rect.width;
      this.height = rect.height;


      this.animationFrame.requestAnimationFrame(() => {
        const elem = (this.host.nativeElement as HTMLElement).getBoundingClientRect();

        const windowWidth = this.w.innerWidth;
        const windowHeight = this.w.innerHeight;

        if (elem.x < 0) {
          (this.host.nativeElement as HTMLElement).style.left = '0px';
        }
        if (elem.x + elem.width > windowWidth) {
          (this.host.nativeElement as HTMLElement).style.left = `${windowWidth - elem.width}px`;
        }
        if (elem.y < 0) {
          (this.host.nativeElement as HTMLElement).style.top = '0px';
        }
        if (elem.y + elem.height > windowHeight) {
          (this.host.nativeElement as HTMLElement).style.top = `${windowHeight - elem.height}px`;
        }
      });
    });
  }

  private addOffsetAfterRedraw() {
    this.animationFrame.requestAnimationFrame(() => {
      (this.host.nativeElement as HTMLElement).style.top = `${this.offset}px`;
      (this.host.nativeElement as HTMLElement).style.right = `${this.offset * 5}px`;
    });
  }

  onToggle() {
    this.closed = !this.closed;
    this.calcWidthAfterRedraw();
  }

  onDragStart(drag: MouseEvent | DragEvent) {
    drag.preventDefault();
    this.dragging = true;
    this.from = { x: drag.clientX, y: drag.clientY };
    this.initial = (this.host.nativeElement as HTMLElement)?.getBoundingClientRect();
  }

  @HostListener('mouseup')
  onDragEnd() {
    if (this.enabled) {
      this.dragging = false;
      this.from = null;
    }
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.enabled && this.from != null && this.initial != null) {
      const y = this.from.y - event.clientY;
      const x = this.from.x - event.clientX;


      (this.host.nativeElement as HTMLElement).style.right = 'unset';
      (this.host.nativeElement as HTMLElement).style.top = this.initial.top - y + 'px';
      (this.host.nativeElement as HTMLElement).style.left = this.initial.left - x + 'px';
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

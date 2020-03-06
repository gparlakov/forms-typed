import { Component, OnInit, Input, HostListener, ElementRef, Optional, Inject } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { componentSelector, WindowWidthProvider } from './show-form-control';

let count = 0;

@Component({
  selector: componentSelector,
  templateUrl: './show-form-control.component.html',
  styleUrls: ['./show-form-control.component.scss']
})
export class ShowFormControlComponent implements OnInit {
  private from: { x: number, y: number } | null = null;

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
  initial: DOMRect | null = null;

  constructor(private host: ElementRef,
    @Optional() @Inject('AnimationFrameProvider') private animationFrame: AnimationFrameProvider,
    @Optional() @Inject('WINDOW') private w: WindowWidthProvider
  ) {
    this.animationFrame = this.animationFrame || window;
    this.w = this.w || window;
    this.offset = count;
    if (count > 0) {
      this.closed = true;
    }
    count += 1;
  }

  ngOnInit() {
    this.calcWidthAfterRedraw(Boolean(this.closed));
    this.addOffsetAfterRedraw();
  }

  private calcWidthAfterRedraw(triggeredOn: boolean) {
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
    this.calcWidthAfterRedraw(!this.closed);
  }

  onDragStart(drag: MouseEvent | DragEvent) {
    drag.preventDefault();
    this.dragging = true;
    this.from = { x: drag.clientX, y: drag.clientY };
    this.initial = (this.host.nativeElement as HTMLElement)?.getBoundingClientRect();
  }

  @HostListener('mouseup')
  onDragEnd() {
    this.dragging = false;
    this.from = null;
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.from != null && this.initial != null) {
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

@Component({
  selector: componentSelector,
  template: ''
})
export class ProdVersionComponent {
  @Input()
  closed?: boolean;

  @Input()
  control?: AbstractControl;

  @Input()
  name = 'Drag here';
}

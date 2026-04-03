import {
  AfterViewInit,
  Directive,
  Input,
  input,
  NgZone,
  OnDestroy,
  output,
  signal,
} from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { Subject } from 'rxjs';
import { Color } from '../../models';

@Directive()
export abstract class NgxMatBaseColorCanvas implements OnDestroy, AfterViewInit {
  readonly colorChanged = output<Color>();
  readonly theme = input<ThemePalette>();
  readonly color = signal<Color | undefined | null>(null);

  @Input({
    alias: 'color',
  })
  set setColor(color: Color | undefined | null) {
    this.color.set(color);
  }

  canvas: HTMLCanvasElement | null = null;

  elementId: string;

  ctx: CanvasRenderingContext2D | null = null;
  width = 0;
  height = 0;

  x = 0;
  y = 0;

  drag = false;

  protected _destroyed: Subject<void> = new Subject<void>();

  protected zone: NgZone | null = null;

  constructor(
    elementId: string,
  ) {
    this.elementId = elementId;
  }

  ngOnDestroy(): void {
    this._destroyed.next();
    this._destroyed.complete();
  }

  ngAfterViewInit(): void {
    this.canvas = document.getElementById(this.elementId) as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d');
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.draw();
  }

  protected draw() {
    this.ctx?.clearRect(0, 0, this.width, this.height);
    this.ctx?.rect(0, 0, this.width, this.height);
    this.fillGradient();
    if (this.y != 0) {
      this.redrawIndicator(this.x, this.y);
    }
  }

  public onMousedown(e: MouseEvent) {
    this.drag = true;
    this.changeColor(e);

    this.zone?.runOutsideAngular(() => {
      this.canvas?.addEventListener('mousemove', this.onMousemove.bind(this));
    });
  }

  public onMousemove(e: MouseEvent) {
    if (this.drag) {
      this.zone?.run(() => {
        this.changeColor(e);
      });
    }
  }

  public onMouseup(_: MouseEvent) {
    this.drag = false;
    this.canvas?.removeEventListener('mousemove', this.onMousemove);
  }

  public emitChange(color: Color) {
    this.colorChanged.emit(color);
  }

  abstract changeColor(e: MouseEvent): void;
  abstract fillGradient(): void;
  abstract redrawIndicator(x: number, y: number): void;
}

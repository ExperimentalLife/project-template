import { Directive, Input, Output, ElementRef, EventEmitter, Renderer2, NgZone, AfterContentInit, OnInit, OnDestroy } from '@angular/core';
import { AnimationEvent } from '@core/models/common/animations.interface';

@Directive({
  selector: '[collapseAnimation]'
})
export class CollapseAnimationDirective implements OnInit, AfterContentInit, OnDestroy {
  private _firstStart = true;
  private _isCollapsed: boolean;
  private _lastIsCollapsed: boolean;
  private _transitioning: boolean;
  private _listener: Function;

  @Input() public collapseAnimationDuration = 350;
  @Input() public collapseAnimationTiming: string;
  @Input('collapseAnimation') public set isCollapsed(value: boolean) {
    this._lastIsCollapsed = this._isCollapsed;
    this._isCollapsed = value;
    if (!this._firstStart) {
      this.emit('start');
      if (value) {
        this.collapse();
      } else if (value === false) {
        this.unCollapse();
      }
    }
  }

  @Output('collapseAnimation.start') public startEventEmitter = new EventEmitter();
  @Output('collapseAnimation.done') public doneEventEmitter = new EventEmitter();

  constructor(
    private elementRef: ElementRef,
    private ngZone: NgZone,
    private renderer2: Renderer2
  ) { }

  ngOnInit() {
    if (this.collapseAnimationDuration && this.collapseAnimationDuration !== 350) {
      this.renderer2.setStyle(this.elementRef.nativeElement, 'transition-duration', `${this.collapseAnimationDuration}ms`);
    }
    if (this.collapseAnimationTiming) {
      this.renderer2.setStyle(this.elementRef.nativeElement, 'transition-timing-function', this.collapseAnimationTiming);
    }
  }

  ngAfterContentInit() {
    this.emit('start');
    if (this.isCollapsed) {
      this.renderer2.setStyle(this.elementRef.nativeElement, 'display', 'none');
      this.renderer2.addClass(this.elementRef.nativeElement, 'collapsing');
    }
    this.emit('done');
    this._firstStart = false;

    this.subscriptions();
  }

  ngOnDestroy() {
    if (this._listener) {
      this._listener();
    }
  }

  private subscriptions(): void {
    this.ngZone.runOutsideAngular(() => {
      this._listener = this.renderer2.listen(this.elementRef.nativeElement, 'transitionend', () => {
        if (!this.isCollapsed) {
          this.renderer2.removeClass(this.elementRef.nativeElement, 'un-collapse');
          this.renderer2.removeClass(this.elementRef.nativeElement, 'collapsing');
        } else {
          this.renderer2.setStyle(this.elementRef.nativeElement, 'display', 'none');
        }
        requestAnimationFrame(() => {
          this.renderer2.removeStyle(this.elementRef.nativeElement, 'height');
          this.emit('done');
          this._transitioning = false;
        });
      });
    });
  }


  private unCollapse(): void {
    this._transitioning = true;
    this.renderer2.addClass(this.elementRef.nativeElement, 'un-collapse');
    this.renderer2.removeStyle(this.elementRef.nativeElement, 'display');
    this.renderer2.setStyle(this.elementRef.nativeElement, 'height', `${this.elementRef.nativeElement.scrollHeight}px`);
  }

  private collapse(): void {
    requestAnimationFrame(() => {
      if (!this._transitioning) {
        this.renderer2.setStyle(this.elementRef.nativeElement, 'height', `${this.elementRef.nativeElement.offsetHeight}px`);
        this.renderer2.addClass(this.elementRef.nativeElement, 'collapsing');
      }
      this._transitioning = true;
      requestAnimationFrame(() => {
        this.renderer2.setStyle(this.elementRef.nativeElement, 'height', `0px`);
      });
    });
  }

  private emit(phaseName: string): void {
    const event: AnimationEvent = {
      element: this.elementRef.nativeElement,
      fromState: this._lastIsCollapsed === undefined ? 'void' : this._lastIsCollapsed ? '1' : '0',
      phaseName: phaseName,
      toState: this.isCollapsed === undefined ? 'void' : this.isCollapsed ? '1' : '0',
      totalTime: this.collapseAnimationDuration,
      triggerName: 'collapseAnimation'
    };

    if (phaseName === 'done') {
      this.doneEventEmitter.emit(event);
    } else if (phaseName === 'start') {
      this.startEventEmitter.emit(event);
    }
  }
}

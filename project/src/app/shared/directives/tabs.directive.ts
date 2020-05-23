import { Directive, Input, ElementRef } from '@angular/core';

@Directive({
  selector: '[TabToggle]'
})
export class TabToggleDirective {
  @Input('TabToggle') tabComponent;
  
  constructor(
    public elementRef: ElementRef
  ) {}
}

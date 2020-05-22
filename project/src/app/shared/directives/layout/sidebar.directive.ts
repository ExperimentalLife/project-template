import { Directive, Input, ElementRef } from '@angular/core';

@Directive({
  selector: '[menuToggle]'
})
export class SidebarToggleDirective {
  @Input('menuToggle') item;

  constructor(
    public elementRef: ElementRef
  ) {}
}

import { Directive, Input, ElementRef } from '@angular/core';

@Directive({
  selector: '[MenuToggle]'
})
export class SidebarToggleDirective {
  @Input('MenuToggle') item;

  constructor(
    public elementRef: ElementRef
  ) {}
}

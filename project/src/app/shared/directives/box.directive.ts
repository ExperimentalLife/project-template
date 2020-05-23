import { Directive } from '@angular/core';

@Directive({
  selector: 'box-content'
})
export class BoxContentDirective {}

@Directive({
  selector: 'box-footer'
})
export class BoxFooterDirective {}

@Directive({
  selector: 'box-tools'
})
export class BoxToolsDirective {}

@Directive({
  selector: 'box-header'
})
export class BoxHeaderDirective {}

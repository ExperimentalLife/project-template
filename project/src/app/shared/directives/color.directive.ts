import { Directive, Input } from '@angular/core';
import { ColorService } from '@core/services';

@Directive({
  selector: '[Color]',
})
export class BackgroundColorDirective {

  constructor(private colorService: ColorService) { }

  @Input('ColorCondition') condition = true;
  @Input('ColorPrefix') prefix: string;
  @Input('ColorProperty') property: string;
  @Input('Color') set color(color: string) {
    this.colorService.setBackgroundColor(color, this.condition, this.property, this.prefix);
  }
}

@Directive({
  selector: '[FontColor]',
})
export class ColorDirective {

  constructor(private colorService: ColorService) { }

  @Input('FontColor') set color(color: string) {
    this.colorService.setFontColor(color);
  }
}

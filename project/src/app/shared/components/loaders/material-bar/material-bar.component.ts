import { Component, Input } from '@angular/core';

@Component({
  selector: 'loader-material-bar',
  template: `
  <div class="material-bar">
    <div class="bar" [style.background-color]="colorOne"></div>
    <div class="bar" [style.background-color]="colorTwo"></div>
    <div class="bar" [style.background-color]="colorThree"></div>
  </div>`,
  styleUrls: ['./material-bar.component.scss']
})
export class MaterialbarComponent {
  @Input() colorOne = '#da4733';
  @Input() colorTwo = '#3b78e7';
  @Input() colorThree = '#fdba2c';
}

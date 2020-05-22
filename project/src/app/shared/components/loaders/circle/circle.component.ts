import { Component, Input } from '@angular/core';

@Component({
  selector: 'loader-circle',
  template: `
    <div class="loader-circle">
      <div class="loader-circle-1 loader-child"><div [style.background-color]="color"></div></div>
      <div class="loader-circle-2 loader-child"><div [style.background-color]="color"></div></div>
      <div class="loader-circle-3 loader-child"><div [style.background-color]="color"></div></div>
      <div class="loader-circle-4 loader-child"><div [style.background-color]="color"></div></div>
      <div class="loader-circle-5 loader-child"><div [style.background-color]="color"></div></div>
      <div class="loader-circle-6 loader-child"><div [style.background-color]="color"></div></div>
      <div class="loader-circle-7 loader-child"><div [style.background-color]="color"></div></div>
      <div class="loader-circle-8 loader-child"><div [style.background-color]="color"></div></div>
      <div class="loader-circle-9 loader-child"><div [style.background-color]="color"></div></div>
      <div class="loader-circle-10 loader-child"><div [style.background-color]="color"></div></div>
      <div class="loader-circle-11 loader-child"><div [style.background-color]="color"></div></div>
      <div class="loader-circle-12 loader-child"><div [style.background-color]="color"></div></div>
    </div>`,
  styleUrls: ['./circle.component.scss']
})
export class CircleComponent {
  @Input() color = '#da4733';
}

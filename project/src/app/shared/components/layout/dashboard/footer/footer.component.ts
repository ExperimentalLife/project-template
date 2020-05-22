import { Component, ContentChild, OnInit, ViewChild, TemplateRef, ElementRef } from '@angular/core';
import { FooterService } from '@core/services/layout/footer.service';

@Component({
  selector: 'layout-footer-left',
  template: '<ng-template #templateRef><ng-content></ng-content></ng-template>'
})
export class FooterLeftComponent {
  @ViewChild('templateRef') public templateRef: TemplateRef<any>;
}

@Component({
  selector: 'layout-footer-right',
  template: '<ng-template #templateRef><ng-content></ng-content></ng-template>'
})
export class FooterRightComponent {
  @ViewChild('templateRef') public templateRef: TemplateRef<any>;
}

@Component({
  selector: 'layout-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  @ContentChild(FooterLeftComponent) public footerLeftComponent: FooterLeftComponent;
  @ContentChild(FooterRightComponent) public footerRightComponent: FooterRightComponent;

  constructor(
    private elementRef: ElementRef,
    private footerService: FooterService
  ) { }

  ngOnInit() {
    this.footerService.elementRef = this.elementRef;
  }
}

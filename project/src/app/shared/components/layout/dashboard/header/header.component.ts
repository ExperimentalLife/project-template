import {
  AfterViewInit,
  Component,
  ContentChild,
  ElementRef,
  Input,
  NgZone,
  OnDestroy,
  Renderer2,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { LayoutStoreService } from '@core/services/layout/layout-store.service';
import { HeaderService } from '@core/services/layout/header.service';
import { removeListeners, removeSubscriptions } from '@core/helpers/functions';

@Component({
  selector: 'layout-header-logo',
  template: '<ng-template #templateRef><ng-content></ng-content></ng-template>'
})
export class HeaderLogoComponent {
  @ViewChild('templateRef') public templateRef: TemplateRef<any>;
}

@Component({
  selector: 'layout-header-logo-mini',
  template: '<ng-template #templateRef><ng-content></ng-content></ng-template>'
})
export class HeaderLogoMiniComponent {
  @ViewChild('templateRef') public templateRef: TemplateRef<any>;
}

@Component({
  selector: 'layout-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements AfterViewInit, OnDestroy {
  private _isSidebarLeftCollapsed: boolean;
  private _listeners = [];
  private _subscriptions = [];

  @Input() isSidebarLeftToggle = true;
  @Input() isSidebarRightToggle = true;
  @Input() logoLink: string | any[] = '/';

  @ContentChild(HeaderLogoComponent) public headerLogoComponent: HeaderLogoComponent;
  @ContentChild(HeaderLogoMiniComponent) public headerLogoMiniComponent: HeaderLogoMiniComponent;

  @ViewChild('headerElement') private headerElement: ElementRef;
  @ViewChild('sidebarToggleElement') private sidebarToggleElement: ElementRef;

  constructor(
    private layoutStore: LayoutStoreService,
    private ngZone: NgZone,
    private renderer2: Renderer2,
    private headerService: HeaderService
  ) {}

  ngAfterViewInit() {
    this.headerService.elementRef = this.headerElement;

    if (this.sidebarToggleElement) {
      this._subscriptions.push(this.layoutStore.isSidebarCollapsed.subscribe((value: boolean) => {
        this._isSidebarLeftCollapsed = value;
      }));
      this.ngZone.runOutsideAngular(() => {
        this._listeners.push(this.renderer2.listen(this.sidebarToggleElement.nativeElement, 'click', (event: Event) => {
          event.preventDefault();
          this.layoutStore.sidebarCollapsed(!this._isSidebarLeftCollapsed);
        }));
      });
    }
  }

  ngOnDestroy() {
    this._listeners = removeListeners(this._listeners);
    this._subscriptions = removeSubscriptions(this._subscriptions);
  }
}

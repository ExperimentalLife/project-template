import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  OnInit,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren
} from '@angular/core';
import { Event as RouterEvent, NavigationEnd, PRIMARY_OUTLET, Router } from '@angular/router';

import { removeSubscriptions, removeListeners } from '@core/helpers/subscription.functions';
import { WrapperService } from '@core/services/layout/wrapper.service';
import { SidebarToggleDirective } from '@shared/directives/sidebar.directive';
import { AnimationEvent } from '@core/models/common/animations.interface';
import { RoutingService } from '@core/services/routing.service';
import { HeaderService } from '@core/services/layout/header.service';
import { LayoutStoreService } from '@core/services/layout/layout-store.service';

export interface Item {
  id: number;
  parentId: number;
  label: string;
  route?: string;
  iconClasses?: string;
  children?: Array<Item>;
  isActive?: boolean;
  isCollapsed?: boolean;
  disableCollapse?: boolean;
}

export type Items = Array<Item>;

@Component({
  selector: 'layout-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent implements OnInit, AfterViewInit, OnDestroy {
  public menu: Array<any>
  public sidebarHeight: number;
  public sidebarOverflow: string;

  private _layout: string;
  private _isSidebarCollapsed: boolean;
  private _isSidebarExpandOnOver: boolean;
  private _isSidebarMouseOver: boolean;
  private _windowInnerWidth: number;
  private _windowInnerHeight: number;
  private _collapsedItems: Items = [];
  private _activatedItems: Items = [];
  private _toggleListeners: Array<Function> = [];
  private _listeners: Array<Function> = [];
  private _itemsByIds: { [propKey: number]: Item } = {};
  private _runningAnimations = 0;
  private _subscriptions = [];
  private _activeUrl: String;
  private _initialized: boolean;

  @ViewChild('sidebarElement') public sidebarElement: ElementRef;

  @ViewChildren(SidebarToggleDirective) public sidebarToggleDirectives: QueryList<SidebarToggleDirective>;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private layoutStore: LayoutStoreService,
    private ngZone: NgZone,
    private renderer2: Renderer2,
    private router: Router,
    private routingService: RoutingService,
    private wrapperService: WrapperService,
    private headerService: HeaderService
  ) { }

  ngOnInit() {
    this._subscriptions.push(this.layoutStore.sidebarMenu.subscribe(value => {
      this.menu = value;
      this.monkeyPatchMenu(this.menu);
      if (this._initialized) {
        this.setMenuListeners(this._activeUrl);
        this.setSidebarListeners();
        this.setMenuTogglesListeners();
      }
      this._initialized = true;
    }));
    this._subscriptions.push(this.layoutStore.sidebarMenuActiveUrl.subscribe(value => {
      this._activeUrl = value;
      this.setMenuListeners(value);
    }));
    this._subscriptions.push(this.routingService.events.subscribe((event: RouterEvent) => {
      if (event instanceof NavigationEnd) {
        this._activeUrl = event.url;
        this.setMenuListeners(event.url);
      }
    }));

    this.setSidebarListeners();
  }

  ngAfterViewInit() {
    this.setMenuTogglesListeners();
    this.checkMenuWithoutChildren();
  }

  ngOnDestroy() {
    this._subscriptions = removeSubscriptions(this._subscriptions);
    this._listeners = removeListeners(this._listeners);
    this._toggleListeners = removeListeners(this._toggleListeners);
  }

  setSidebarListeners(): void {
    this._subscriptions.push(this.layoutStore.layout.subscribe((value: string) => {
      this._layout = value;
      this.setSidebarHeight();
    }));

    this._subscriptions.push(this.layoutStore.windowInnerHeight.subscribe((value: number) => {
      this._windowInnerHeight = value;
      this.setSidebarHeight();
    }));

    this._subscriptions.push(this.layoutStore.sidebarMenu.subscribe(() => {
      this.changeDetectorRef.detectChanges();
    }));

    this.ngZone.runOutsideAngular(() => {
      this._listeners.push(this.renderer2.listen(this.sidebarElement.nativeElement, 'mouseenter', () => {
        this.layoutStore.sidebarMouseOver(true);
      }));
      this._listeners.push(this.renderer2.listen(this.sidebarElement.nativeElement, 'mouseleave', () => {
        this.layoutStore.sidebarMouseOver(false);
      }));
    });

    this._subscriptions.push(this.layoutStore.windowInnerWidth.subscribe((value: number) => {
      this._windowInnerWidth = value;
      if (!this._isSidebarCollapsed && this._windowInnerWidth <= 767) {
        this.layoutStore.sidebarCollapsed(true);
      } else if (this._windowInnerWidth > 767 && this._isSidebarCollapsed && !this._isSidebarExpandOnOver) {
        this.layoutStore.sidebarCollapsed(false);
      }
    }));

    this._subscriptions.push(this.layoutStore.isSidebarMouseOver.subscribe((value: boolean) => {
      this._isSidebarMouseOver = value;
      if (this._isSidebarExpandOnOver) {
        this.layoutStore.sidebarCollapsed(!value);
      }
    }));

    this._subscriptions.push(this.layoutStore.isSidebarExpandOnOver.subscribe((value: boolean) => {
      this._isSidebarExpandOnOver = value;
      if (this._windowInnerWidth > 767 && this._isSidebarCollapsed !== undefined) {
        this.layoutStore.sidebarCollapsed(value);
      }
    }));

    this._subscriptions.push(this.layoutStore.isSidebarCollapsed.subscribe((value: boolean) => {
      this._isSidebarCollapsed = value;
      if (this._windowInnerWidth <= 767) {
        if (value) {
          this.renderer2.removeClass(this.wrapperService.wrapperElementRef.nativeElement, 'sidebar-open');
        } else {
          this.renderer2.addClass(this.wrapperService.wrapperElementRef.nativeElement, 'sidebar-open');
        }
      } else {
        if (this._isSidebarExpandOnOver && !this._isSidebarMouseOver && !value) {
          this.layoutStore.sidebarExpandOnOver(false);
        }
        if (value) {
          this.renderer2.addClass(this.wrapperService.wrapperElementRef.nativeElement, 'sidebar-collapse');
          if (this._isSidebarExpandOnOver) {
            this.renderer2.removeClass(this.wrapperService.wrapperElementRef.nativeElement, 'sidebar-expanded-on-hover');
          }
        } else {
          this.renderer2.removeClass(this.wrapperService.wrapperElementRef.nativeElement, 'sidebar-collapse');
          if (this._isSidebarExpandOnOver) {
            this.renderer2.addClass(this.wrapperService.wrapperElementRef.nativeElement, 'sidebar-expanded-on-hover');
          }
        }
      }
    }));

    this._subscriptions.push(this.layoutStore.isSidebarMini.subscribe((value: boolean) => {
      if (value) {
        this.renderer2.addClass(this.wrapperService.wrapperElementRef.nativeElement, 'sidebar-mini');
      } else {
        this.renderer2.removeClass(this.wrapperService.wrapperElementRef.nativeElement, 'sidebar-mini');
      }
    }));
  }

  setMenuListeners(url): void {
    if (url === '/') {
      this.activeItems(url);
      this.changeDetectorRef.detectChanges();
    } else {
      const primaryOutlet = this.router.parseUrl(url).root.children[PRIMARY_OUTLET];
      if (primaryOutlet) {
        this.activeItems(primaryOutlet.toString());
        this.changeDetectorRef.detectChanges();
      }
    }
    if (this._windowInnerWidth <= 767 || this._isSidebarExpandOnOver) {
      this.layoutStore.sidebarCollapsed(true);
    }
  }

  public getIconClasses(item: Item): string {
    if (item.iconClasses || item.iconClasses === '') {
      return item.iconClasses;
    } else {
      return 'fa fa-circle-o';
    }
  }

  public visibilityStateStart(event: AnimationEvent): void {
    this._runningAnimations++;
    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        this._runningAnimations--;
        if (!this._runningAnimations) {
          this.layoutStore.setSidebarElementHeight(this.sidebarElement.nativeElement.offsetHeight);
        }
      }, event.totalTime);
    });
  }

  private uncollapseItemParents(item: Item, isActive = false): void {
    if (isActive) {
      item.isActive = true;
      this._activatedItems.push(item);
    }
    item.isCollapsed = false;
    this._collapsedItems.push(item);
    if (item.parentId) {
      this.uncollapseItemParents(this._itemsByIds[item.parentId], isActive);
    }
  }

  private findItemsByUrl(url: string, items: Items, returnItems: Items = []): Items {
    items.forEach((item: Item) => {
      if (item.route === url) {
        returnItems.push(item);
      } else if (item.children) {
        this.findItemsByUrl(url, item.children, returnItems);
      }
    });
    return returnItems;
  }

  private activeItems(url: string): void {
    this._activatedItems.forEach((item: Item) => {
      item.isActive = false;
    });
    this._activatedItems = [];

    this._collapsedItems.forEach((item: Item) => {
      item.isActive = false;
      item.isCollapsed = true;
    });
    this._collapsedItems = [];

    const items = this.findItemsByUrl(url, this.menu);
    items.forEach(item => {
      item.isActive = true;
      this.uncollapseItemParents(item, true);
      this._activatedItems.push(item);
    });
  }

  private monkeyPatchMenu(items: Items, parentId?: number): void {
    items.forEach((item: Item, index: number) => {
      item.id = parentId ? Number(parentId + '' + (index + 1)) : index + 1;
      if (parentId) {
        item.parentId = parentId;
      }
      if (!item.disableCollapse) {
        item.isCollapsed = true;
      }
      item.isActive = false;
      if (parentId || item.children) {
        this._itemsByIds[item.id] = item;
      }
      if (item.children) {
        this.monkeyPatchMenu(item.children, item.id);
      }
    });
  }

  private setMenuTogglesListeners(): void {
    this._toggleListeners = removeListeners(this._toggleListeners);
    this.ngZone.runOutsideAngular(() => {
      this.sidebarToggleDirectives.forEach((menuToggle: SidebarToggleDirective) => {
        this._toggleListeners.push(this.renderer2.listen(menuToggle.elementRef.nativeElement, 'click', (event) => {
          event.preventDefault();
          if (menuToggle.item.isCollapsed) {
            this._collapsedItems.forEach((item: Item) => {
              if (!item.disableCollapse) {
                item.isCollapsed = true;
              }
            });
            this._collapsedItems = [];
            this.uncollapseItemParents(menuToggle.item);
          } else {
            menuToggle.item.isCollapsed = !menuToggle.item.isCollapsed;
          }
          this.changeDetectorRef.detectChanges();
        }));
      });
    });
  }

  private checkMenuWithoutChildren(): void {
    let menuHaveChildren;
    this.menu.forEach((item: Item) => {
      if (item.children) {
        return menuHaveChildren = true;
      }
    });
    if (!menuHaveChildren) {
      this.ngZone.runOutsideAngular(() => {
        setTimeout(() => {
          this.layoutStore.setSidebarElementHeight(this.sidebarElement.nativeElement.offsetHeight);
        });
      });
    }
  }

  private setSidebarHeight(): void {
    if (this._layout === 'fixed') {
      const height = this._windowInnerHeight - this.headerService.offsetHeight;
      if (height && height !== this.sidebarHeight) {
        this.sidebarHeight = height;
        this.sidebarOverflow = 'auto';
        this.changeDetectorRef.detectChanges();
      }
    } else if (this.sidebarHeight) {
      this.sidebarOverflow = this.sidebarHeight = null;
      this.changeDetectorRef.detectChanges();
    }
  }
}

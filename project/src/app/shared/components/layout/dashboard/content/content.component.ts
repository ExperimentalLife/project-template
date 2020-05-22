import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, Event as RouterEvent } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { RoutingService } from '@core/services/routing.service';
import { HeaderService } from '@core/services/layout/header.service';
import { FooterService } from '@core/services/layout/footer.service';
import { removeSubscriptions } from '@core/helpers/functions';
import { LayoutStoreService } from '@core/services/layout/layout-store.service';

@Component({
  selector: 'layout-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContentComponent implements OnInit, OnDestroy {
  public description: string;
  public header: string;
  public heightStyle: number;
  public sidebarLeftHeight: number;
  public windowInnerHeight: number;

  private layout: string;
  private titleTag: string;
  private navigationEnd: boolean;
  private subscriptions = [];

  @ViewChild('contentInnerElement') private contentInnerElement: ElementRef;

  constructor(
    private layoutStore: LayoutStoreService,
    private routingService: RoutingService,
    private titleService: Title,
    private changeDetectorRef: ChangeDetectorRef,
    private headerService: HeaderService,
    private footerService: FooterService,
    private router: Router
  ) {}

  ngOnInit() {
    this.titleTag = this.titleService.getTitle();

    this.subscriptions.push(this.routingService.onChange.subscribe((value: any) => {
      if (value && value[value.length - 1]) {
        this.titleService.setTitle(this.getTitle(value[value.length - 1].data['title']));
        this.header = value[value.length - 1].data['title'];
        this.description = value[value.length - 1].data['description'];
      }
      this.changeDetectorRef.markForCheck();
    }));

    this.subscriptions.push(this.router.events.subscribe((routeEvent: RouterEvent) => {
      if (routeEvent instanceof NavigationStart) {
        this.navigationEnd = false;
      }
      if (routeEvent instanceof NavigationEnd) {
        this.navigationEnd = true;
        this.setContentMinHeight();
      }
    }));

    this.subscriptions.push(this.layoutStore.layout.subscribe((value: string) => {
      this.layout = value;
      this.setContentMinHeight();
    }));

    this.subscriptions.push(this.layoutStore.windowInnerHeight.subscribe((value: number) => {
      this.windowInnerHeight = value;
      this.setContentMinHeight();
    }));
    this.heightStyle = this.windowInnerHeight;
  }

  ngOnDestroy() {
    this.subscriptions = removeSubscriptions(this.subscriptions);
  }

  public get scrollHeight(): number {
    return this.contentInnerElement.nativeElement.scrollHeight;
  }

  private getTitle(title: string): string {
    return title ? `${title} - ${this.titleTag}` : this.titleTag;
  }

  private setContentMinHeight(): void {
    if (this.navigationEnd) {
      let heightStyle;

      const headerFooterOffsetHeight = this.headerService.offsetHeight + this.footerService.offsetHeight;

      if (this.layout === 'fixed') {
        heightStyle = this.windowInnerHeight - this.footerService.offsetHeight;
      } else {
        heightStyle = Math.max(
          this.windowInnerHeight - headerFooterOffsetHeight,
          this.sidebarLeftHeight - this.headerService.offsetHeight
        );
      }

      if (heightStyle && heightStyle !== this.heightStyle) {
        if (this.scrollHeight > heightStyle) {
          heightStyle = null;
        }
        this.heightStyle = heightStyle;
        this.changeDetectorRef.detectChanges();
      }
    }
  }
}

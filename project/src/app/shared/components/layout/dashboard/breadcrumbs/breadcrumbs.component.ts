import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { RoutingService } from '@core/services/routing.service';

@Component({
  selector: 'breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.css']
})
export class BreadcrumbsComponent implements OnInit, OnDestroy {
  public breadcrumbs;

  private subscription: Subscription;

  @Input() public homeIcon = 'fa fa-home';

  constructor(
    private routingService: RoutingService
  ) { }

  ngOnInit() {
    this.subscription = this.routingService.onChange.subscribe(value => {
      this.breadcrumbs = value;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

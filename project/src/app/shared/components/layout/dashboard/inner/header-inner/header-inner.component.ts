import { Component } from '@angular/core';
import { SessionService, RouterService } from '@core/services';
@Component({
  selector: 'header-inner',
  templateUrl: './header-inner.component.html'
})
export class HeaderInnerComponent {
  constructor(private sessionService: SessionService, private routeService: RouterService) { }

  get user() { return this.sessionService.getCurrentUser(); }

  signOut = () => {
    this.sessionService.logout().then(res => this.routeService.redirectToLogin());
  }
}

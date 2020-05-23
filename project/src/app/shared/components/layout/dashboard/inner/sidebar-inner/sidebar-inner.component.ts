import { Component } from '@angular/core';
import { SessionService } from '@core/services';

@Component({
  selector: 'sidebar-inner',
  templateUrl: './sidebar-inner.component.html'
})
export class SidebarInnerComponent {

  constructor(private sessionService: SessionService) { }

  get user() { return this.sessionService.getCurrentUser(); }
  
}

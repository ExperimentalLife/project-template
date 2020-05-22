import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { ActivationStart, Router, RouterEvent } from '@angular/router';

@Injectable()
export class LayoutService {
  public isCustomLayout: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private customLayout: boolean;

  constructor(
    private router: Router
  ) {
    this.init();
  }

  private init() {
    this.router.events.subscribe((event: RouterEvent) => {
      if (event instanceof ActivationStart) {
        this.customLayout = event.snapshot.data.customLayout;
        this.isCustomLayout.next(!!this.customLayout);
      }
    });
  }
}

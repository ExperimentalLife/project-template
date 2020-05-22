import { Injectable, Optional } from "@angular/core";
import { Subject, Observable } from 'rxjs';
import { Router, RouterEvent, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';

@Injectable()
export class RouteInterceptorService {
   private _isPendingRouteSubject = new Subject<boolean>();

   constructor(@Optional() private router: Router) {
      if (this.router)
         router.events.subscribe((event: RouterEvent) => this.routerInterceptor(event))
   }

   get isPendingRoute(): Observable<boolean> {
      return this._isPendingRouteSubject.asObservable();
   }

   private routerInterceptor(event: RouterEvent): void {
      if (event instanceof NavigationStart)
         this.onRouteStart();
      if (event instanceof (NavigationEnd || NavigationCancel || NavigationError))
         this.onRouteDone();
   }

   private onRouteStart(): void {
      this._isPendingRouteSubject.next(true);
   }

   private onRouteDone(): void {
      this._isPendingRouteSubject.next(false);
   }
}
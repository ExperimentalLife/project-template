import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { SessionService } from '../services/session.service';
import { RouterService } from '@core/services/router.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private routesService: RouterService, private sessionService: SessionService) { }

  canActivate(): Observable<boolean> {
    return of(this.sessionService.isAuthenticated())
      .pipe(
        map(auth => {
          if (!auth) {
            this.routesService.redirectToLogin()
            return false;
          }
          return true;
        }),
        take(1)
      );
  }
}

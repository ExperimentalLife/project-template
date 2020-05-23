import { Injectable, Injector } from "@angular/core";
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { HttpObservableService } from './http-observable.service';
import { finalize, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { RouterService } from '@core/services/router.service';
import { SessionService } from '@core/services/session.service';


@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
   private _httpObservableService: HttpObservableService;

   constructor(private injector: Injector, private routes: RouterService, private sessionService: SessionService) {
      this._httpObservableService = this.injector.get(HttpObservableService);
   }

   intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      this._httpObservableService.onRequestStart();

      let handleRequest;
      if (request.url.search('/api/Auth/token') !== 0)
         handleRequest = this.handleApiRequest(request, next);
      else
         handleRequest = next.handle(request);

      return handleRequest.pipe(
         finalize(() => {
            this._httpObservableService.onRequestDone();
         })
      );
   }

   handleApiRequest(request, next) {
      const token: string = this.sessionService.getCurrentToken();
      request = token
         ? request.clone({
            setHeaders: { Authorization: `Bearer ${token}` }
         })
         : request;

      const handler = next.handle(request).pipe(
         catchError((error, caught) => {
            if (error.status === (401 || 403)) {
               this.sessionService.logout().then(response => {
                  if (response) this.routes.redirectToError(error.status);
               });
            }
            return throwError(error);
         })
      );
      return handler;
   }
}

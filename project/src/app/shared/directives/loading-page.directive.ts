import { Directive, OnChanges, Input, TemplateRef, ViewContainerRef, SimpleChange } from "@angular/core";
import { HttpObservableService } from '@core/interceptors/http-observable.service';
import { RouteInterceptorService } from '@core/interceptors/route-interceptor.service';
import { LoadingPage } from '@core/models/common/loading-page.interface';

@Directive({
   selector: '[loadingPage]'
})
export class LoadingPageDirective implements OnChanges {
   public isPendingRequests: boolean;
   public isPendingRoute: boolean;

   private hasView = false;

   @Input() loadingPage: LoadingPage;

   constructor(
      private httpObservableService: HttpObservableService,
      private routeInterceptorService: RouteInterceptorService,
      private templateRef: TemplateRef<any>,
      private viewContainer: ViewContainerRef
   ) { }

   ngOnChanges(changes: { [propKey: string]: SimpleChange }): void {
      if (changes.loadingPage.currentValue)
         this.loadingPage = changes.loadingPage.currentValue;
      if (changes.loadingPage.firstChange)
         this.init();
   }

   private init() {
      if (!this.loadingPage || this.loadingPage.checkPendingHttp)
         this.httpObservableService.isPendingRequests.subscribe(value => {
            this.isPendingRequests = value;
            this.isVisible();
         });

      if (!this.loadingPage || this.loadingPage.checkPendingRoute)
         this.routeInterceptorService.isPendingRoute.subscribe(value => {
            this.isPendingRoute = value;
            this.isVisible();
         })
   }

   private isVisible() {
      if (this.hasView && !this.isPendingRequests && !this.isPendingRoute) {
         this.viewContainer.clear();
         this.hasView = false;
      } else if (!this.hasView && (this.isPendingRequests || this.isPendingRoute)) {
         this.viewContainer.createEmbeddedView(this.templateRef);
         this.hasView = true;
      }
   }
}
import { Component, OnInit, OnDestroy, ElementRef, Renderer2, NgZone } from "@angular/core";
import { WrapperService } from '@core/services/layout/wrapper.service';
import { Subscription } from 'rxjs';
import { throttle, removeSubscriptions, removeListeners } from '@core/helpers/functions';
import { LayoutStoreService } from '@core/services/layout/layout-store.service';

@Component({
   selector: 'layout-wrapper',
   templateUrl: './wrapper.component.html',
   styleUrls: ['./wrapper.component.css']
})
export class WrapperComponent implements OnInit, OnDestroy {
   private _skin: string;
   private _listeners: Array<any> = [];
   private _subscriptions: Array<Subscription> = [];

   public classes: string;

   constructor(
      private elementRef: ElementRef,
      private renderer2: Renderer2,
      private layoutStore: LayoutStoreService,
      private wrapperService: WrapperService,
      private ngZone: NgZone
   ) { };

   ngOnInit(): void {
      this.layoutStore.setWindowInnerHeight(window.innerHeight);
      this.layoutStore.setWindowInnerWidth(window.innerWidth);

      this.wrapperService.wrapperElementRef = this.elementRef;

      this._subscriptions.push(this.layoutStore.wrapperClasses.subscribe((value: string) =>
         this.classes = value ? value : null
      ));

      this.ngZone.runOutsideAngular(() => this._listeners.push(
         this.renderer2.listen('window', 'resize', throttle(() => {
            this.layoutStore.setWindowInnerHeight(window.innerHeight);
            this.layoutStore.setWindowInnerWidth(window.innerWidth);
         }, 250))
      ));

      this._subscriptions.push(this.layoutStore.layout.subscribe((value: string) => {
         value === 'fixed' ? this.renderer2.addClass(this.elementRef.nativeElement, 'fixed') :
            this.renderer2.removeClass(this.elementRef.nativeElement, 'fixed');
         value === 'boxed' ? this.renderer2.addClass(this.elementRef.nativeElement, 'layout-boxed') :
            this.renderer2.removeClass(this.elementRef.nativeElement, 'layout-boxed');
      }));

      this._subscriptions.push(this.layoutStore.skin.subscribe((value: string) => {
         if (value) {
            if (this._skin && this._skin !== value) {
               this.renderer2.removeClass(this.elementRef.nativeElement, `skin-${this._skin}`);
            }
            this._skin = value;
            this.renderer2.addClass(this.elementRef.nativeElement, `skin-${this._skin}`);
         }
      }));
   }

   ngOnDestroy() {
      this._subscriptions = removeSubscriptions(this._subscriptions);
      this._listeners = removeListeners(this._listeners);
   }
}
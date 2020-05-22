import { SkipSelf, Optional, NgModule } from '@angular/core';
import { throwIfAlreadyLoaded } from './guards/module-import.guard';
import { AuthGuard } from './guards/auth.guard';
import { services } from './services';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpInterceptorService } from './interceptors/http-interceptor.service';


@NgModule({
   imports: [
      HttpClientModule,
      BrowserModule,
      BrowserAnimationsModule,
   ],
   exports: [
      HttpClientModule,
      BrowserModule,
      BrowserAnimationsModule
   ],
   providers: [
      AuthGuard,
      [...services],
      {
         provide: HTTP_INTERCEPTORS,
         useClass: HttpInterceptorService,
         multi: true
      }
   ]
})
export class CoreModule {
   constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
      throwIfAlreadyLoaded(parentModule, 'CoreModule');
   }
}

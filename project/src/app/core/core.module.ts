import { SkipSelf, Optional, NgModule } from '@angular/core';
import { throwIfAlreadyLoaded } from './guards/module-import.guard';
import { AuthGuard } from './guards/auth.guard';
import { services } from './services';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpInterceptorService } from './interceptors/http-interceptor.service';
import { AuthServiceConfig } from './social/auth.service';
import { SocialLoginModule } from './social/sociallogin.module';
import { providerSocialConfig } from './social/providers/config-provider';


@NgModule({
   imports: [
   ],
   exports: [
      HttpClientModule,
      BrowserModule,
      BrowserAnimationsModule,
      SocialLoginModule
   ],
   providers: [
      AuthGuard,
      [...services],
      {
         provide: HTTP_INTERCEPTORS,
         useClass: HttpInterceptorService,
         multi: true
      },
      {
         provide: AuthServiceConfig,
         useFactory: providerSocialConfig
      }
   ]
})
export class CoreModule {
   constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
      throwIfAlreadyLoaded(parentModule, 'CoreModule');
   }
}

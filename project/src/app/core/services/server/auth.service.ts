import { Injectable } from '@angular/core';
import { SocialAuthService } from '@core/social/auth.service';
import { GoogleLoginProvider } from '@core/social/providers/google-login-provider';
import { FacebookLoginProvider } from '@core/social/providers/facebook-login-provider';
import { HttpClient } from '@angular/common/http';
import { Result } from '@core/models/result.model';

@Injectable()
export class AuthService {

   constructor(private socialService: SocialAuthService,
      private http: HttpClient) { }

   token = (object: any): Promise<any> => new Promise((resolve) => {
      this.http.post<Result<any>>(`/api/Auth/token`, object)
         .subscribe(
            data => resolve(data.data),
            err => resolve(null)
         )
   });


   signInWithGoogle(): void {
      this.socialService.signIn(GoogleLoginProvider.PROVIDER_ID);
   }

   signInWithFacebook(): void {
      this.socialService.signIn(FacebookLoginProvider.PROVIDER_ID);
   }

   signOut(): void {
      this.socialService.signOut();
   }


}

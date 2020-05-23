import { AuthServiceConfig } from '../auth.service';
import { GoogleLoginProvider } from './google-login-provider';
import { FacebookLoginProvider } from './facebook-login-provider';
import { defineConfig } from '@core/helpers/layout.define-config';

export function providerSocialConfig() {
   return new AuthServiceConfig([
      {
         id: GoogleLoginProvider.PROVIDER_ID,
         provider: new GoogleLoginProvider(defineConfig.social.googleId)
      },
      {
         id: FacebookLoginProvider.PROVIDER_ID,
         provider: new FacebookLoginProvider(defineConfig.social.facebookId)
      }
   ]);
}

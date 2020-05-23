import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, ReplaySubject, isObservable } from 'rxjs';
import { first } from 'rxjs/operators'
import { LoginProvider } from './entities/login-provider';
import { SocialUser } from './entities/user';

export interface AuthServiceConfigItem {
  id: string;
  provider: LoginProvider;
  lazyLoad?: boolean;
}

export interface LoginOpt {
  auth_type?: string;
  scope?: string;
  return_scopes?: boolean;
  enable_profile_selector?: boolean;
  profile_selector_ids?: string;
  client_id?: string;
  cookie_policy?: string;
  fetch_basic_profile?: boolean;
  hosted_domain?: string;
  openid_realm?: string;
  ux_mode?: string;
  redirect_uri?: string;
  offline_access?: boolean;
  prompt?: string;
  login_hint?: string;
}

export class AuthServiceConfig {
  lazyLoad = false;
  providers: Map<string, LoginProvider> = new Map<string, LoginProvider>();
  _ready: ReplaySubject<any> = new ReplaySubject()

  constructor(providers: AuthServiceConfigItem[] | Observable<AuthServiceConfigItem[]>) {
    if (isObservable(providers)) {
      providers.pipe(first()).subscribe(providerList => {
        this.initialize(providerList)
      })
    } else {
      this.initialize(providers as AuthServiceConfigItem[])
    }
  }

  initialize(providers: AuthServiceConfigItem[]) {
    for (let i = 0; i < providers.length; i++) {
      let element = providers[i];
      this.providers.set(element.id, element.provider);
      this.lazyLoad = this.lazyLoad || element.lazyLoad;

    }
    this._ready.next()
    this._ready.complete()
  }


}


@Injectable()
export class SocialAuthService {

  private static readonly ERR_LOGIN_PROVIDER_NOT_FOUND = 'Login provider not found';
  private static readonly ERR_NOT_LOGGED_IN = 'Not logged in';

  private providers: Map<string, LoginProvider>;

  private _user: SocialUser = null;
  private _authState: ReplaySubject<SocialUser> = new ReplaySubject(1);
  private _readyState: BehaviorSubject<string[]> = new BehaviorSubject([]);

  private initialized = false;

  get authState(): Observable<SocialUser> {
    return this._authState.asObservable();
  }
  get readyState(): Observable<string[]> {
    return this._readyState.asObservable();
  }

  constructor(config: AuthServiceConfig) {

    config._ready.subscribe(() => {
      this.providers = config.providers;
      if (!config.lazyLoad) {
        this.initialize();
      }
    });
  }

  private initialize() {
    this.initialized = true;
    this.providers.forEach((provider: LoginProvider, key: string) => {
      provider.initialize().then(() => {
        let readyProviders = this._readyState.getValue();
        readyProviders.push(key);
        this._readyState.next(readyProviders);

        provider.getLoginStatus().then((user) => {
          user.provider = key;

          this._user = user;
          this._authState.next(user);
        }).catch((err) => {
          this._authState.next(null);
        });
      });
    });
  }

  signIn(providerId: string, opt?: LoginOpt): Promise<SocialUser> {
    if (!this.initialized) {
      this.initialize();
    }
    return new Promise((resolve, reject) => {
      let providerObject = this.providers.get(providerId);
      if (providerObject) {
        providerObject.signIn(opt).then((user: SocialUser) => {
          user.provider = providerId;
          resolve(user);

          this._user = user;
          this._authState.next(user);
        }).catch(err => {
          reject(err);
        });
      } else {
        reject(SocialAuthService.ERR_LOGIN_PROVIDER_NOT_FOUND);
      }
    });
  }

  signOut(revoke: boolean = false): Promise<any> {
    if (!this.initialized) {
      this.initialize();
    }

    return new Promise((resolve, reject) => {
      if (!this._user) {
        reject(SocialAuthService.ERR_NOT_LOGGED_IN);
      } else {
        let providerId = this._user.provider;
        let providerObject = this.providers.get(providerId);
        if (providerObject) {
          providerObject.signOut(revoke).then(() => {
            resolve();

            this._user = null;
            this._authState.next(null);
          }).catch((err) => {
            reject(err);
          });
        } else {
          reject(SocialAuthService.ERR_LOGIN_PROVIDER_NOT_FOUND);
        }
      }
    });
  }

}

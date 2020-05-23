import { Component, OnInit } from '@angular/core';
import { SocialAuthService } from '@core/social/auth.service';
import { SocialUser } from '@core/social/entities';
import { AuthService, SessionService, RouterService } from '@core/services';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Session } from '@core/models/session.model';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public form: FormGroup;
  public submit = false;
  loading = false;

  private _user: SocialUser;
  private _loggedIn: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private socialService: SocialAuthService,
    private sessionService: SessionService,
    private routerService: RouterService,
    public authService: AuthService) { this.createForm(); }

  ngOnInit() {
    this.socialService.authState.subscribe((user) => {
      this._user = user;
      this._loggedIn = (user != null);
    });
  }

  createForm = () => {
    this.form = this.formBuilder.group({
      username: [null, Validators.compose([Validators.required, Validators.maxLength(20)])],
      password: [null, Validators.compose([Validators.required, Validators.maxLength(20)])]
    });
  }
  get username() { return this.form.get('username'); }

  onSubmit(): void {
    this.submit = true;
    if (this.form.valid) {
      this.loading = true;
      const object = {};
      Object.assign(object, this.form.value);
      this.authService.token(object).then(response => {
        if (response != null)
          this.correctLogin(response);
          this.routerService.redirectToDashboard();
        this.loading = false;
      });
    }
  }

  private correctLogin(response: any) {
    const session: Session = {
      user: response,
      context: null,
      token: response.authToken,
      expiration: response.fecha_expiracion
    };
    this.sessionService.setCurrentSession(session);
  }
}

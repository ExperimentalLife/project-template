import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class RouterService {

   constructor(private router: Router) { }

   redirectToDashboard() {
      this.router.navigate(['/auth/dashboard']);
   }

   redirectToLogin() {
      this.router.navigate(['/auth/login']);
   }

   redirectToForgot() {
      this.router.navigate(['/auth/forgot']);
   }

   redirectToChange() {
      this.router.navigate(['/auth/change']);
   }

   redirectToError(code?) {
      this.router.navigate(['/error']);
   }

   redirectionToAny(route: string, params?) {
      this.router.navigate([route], params);
   }
}

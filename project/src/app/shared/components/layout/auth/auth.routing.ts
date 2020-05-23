import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from '@features/auth/login/login.component';

export const routes: Routes = [
   {
      path: 'login',
      component: LoginComponent
   }
];


export const routingAuthLayout = RouterModule.forChild(routes);
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardLayoutComponent } from '@shared/components/layout/dashboard/dashboard.component';
import { AuthLayoutComponent } from '@shared/components/layout/auth/auth.component';
import { AuthGuard } from '@core/guards/auth.guard';


const routes: Routes = [
  {
    canActivate: [AuthGuard],
    path: '',
    component: DashboardLayoutComponent,
    loadChildren: () => import('./shared/components/layout/dashboard/dashboard.module').then(m => m.DashboardLayoutModule)
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    loadChildren: () => import('./shared/components/layout/auth/auth.module').then(m => m.AuthLayoutModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

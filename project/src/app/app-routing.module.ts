import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from '@shared/components/layout/dashboard/dashboard.component';


const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    loadChildren: () => import('./shared/components/layout/dashboard/dashboard.module').then(m => m.DashboardModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

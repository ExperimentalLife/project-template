import { Routes, RouterModule } from '@angular/router';
import { InfectedComponent } from '@features/dashboard/infected/infected.component';
import { BlankComponent } from '@features/dashboard/blank/blank.component';

export const routes: Routes = [
   {
      path: '',
      data: { title: 'Bienvenido' },
      component: BlankComponent
   },
   {
      path: 'infected',
      data: { title: 'Infectados', description: "Información extraida de la OMS" },
      component: InfectedComponent
   }
];


export const routingDashboardLayout = RouterModule.forChild(routes);
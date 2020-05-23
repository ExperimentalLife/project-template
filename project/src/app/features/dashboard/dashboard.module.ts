import { NgModule } from "@angular/core";
import { SharedModule } from '@shared/shared.module';
import { CommonModule } from '@angular/common';
import { InfectedComponent } from './infected/infected.component';
import { BlankComponent } from './blank/blank.component';

@NgModule({
   imports: [
      CommonModule,
      SharedModule
   ],
   declarations: [InfectedComponent, BlankComponent]
})
export class DashboardModule { }
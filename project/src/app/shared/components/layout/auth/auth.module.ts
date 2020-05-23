import { NgModule } from "@angular/core";
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { routingAuthLayout } from './auth.routing';
import { AuthLayoutComponent } from './auth.component';
import { AuthModule } from '@features/auth/auth.module';

@NgModule({
   imports: [
      CommonModule,
      RouterModule,
      routingAuthLayout,
      AuthModule
   ],
   declarations: [AuthLayoutComponent]
})
export class AuthLayoutModule { }
import { NgModule } from '@angular/core';

import { LoginComponent } from './login/login.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({

   imports: [
      CommonModule,
      ReactiveFormsModule
   ],
   declarations: [
      LoginComponent
   ],
   exports: [LoginComponent]
})
export class AuthModule { }

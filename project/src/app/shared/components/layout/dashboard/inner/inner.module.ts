import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { HeaderInnerComponent } from './header-inner/header-inner.component';
import { SidebarInnerComponent } from './sidebar-inner/sidebar-inner.component';
import { BoxModule } from '../others/box/box.module';
import { TabsModule } from '../others/tabs/tabs.module';

@NgModule({
   imports: [
      CommonModule,
      FormsModule,
      HttpClientModule,
      TabsModule,
      BoxModule
   ],
   declarations: [HeaderInnerComponent, SidebarInnerComponent],
   exports: [BoxModule, TabsModule, HeaderInnerComponent, SidebarInnerComponent]
})
export class InnerModule { }

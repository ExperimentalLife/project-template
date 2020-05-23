import { NgModule } from "@angular/core";
import { DashboardLayoutComponent } from './dashboard.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ContentModule } from './content/content.module';
import { FooterModule } from './footer/footer.module';
import { HeaderModule } from './header/header.module';
import { SidebarModule } from './sidebar/sidebar.module';
import { WrapperModule } from './wrapper/wrapper.module';
import { routingDashboardLayout } from './dashboard.routing';
import { MaterialBarModule } from '@shared/components/loaders/material-bar/material-bar.module';
import { LoadingPageDirective } from '@shared/directives/loading-page.directive';
import { InnerModule } from './inner/inner.module';
import { DashboardModule } from '@features/dashboard/dashboard.module';

@NgModule({
   imports: [
      CommonModule,
      RouterModule,
      routingDashboardLayout,
      ContentModule,
      FooterModule,
      HeaderModule,
      SidebarModule,
      WrapperModule,
      MaterialBarModule,
      InnerModule,

      DashboardModule
   ],
   declarations: [DashboardLayoutComponent, LoadingPageDirective]
})
export class DashboardLayoutModule { }
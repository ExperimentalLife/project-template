import { NgModule } from "@angular/core";
import { DashboardComponent } from './dashboard.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ContentModule } from './content/content.module';
import { FooterModule } from './footer/footer.module';
import { HeaderModule } from './header/header.module';
import { SidebarModule } from './sidebar/sidebar.module';
import { WrapperModule } from './wrapper/wrapper.module';
import { routingDashboard } from './dashboard.routing';
import { MaterialBarModule } from '@shared/components/loaders/material-bar/material-bar.module';
import { LoadingPageDirective } from '@shared/directives/loading-page.directive';

@NgModule({
   imports: [
      CommonModule,
      RouterModule,
      routingDashboard,
      ContentModule,
      FooterModule,
      HeaderModule,
      SidebarModule,
      WrapperModule,
      MaterialBarModule
   ],
   declarations: [DashboardComponent, LoadingPageDirective]
})
export class DashboardModule { }
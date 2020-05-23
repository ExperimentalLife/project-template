import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SidebarComponent } from './sidebar.component';
import { SidebarToggleDirective } from '@shared/directives/sidebar.directive';
import { AnimationsModule } from '@shared/directives/animations.module';

@NgModule({
    imports: [CommonModule, RouterModule, AnimationsModule],
    exports: [SidebarComponent],
    declarations: [SidebarToggleDirective, SidebarComponent]
})
export class SidebarModule { }

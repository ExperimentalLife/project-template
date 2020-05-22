import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SidebarComponent } from './sidebar.component';
import { SidebarToggleDirective } from '@shared/directives/layout/sidebar.directive';
import { CollapseAnimationDirective } from '@shared/directives/animations.directive';

@NgModule({
    imports: [CommonModule, RouterModule],
    exports: [SidebarComponent],
    declarations: [SidebarToggleDirective, SidebarComponent, CollapseAnimationDirective]
})
export class SidebarModule { }

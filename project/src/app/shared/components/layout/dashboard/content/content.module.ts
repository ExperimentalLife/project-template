import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ContentComponent } from './content.component';
import { BreadcrumbsModule } from '../breadcrumbs/breadcrumbs.module';

@NgModule({
    imports: [CommonModule, RouterModule, BreadcrumbsModule],
    exports: [ContentComponent],
    declarations: [ContentComponent]
})
export class ContentModule { }

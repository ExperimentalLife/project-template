import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BoxComponent } from './box.component';
import { BoxHeaderDirective, BoxContentDirective, BoxFooterDirective, BoxToolsDirective } from '@shared/directives/box.directive';
import { AnimationsModule } from '@shared/directives/animations.module';
import { ColorModule } from '@shared/directives/color.module';


@NgModule({
    imports: [CommonModule,  AnimationsModule, ColorModule],
    exports: [BoxComponent, BoxHeaderDirective, BoxContentDirective, BoxFooterDirective, BoxToolsDirective],
    declarations: [BoxComponent, BoxHeaderDirective, BoxContentDirective, BoxFooterDirective, BoxToolsDirective]
})
export class BoxModule {}

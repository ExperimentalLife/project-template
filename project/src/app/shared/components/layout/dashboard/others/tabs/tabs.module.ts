import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TabsComponent, TabsHeaderComponent, TabComponent, TabHeaderComponent, TabContentComponent } from './tabs.component';
import { ColorModule } from '@shared/directives/color.module';
import { TabToggleDirective } from '@shared/directives/tabs.directive';

@NgModule({
    imports: [CommonModule, ColorModule],
    exports: [TabsComponent, TabsHeaderComponent, TabComponent, TabHeaderComponent, TabContentComponent],
    declarations: [TabToggleDirective, TabsComponent, TabsHeaderComponent, TabComponent, TabHeaderComponent, TabContentComponent]
})
export class TabsModule {}

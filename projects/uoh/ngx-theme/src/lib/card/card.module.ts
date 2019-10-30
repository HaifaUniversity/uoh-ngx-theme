import { NgModule } from '@angular/core';
import { LayoutModule } from '@angular/cdk/layout';

import { UohCardDirective } from './card.directive';
import { UohCardComponent } from './card.component';

@NgModule({
  declarations: [UohCardDirective, UohCardComponent],
  imports: [LayoutModule],
  exports: [UohCardDirective, UohCardComponent]
})
export class UohCardModule {}

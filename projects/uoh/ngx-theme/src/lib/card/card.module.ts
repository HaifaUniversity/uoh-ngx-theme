import { NgModule } from '@angular/core';
import { LayoutModule } from '@angular/cdk/layout';

import { UohCardDirective } from './card.directive';

@NgModule({
  declarations: [UohCardDirective],
  imports: [LayoutModule],
  exports: [UohCardDirective]
})
export class UohCardModule {}

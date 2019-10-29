import { NgModule } from '@angular/core';

import { UohContentDirective } from './content.directive';

@NgModule({
  declarations: [UohContentDirective],
  exports: [UohContentDirective]
})
export class UohContentModule {}

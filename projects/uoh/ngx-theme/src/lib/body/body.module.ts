import { NgModule } from '@angular/core';

import { UohBodyComponent } from './body.component';
import { UohContentModule } from '../content/content.module';

/**
 * Creates a body for the theme.
 */
@NgModule({
  declarations: [UohBodyComponent],
  imports: [UohContentModule],
  exports: [UohBodyComponent]
})
export class UohBodyModule {}

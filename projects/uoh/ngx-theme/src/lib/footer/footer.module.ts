import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FooterComponent } from './footer.component';
import { UohContentModule } from '../content/content.module';

@NgModule({
  declarations: [FooterComponent],
  imports: [CommonModule, UohContentModule],
  exports: [FooterComponent, UohContentModule]
})
export class UohFooterModule {}

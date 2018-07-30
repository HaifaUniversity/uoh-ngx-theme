import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule, MatIconModule } from '@angular/material';

import { BackToTopComponent } from './back-to-top.component';
import { UohBackToTop } from './back-to-top.service';

@NgModule({
  declarations: [BackToTopComponent],
  imports: [CommonModule, MatButtonModule, MatIconModule],
  exports: [BackToTopComponent],
  providers: [UohBackToTop]
})
export class UohBackToTopModule {}

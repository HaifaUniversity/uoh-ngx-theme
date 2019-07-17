import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { BackToTopComponent } from './back-to-top.component';
import { UohBackToTop } from './back-to-top.service';

@NgModule({
  declarations: [BackToTopComponent],
  imports: [CommonModule, MatButtonModule, MatIconModule],
  exports: [BackToTopComponent],
  providers: [UohBackToTop]
})
export class UohBackToTopModule {}

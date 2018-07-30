import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule, MatIconModule } from '@angular/material';

import { BackToTopComponent } from './back-to-top.component';
import { UohBackToTopDirective } from './back-to-top.directive';
import { UohBackToTop } from './back-to-top.service';

@NgModule({
  declarations: [BackToTopComponent, UohBackToTopDirective],
  imports: [CommonModule, MatButtonModule, MatIconModule],
  exports: [BackToTopComponent, UohBackToTopDirective],
  providers: [UohBackToTop]
})
export class UohBackToTopModule {}

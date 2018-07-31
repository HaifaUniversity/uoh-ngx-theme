import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule, MatButtonModule, MatListModule, MatIconModule } from '@angular/material';

import { AccessibilityComponent } from './accessibility.component';
import { UohContentModule } from '../content/content.module';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    UohContentModule
  ],
  declarations: [AccessibilityComponent],
  exports: [AccessibilityComponent, UohContentModule]
})
export class UohAccessibilityModule {}

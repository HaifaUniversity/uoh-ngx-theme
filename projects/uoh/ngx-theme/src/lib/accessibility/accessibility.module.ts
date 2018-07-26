import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule, MatButtonModule, MatListModule, MatIconModule } from '@angular/material';

import { AccessibilityComponent } from './accessibility.component';

@NgModule({
  imports: [BrowserAnimationsModule, CommonModule, MatButtonModule, MatIconModule, MatListModule, MatSidenavModule],
  declarations: [AccessibilityComponent],
  exports: [AccessibilityComponent]
})
export class UohAccessibilityModule {}

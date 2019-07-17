import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';

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

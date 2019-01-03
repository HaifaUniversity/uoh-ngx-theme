import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  MatToolbarModule,
  MatButtonModule,
  MatIconModule,
  MatMenuModule,
  MatDividerModule,
  MatRippleModule
} from '@angular/material';

import { HeaderComponent } from './header.component';
import { UohContentModule } from '../content/content.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
    MatRippleModule,
    UohContentModule
  ],
  declarations: [HeaderComponent],
  exports: [HeaderComponent, UohContentModule]
})
export class UohHeaderModule {}

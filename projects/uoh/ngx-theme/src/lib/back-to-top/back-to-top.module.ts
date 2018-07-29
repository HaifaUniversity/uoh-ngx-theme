import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule, MatIconModule } from '@angular/material';
import { BackToTopComponent } from './back-to-top.component';

@NgModule({
  declarations: [BackToTopComponent],
  imports: [CommonModule, MatButtonModule, MatIconModule],
  exports: [BackToTopComponent]
})
export class UohBackToTopModule {}

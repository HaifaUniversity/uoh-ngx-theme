import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule, MatButtonModule, MatIconModule } from '@angular/material';

import { HeaderComponent } from './header.component';
import { UohContentModule } from '../content/content.module';

@NgModule({
  imports: [CommonModule, MatToolbarModule, MatButtonModule, MatIconModule, UohContentModule],
  declarations: [HeaderComponent],
  exports: [HeaderComponent, UohContentModule]
})
export class UohHeaderModule {}

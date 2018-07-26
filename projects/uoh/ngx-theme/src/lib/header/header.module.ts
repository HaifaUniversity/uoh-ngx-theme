import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule, MatButtonModule, MatIconModule } from '@angular/material';

import { HeaderComponent } from './header.component';

@NgModule({
  imports: [CommonModule, MatToolbarModule, MatButtonModule, MatIconModule],
  declarations: [HeaderComponent],
  exports: [HeaderComponent]
})
export class UohHeaderModule {}

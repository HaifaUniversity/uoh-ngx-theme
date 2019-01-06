import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule, MatDividerModule } from '@angular/material';

import { HeaderComponent } from './header.component';
import { UohContentModule } from '../content/content.module';
import { UohHeaderLink } from './header-link.directive';
import { UohHeaderRouterLink } from './header-router-link.directive';
import { UohHeaderMenuLink } from './header-menu-link.directive';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
    UohContentModule
  ],
  declarations: [HeaderComponent, UohHeaderLink, UohHeaderRouterLink, UohHeaderMenuLink],
  exports: [HeaderComponent, UohContentModule, UohHeaderLink, UohHeaderRouterLink, UohHeaderMenuLink]
})
export class UohHeaderModule {}

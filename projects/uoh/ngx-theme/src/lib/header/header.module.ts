import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';

import { HeaderComponent } from './header.component';
import { UohHeaderLink } from './header-link.directive';
import { UohHeaderRouterLink } from './header-router-link.directive';
import { UohHeaderMenuLink } from './header-menu-link.directive';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot([]),
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule
  ],
  declarations: [HeaderComponent, UohHeaderLink, UohHeaderRouterLink, UohHeaderMenuLink],
  exports: [HeaderComponent, UohHeaderLink, UohHeaderRouterLink, UohHeaderMenuLink]
})
export class UohHeaderModule {}

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {
  UohAccessibilityModule,
  UohSpinnerModule,
  UohHeaderModule,
  UohSpinner,
  UohBackToTopModule
} from '@uoh/ngx-theme';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, UohAccessibilityModule, UohSpinnerModule, UohHeaderModule, UohBackToTopModule],
  providers: [UohSpinner],
  bootstrap: [AppComponent]
})
export class AppModule {}

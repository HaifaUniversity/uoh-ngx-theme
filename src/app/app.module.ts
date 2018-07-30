import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {
  UohAccessibilityModule,
  UohSpinnerModule,
  UohHeaderModule,
  UohSpinner,
  UohBackToTopModule,
  UohFooterModule
} from '@uoh/ngx-theme';

import { AppComponent } from './app.component';
import { OneComponent } from './one/one.component';
import { TwoComponent } from './two/two.component';
import { routing } from './app.routing';

@NgModule({
  declarations: [AppComponent, OneComponent, TwoComponent],
  imports: [
    BrowserModule,
    UohAccessibilityModule,
    UohSpinnerModule,
    UohHeaderModule,
    UohBackToTopModule,
    UohFooterModule,
    routing
  ],
  providers: [UohSpinner],
  bootstrap: [AppComponent]
})
export class AppModule {}

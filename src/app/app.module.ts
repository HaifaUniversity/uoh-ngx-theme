import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { UohAccessibilityModule, UohSpinnerModule, UohHeaderModule, UohSpinner } from '@uoh/ngx-theme';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, UohAccessibilityModule, UohSpinnerModule, UohHeaderModule],
  providers: [UohSpinner],
  bootstrap: [AppComponent]
})
export class AppModule {}

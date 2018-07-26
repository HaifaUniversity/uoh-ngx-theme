import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { UohAccessibilityModule } from '@uoh/ngx-theme';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, UohAccessibilityModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}

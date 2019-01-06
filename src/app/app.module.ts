import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatCardModule,
  MatSelectModule,
  MatInputModule,
  MatSnackBarModule,
  MatCheckboxModule,
  MatRadioModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatMenuModule
} from '@angular/material';
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
    FormsModule,
    MatInputModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
    MatSnackBarModule,
    MatMenuModule,
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

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
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
    MatIconModule,
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

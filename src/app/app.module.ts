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
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { CdkTableModule } from '@angular/cdk/table';
import {
  UohAccessibilityModule,
  UohSpinnerModule,
  UohHeaderModule,
  UohSpinner,
  UohBackToTopModule,
  UohFooterModule,
  UohCardModule,
  UohBodyModule
} from '@uoh/ngx-theme';

import { AppComponent } from './app.component';
import { OneComponent } from './one/one.component';
import { TwoComponent } from './two/two.component';
import { ThreeComponent } from './three/three.component';
import { routing } from './app.routing';

@NgModule({
  declarations: [AppComponent, OneComponent, TwoComponent, ThreeComponent],
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
    MatProgressBarModule,
    CdkTableModule,
    MatTableModule,
    UohAccessibilityModule,
    UohSpinnerModule,
    UohHeaderModule,
    UohBackToTopModule,
    UohFooterModule,
    UohBodyModule,
    UohCardModule,
    routing
  ],
  providers: [UohSpinner],
  bootstrap: [AppComponent]
})
export class AppModule {}

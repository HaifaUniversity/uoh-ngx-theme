import { Component } from '@angular/core';
import { UohSpinner } from '@uoh/ngx-theme';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  user: string;

  constructor(private spinner: UohSpinner) {}

  load(): void {
    this.spinner.show();
    setTimeout(_ => this.spinner.hide(), 3000);
  }

  logIn(): void {
    this.user = 'משתמש לדוגמה';
  }

  logOut(): void {
    this.user = undefined;
  }
}

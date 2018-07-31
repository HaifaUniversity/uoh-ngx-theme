import { Component } from '@angular/core';
import { UohSpinner } from '@uoh/ngx-theme';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  show = true;
  user: string;
  data = [
    { c1: 'משתמש 1', c2: 'תפקיד משתמש 1' },
    { c1: 'משתמש 2', c2: 'תפקיד משתמש 2' },
    { c1: 'משתמש 3', c2: 'תפקיד משתמש 3' },
    { c1: 'משתמש 4', c2: 'תפקיד משתמש 4' },
    { c1: 'משתמש 5', c2: 'תפקיד משתמש 5' }
  ];

  constructor(private spinner: UohSpinner) {}

  load(): void {
    this.spinner.show();
    setTimeout(_ => this.spinner.hide(), 20000);
  }

  logIn(): void {
    this.user = 'משתמש לדוגמה';
  }

  logOut(): void {
    this.user = undefined;
  }
}

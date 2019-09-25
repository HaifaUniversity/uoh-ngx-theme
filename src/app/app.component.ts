import { Component, OnInit } from '@angular/core';
import { UohSpinner, UohHeaderUser } from '@uoh/ngx-theme';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  show = true;
  user: UohHeaderUser;
  data = [
    { c1: 'משתמש 1', c2: 'תפקיד משתמש 1' },
    { c1: 'משתמש 2', c2: 'תפקיד משתמש 2' },
    { c1: 'משתמש 3', c2: 'תפקיד משתמש 3' },
    { c1: 'משתמש 4', c2: 'תפקיד משתמש 4' },
    { c1: 'משתמש 5', c2: 'תפקיד משתמש 5' }
  ];

  constructor(private spinner: UohSpinner) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.spinner.show();
    setTimeout(_ => this.spinner.show(), 1000);
    setTimeout(_ => this.spinner.hide(), 20000);
  }

  logIn(): void {
    this.user = {
      name: 'משתמש לדוגמה',
      details: 'juanito@manito.com<br>תאריך לידה: 01/01/01',
      lastLogin: 'כניסה\nאחרונה למערכת ב-20/12/2018 12:00:00'
    };
  }

  logOut(): void {
    this.user = undefined;
  }
}

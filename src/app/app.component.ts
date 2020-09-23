import { Component, OnInit } from '@angular/core';
import { UohSpinner, UohHeaderUser } from '@uoh/ngx-theme';

import { of, Observable } from 'rxjs';
import { delay, concatMap } from 'rxjs/operators';

import { version } from 'package.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
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
    { c1: 'משתמש 5', c2: 'תפקיד משתמש 5' },
  ];
  test$: Observable<string>;
  version = version;

  constructor(private spinner: UohSpinner) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    // this.spinner.add();
    this.test$ = of(1000, 2000, 2340).pipe(
      concatMap((val) =>
        of(`Delayed by ${val}`).pipe(
          this.spinner.addOnEvent(),
          delay(val)
          // this.spinner.removeOnFinalize()
        )
      ),
      this.spinner.clearOnFinalize()
    );
  }

  logIn(): void {
    this.user = {
      name: 'משתמש לדוגמה',
      details: 'juanito@manito.com<br>תאריך לידה: 01/01/01',
      lastLogin: 'כניסה\nאחרונה למערכת ב-20/12/2018 12:00:00',
    };
  }

  logOut(): void {
    this.user = undefined;
  }
}

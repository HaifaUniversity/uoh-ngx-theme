# University of Haifa Angular Theme

A preset of the University of Haifa design based on Material for Angular.

## Installation

```bash
$ npm install @uoh/ngx-theme --save
```

## Contents

This library includes the following modules:

- SCSS file including color themes and design configurations
- An accessibility module containing accessibility features
- A header module with the logo of the University of Haifa and log-in logic
- A footer module with the details of the university and the version of the application (optional)
- A back-to-top module with a button to jump to the top of the page after scrolling
- A spinner module with a loader animation with the logo of the university

### SCSS Theme

This file contains a default and a dark color theme, a layout design and presets for responsive tables.

#### Install Material design and its icons font

First, install [angular material](https://material.angular.io/guide/getting-started).
Secondly, add the following tag to the `head` section of your `index.html` file:

```xml
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
```

#### Include the favicon

Add the following line to the `options` --> `assets` array under both the `build` and the `test` sections in the `angular.json` file:

```json
{ "glob": "favicon.ico", "input": "./node_modules/@uoh/ngx-theme/assets", "output": "/" }
```

#### Include the theme

Add the following lines to the `styles.scss` file in your application:

```scss
@import '~@uoh/ngx-theme/theme';

@include uoh-theme();
```

The `uoh-theme` mixin contains all the designs and configurations for all the modules. If you want to avoid some of these presets (to minimize the size of the css output) you must pass a configuration map parameter to the mixin with the modules you want to exclude.

For example:

```scss
// Exclude all the modules (include only the core):
$config: (
  layout: false,
  table: false,
  accessibility: false,
  header: false,
  footer: false,
  spinner: false
);

@include uoh-theme($config...);
```

##### Layout support

This feature contains the `small-card` and the `medium-card` classes to set different mat-card sizes and a `fill-remaining-space` class to fill the remaining space in a flexbox. It also includes a `row` class to set a new line.

##### Responsive table support

In order to utilize the responsive support in your tables you need to add a title property to each column as follows:

```xml
      <table mat-table [dataSource]="dataSource" matSort dir="rtl">
        <ng-container matColumnDef="courseName">
          <th mat-cell-header *matHeaderCellDef mat-sort-header>קורס</th>
          <td mat-cell *matCellDef="let course" class="row-title">
            {{course.courseNumber}} - {{course.courseName}}
          </td>
        </ng-container>
        <ng-container matColumnDef="lecturer">
          <th mat-cell-header *matHeaderCellDef mat-sort-header>מרצה</th>
          <td mat-cell title="מרצה" *matCellDef="let course">{{course.lecturer}}</td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="columnsDisplayed"></tr>
        <tr mat-row *matRowDef="let course; columns: columnsDisplayed" (click)="selection.toggle(course)"></tr>
      </table>
```

On mobile this will be transformed to something similar as the following:

```
(course number) - (course name)
קורס: (lecturer)
```

Please, note that the `row-title` class transforms the cell into a kind of a header in the mobile version.

##### Include your custom component theme:

Once the core theming was installed, you can use the `$default-theme` and `$dark-theme` variables in order to your components themes:

```scss
@import '~@uoh/ngx-theme/theme';
@import './app/app.component.theme.scss';

@include uoh-core();
@include app-theme($default-theme);

// You have to use the same class name to be compatible with the accessibility module.
.dark-theme {
  @include app-theme($dark-theme);
}
```

###### Error and success colors:

The theme file also includes two presets: the `$error` and the `$success` color variables. These can be used in your application to set the two corresponding classes.

---

### The accessibility module

This module adds an accessibility menu to set the font size and the theme for the application.

#### Usage

Import the `UohAccessibilityModule` in your `app.module.ts`. For example:

```typescript
import { UohAccessibilityModule } from '@uoh/ngx-theme/accessibility';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, UohAccessibilityModule, MatCardModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

Then, wrap ****all**** the contents of your app (including header, footer, etc.) inside the `uoh-accessibility` tag:

```xml
<uoh-accessibility [dir]="dir">
  <div class="wrapper">
    <mat-card class="small-card">
      <mat-card-content>
        <div style="text-align:center">
          <h1>
            Welcome to {{ title }}!
          </h1>
        </div>
        <h2>University of Haifa</h2>
      </mat-card-content>
    </mat-card>
  </div>
</uoh-accessibility>
```

> Note: You can set the direction of all the app contents by setting the dir input variable to `rtl` (default) or `ltr`.

### The header module

This module contains a header with the title for the application, the university logo and logic for log-in functionality.

#### Include the assets with the university logo

Add the following line to the `options` --> `assets` array under both the `build` and the `test` sections in the `angular.json` file:

```json
{ "glob": "**/*", "input": "./node_modules/@uoh/ngx-theme/assets", "output": "/assets/" }
```

#### Import the header module

In order to import the module add the following lines to your `app.module.ts`:

```typescript
import { UohHeaderModule } from '@uoh/ngx-theme';

@NgModule({
  imports: [ UohHeaderModule ]
  ...
})
```

Then add the `uoh-header` component to the top section of your `app.component.html`. For example:

```xml
  <uoh-header subtitle="תת כותרת" [user]="user" (logOut)="onLogOut($event)"></uoh-header>
```

> Note: If you use `uoh-accessibility` remember to include the `uoh-header` inside it.

The header component accepts three input variables:

- `title`: A string to be used as the main header title. The default value is `אוניברסיטת חיפה`.
- `subtitle`: A string to be used as the header subtitle. The default value is `undefined`.
- `user`: A string containing the name of the user. If set, a log out button will be displayed on the header, next to the user name. When the user presses the log out button an event will be fired. This event can be catched by binding a function to the `logOut` output.

For example, in your component ts file:

```typescript
export class AppComponent {
  title = 'app';
  user: string;
  private authorize$: Subscription;

  constructor(private authService: AuthService) {}

  onLogIn(username: string, password: string): void {
    this.authorize$ = this.authService.authorize(username, password).subscribe(user => {
      this.user = `${user.firstName} ${user.lastName}`;
    });
  }

  onLogOut(loggedOut: boolean): void {
    this.user = undefined;
    console.log('log out', loggedOut);
  }
}
```

### The footer module

This module contains a footer with details about the university and the current version of the application (optional).

#### Import the footer module

In order to import the module add the following lines to your `app.module.ts`:

```typescript
import { UohFooterModule } from '@uoh/ngx-theme';

@NgModule({
  imports: [ UohFooterModule ]
  ...
})
```

Then add the `uoh-footer` component to the bottom section of your `app.component.html`. For example:

```xml
<uoh-footer [version]="false"></uoh-footer>
```

> Note: If you use `uoh-accessibility` remember to include the `uoh-footer` inside it.

The footer component accepts a `version` input variable. If it is omitted, the component will try to automatically retrieve the version number from your app's `package.json`. Alternatively, you can pass a string to it in order to set a custom version name or `false` (as in the above example) if you don't want it to be displayed.
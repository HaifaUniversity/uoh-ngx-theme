# University of Haifa Angular Theme

A collection of University of Haifa modules to be integrated in an Angular project using Material Design.

## Installation

```bash
$ npm install @uoh/ngx-theme --save
```

## Contents

This library includes the following modules:

- SCSS file including color themes and design configurations
- A content module to wrap your application with the theme
- An accessibility module containing accessibility features
- A header module with the logo of the University of Haifa and log-in logic
- A footer module with the details of the university and the version of the application (optional)
- A back-to-top module with a button to jump to the top of the page after scrolling
- A spinner module with a loader animation with the logo of the university

### SCSS Theme

This theme contains a default and a dark color theme, a layout design and presets for responsive tables.

#### Install Material design and its icons font

First, install [angular material](https://material.angular.io/guide/getting-started).
Secondly, add the following tag to the `head` section of your `index.html` file (required for the accessibility, header and back-to-top modules):

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

The `uoh-theme` mixin contains the configurations for all the modules. If you want to avoid some of these presets (to minimize the size of the css output) you must pass a configuration map parameter to the mixin with the modules you want to exclude.

For example:

```scss
// Exclude all the modules (include only the core):
$config: (
  layout: false,
  table: false,
  extra: false,
  accessibility: false,
  header: false,
  footer: false,
  spinner: false,
  content: false
);

@include uoh-theme($config...);
```

##### Layout support

The layout feature presets the `max-width` of the `mat-card` to 1200px and aligns it to the center of the page.
This feature also contains the `small-card` and the `medium-card` classes which set different `mat-card` sizes and a `fill-remaining-space` class to fill the remaining space in a flexbox. It also includes a `row` class to set a new line.

##### Responsive table support

In order to utilize the responsive support for your tables you need to add the `uoh-table` class to your table and set a title property for each column as follows:

```xml
      <table mat-table [dataSource]="dataSource" matSort class="uoh-table" dir="rtl">
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

> Please, note that the `row-title` class transforms the cell into the title of the row (kind of a header) in the mobile version.

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

###### Extra colors:

The theme file also includes two presets: the `success`, `success-fill`, `error` and the `error-fill` classes. These can be used in your application to set two extra types of messages.

---

### The content module

This module contains the `uoh-content` component which is used to wrap your app components and apply to them the design rules of this theme. The `uoh-content` is included in the `UohAccessibilityModule`, the `UohHeaderModule` and the `UohFooterModule`. Alternatively, you can import it separately using its own `UohContentModule`.

Note that you should wrap under it only the contents of your application. You should not include in it the components provided by this theme. For example:

```xml
<uoh-accessibility dir="rtl">
  <uoh-spinner></uoh-spinner>
  <uoh-header subtitle="בדיקה" [user]="user" (logOut)="logOut()"></uoh-header>
  <uoh-back-to-top minScroll="100"></uoh-back-to-top>
  <uoh-content [fullMobile]="true">
    <router-outlet></router-outlet>
  </uoh-content>
  <uoh-footer [version]="false"></uoh-footer>
</uoh-accessibility>
```

The `uoh-content` component accepts a `fullMobile` variable. If set to `true`, the contents will maximize to the full extent of the `uoh-content` on mobile. For example, on mobile the following `mat-card` will be extended to fill the area of contents (without borders, shadows and margins):

```xml
<uoh-content [fullMobile]="true">
  <mat-card>
  ...
  </mat-card>
</uoh-content>
```

---

### The accessibility module

This module adds an accessibility menu to set the font size and the theme for the application.

#### Consuming the accessibility module

Import the `UohAccessibilityModule` in your `app.module.ts`. For example:

```typescript
import { UohAccessibilityModule } from '@uoh/ngx-theme';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, UohAccessibilityModule, MatCardModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

Then, wrap **all** the contents of your app (including header, footer, etc.) inside the `uoh-accessibility` tag:

```xml
<uoh-accessibility [dir]="dir">
  <uoh-content>
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
  </uoh-content>
</uoh-accessibility>
```

> Note: The content is wrapped under the `uoh-content` component in order to keep the design of the contents of your application aligned with the `@uoh` components. For more information, please refer to the `The content module` section above.

> Note: You can set the direction of all the app contents by setting the `dir` input variable to `rtl` (default) or `ltr`.

> Note: If you want to set custom labels for the buttons and headers you can set the `labels` input. To learn about the fields that should be set in this input object you can import the `UohAccessibilityLabels` from the same module. For example:

```javascript
labels: UohAccessibilityLabels = {
  header: 'Accessibility',
  increaseFont: 'Increase font size',
  decreaseFont: 'Decrease font size',
  lowContrast: 'High contrast',
  highContrast: 'Low contrast',
  reset: 'Reset'
};
```

---

### The header module

This module contains a header with the title for the application, the university logo and logic for log-in functionality.

#### Include the assets with the university logo

Add the following line to the `options` --> `assets` array under both the `build` and the `test` sections in the `angular.json` file:

```json
{ "glob": "**/*", "input": "./node_modules/@uoh/ngx-theme/assets", "output": "/assets/" }
```

#### Consuming the header module

In order to import the module add the following lines to your `app.module.ts`:

```typescript
import { UohHeaderModule } from '@uoh/ngx-theme';

@NgModule({
  imports: [ UohHeaderModule ],
  ...
})
```

Then add the `uoh-header` component to the top section of your `app.component.html`. For example:

```xml
  <uoh-header header="מינה" subheader="מערכת לניהול השגים" [user]="user" (logOut)="onLogOut($event)">
    <a uohHeaderLink="https://www.haifa.ac.il" uohHeaderLinkIcon="face"> אוני׳ חיפה </a>
    <a uohHeaderLink="https://www.google.com"> גוגל </a>
    <a [uohHeaderRouterLink]="['two']" uohHeaderLinkIcon="thumb_up_alt"> דף 2 </a>
    <a [uohHeaderMenuLink]="menu" uohHeaderLinkIcon="help"> עזרה </a>
  </uoh-header>
  <mat-menu #menu="matMenu"> <button mat-menu-item>מוקד תמיכה</button> <button mat-menu-item>הדרכות וידיאו</button> </mat-menu>
```

> Note: If you use `uoh-accessibility` remember to include the `uoh-header` inside it.

The header component accepts five input variables:

- `header`: A string to be used as the main header title.
- `subheader`: A string to be used as the header subtitle. If left undefined it will not be displayed.
- `user`: An object containing the name, the details and last login of the user. If set, a log out button will be displayed on the header, next to the user name. When the user presses the log out button an event will be fired. This event can be catched by binding a function to the `logOut` output.
- `labels`: An object containing the labels for buttons and headers: the alt attribute for the logo, the label for the logout button and the aria-label for the more links button (mobile view). For more information about the fields integrating it use the `UohHeaderLabels` from the same module.
- `logoLinkUrl`: A string containing the url to open when the logo is clicked. The default url is `https://www.haifa.ac.il/`.

Furthermore, the `uohHeaderLink`, `uohHeaderRouterLink` and `uohHeaderMenuLink` directives can be used to display links in the header (these should be contained inside the `uoh-header` tags):

- The `uohHeaderLink` is used to add external links.
- The `uohHeaderRouterLink` is used to set internal links (`routerLinks`).
- The `uohHeaderMenuLink` is used to display menus (a `mat-menu` instance should be passed).
  The `uohHeaderLinkIcon` option can be used to display a `mat-icon` next to the link label (see above example).

For example, in your component ts file:

```typescript
export class AppComponent {
  header = 'Registration';
  user: UohHeaderUser;
  labels: UohHeaderLabels = {
    logo: 'University of Haifa',
    logOut: 'Logout',
    links: 'Some links'
  };
  private authorize$: Subscription;

  constructor(private authService: AuthService) {}

  onLogIn(username: string, password: string): void {
    this.authorize$ = this.authService.authorize(username, password).subscribe(user => {
      this.user = {
        name: `${user.firstName} ${user.lastName}`,
        details: `${user.email}<br>Birthdate: ${user.birthdate}`,
        lastLogin: `Last login on ${user.lastLogin}`
      };
    });
  }

  onLogOut(loggedOut: boolean): void {
    this.user = undefined;
    console.log('log out', loggedOut);
  }
}
```

---

### The footer module

This module contains a footer with details about the university and the current version of the application (optional).

#### Consuming the footer module

In order to import the module add the following lines to your `app.module.ts`:

```typescript
import { UohFooterModule } from '@uoh/ngx-theme';

@NgModule({
  imports: [ UohFooterModule ],
  ...
})
```

Then add the `uoh-footer` component to the bottom section of your `app.component.html`. For example:

```xml
<uoh-footer [version]="false"></uoh-footer>
```

> Note: If you use `uoh-accessibility` remember to include the `uoh-footer` inside it.

The footer component accepts a `version` input variable. If it is omitted, the component will try to automatically retrieve the version number from your app's `package.json` file. Alternatively, you can pass a string to it in order to set a custom version name or `false` (as in the above example) if you don't want it to be displayed.

---

### The back-to-top module

This module adds a button that returns the focus to the top of the page.

#### Consuming the back-to-top module

In order to import this module add the following lines to your `app.module.ts`:

```typescript
import { UohBackToTopModule } from '@uoh/ngx-theme';

@NgModule({
  imports: [ UohBackToTopModule ],
  ...
})
```

Then add the following line to your `app.component.html` or your components html templates, depending on whether you want the component in all your pages or custom sections of your application:

```xml
<uoh-back-to-top [minScroll]="75"></uoh-back-to-top>
```

The component accepts a `minScroll` input variable to set the minimum amount of pixels scrolled required in order to display the back-to-top button. If left unset, the default value for this variable is `100` pixels.

> Note: If needed you can inject the `UohBackToTop` service and use the same functionality in your components. The service includes a cross-browser `back` method which returns the focus to the top of the page.

If you want to add this functionality only for mobile you will have to add the following configuration to your `styles.scss`:

```scss
.uoh-back-to-top {
  display: none;
}

@media only screen and (max-width: 600px) {
  .uoh-back-to-top {
    display: block;
  }
}
```

---

### The spinner module

This module includes a spinner loader with the logo of the university.

#### Consuming the spinner module

In order to import the spinner module add the following lines to your `app.module.ts`:

```typescript
import { UohSpinnerModule } from '@uoh/ngx-theme';

@NgModule({
  imports: [ UohSpinnerModule ],
  ...
})
```

Then add the `uoh-spinner` component to your `app.component.html`:

```xml
<uoh-spinner [size]="{width: 120}" [duration]="2000" [fps]="60" [minStrokeWidth]="5" [maxStrokeWidth]="30"
  [circle]="{stop1: 0.5, stop2: 0.7}"></uoh-spinner>
```

### Input Options

- `size` - An object containing the width and/or the height of the spinner. Note: only one of them is required, the other will be automatically calculated to constrain proportions
- `duration` - A number representing the duration for the animation in milliseconds
- `fps` - A number representing the frames per second for the animation
- `minStrokeWidth` - A number representing the minimum width of the line
- `maxStrokeWidth` - A number representing the maximum width of the line (the starting point)
- `circle` - An object containing two stops representing the percentage of frames to reach the minimum (step1) and the maximum widths (step2)
- `path` - A string containing svg coordinates for the figure (equivalent to the d attribute in a svg path)

### Spinner Activation

The spinner is activated/deactivated by calling the functions show/hide in the `UohSpinner` service.
The `UohSpinner` exposes a BehaviorSubject of type Boolean named `loading`, which can be used to determine if a loading procedure is taking place.

For example, in your component.ts:

```typescript
import { UohSpinner } from '@uoh/ngx-theme';

@Component({
  selector: 'app',
  template: `
    <h1>{{ title }}</h1>
    <button (click)="loadStuff()" [disabled]="spinner.loading | async">Load Stuff</button>
    <uoh-spinner></uoh-spinner>
  `
})
export class AppComponent {
  data: Stuff[];

  constructor(public spinner: UohSpinner, private apiService: ApiService) {}

  loadStuff(): void {
    this.spinner.show();
    this.apiService.loadStuff.subscribe(data => (this.data = data), _, this.spinner.hide());
  }
}
```

## License

MIT © [Pablo Saracusti](mailto:psaracu1@univ.haifa.ac.il)

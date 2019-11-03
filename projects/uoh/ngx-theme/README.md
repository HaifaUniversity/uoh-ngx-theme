# University of Haifa Angular Theme

A collection of University of Haifa modules to be integrated in an Angular project using Material Design.

---

## Installation

With schematics (the scss theme, the material icons, some html tags, the favicon and the logo are added automatically):

```bash
$ ng add @uoh/ngx-theme
```

> Note: The scss mixins will be imported in the `stylePreprocessorOptions` --> `includePaths` section in the `angular.json` file. Thus, they will be available throughout all the scss in your app.

Or to configure it by yourself:

```bash
$ npm install @uoh/ngx-theme --save
```

---

## Contents

This library includes the following modules:

- SCSS file including color themes and design configurations
- An accessibility module containing accessibility features
- A body module to wrap your application with the theme, in case you do not use the accessibility module
- A header module with the logo of the University of Haifa and log-in logic
- A footer module with the details of the university and the version of the application (optional)
- A card module with cards of different sizes that collapse into the full size of the screen (also applicable to `mat-card`)
- A back-to-top module with a button to jump to the top of the page after scrolling
- A spinner module with a loader animation with the logo of the university
- A content service that exposes the width, height, top, right, bottom, left, x and y of the `uoh-content`.

---

## The SCSS Theme

This theme contains a default and a dark color theme, a layout design and presets for responsive tables. It also contains scss functions and mixins to make the application styling easier.

### Install Material design and its icons font

First, install [angular material](https://material.angular.io/guide/getting-started).
Secondly, add the following tag to the `head` section of your `index.html` file (required for the accessibility, header and back-to-top modules):

```xml
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
```

> Note: If you used `ng add` to install the theme, the above line is not required.

### Include the favicon (if you did not use `ng add`)

Add the following line to the `options` --> `assets` array under both the `build` and the `test` sections in the `angular.json` file:

```json
{ "glob": "favicon.ico", "input": "./node_modules/@uoh/ngx-theme/assets", "output": "/" }
```

### Include the theme (if you did not use `ng add`)

Add the following lines to the `styles.scss` file in your application:

```scss
@import '~@uoh/ngx-theme/theme'; // Or in angular 6 and above add './node_modules/@uoh/ngx-theme/theme' to build->options->stylePreprocessorOptions->includePaths` section in the `angular.json` file

@include uoh-theme();
```

The `uoh-theme` mixin contains the configurations for all the modules. If you want to avoid some of these presets (to minimize the size of the css output) you must pass a configuration map parameter to the mixin with the modules you want to exclude.

For example:

```scss
// Exclude all the modules (include only the core):
$config: (
  layout: false,
  table: false,
  card: false,
  extra: false,
  print: false,
  accessibility: false,
  header: false,
  footer: false,
  spinner: false,
  content-padding: false
);

@include uoh-theme($config...);
```

### The Layout

The layout is based on the window sizes defined in the material specifications: `xsmall`, `small`, `medium`, `large`, `xlarge` (for further information see: [material breakpoints](https://material.io/design/layout/responsive-layout-grid.html#breakpoints)). The layout presets includes the classes `uoh-hide-on-#{window-size}` which hide the contents when the window size is between the minimum and the maximum breakpoints defined in the material specifications. The presets includes also a `fill-remaining-space` class to fill the remaining space in a flexbox.
Furthermore, you can use one of the following mixins or functions to implement a custom behavior.

#### Mixins:

- `uoh-screen`: Sets the content to the screen breakpoints min and max widths.
- `uoh-screen-min`: Sets the content to the screen breakpoint's min-width. For example: 'medium' will set the content to min-width: 960px.
- `uoh-screen-max`: Sets the content to the screen breakpoint's max-width. For example: 'medium' will set the content to max-width: 1279.99px.

Usage:

```scss
// For a certain window size
@include uoh-screen(medium) {
  .my-component {
    display: none;
  }
}

// Will result in:
@media screen and (min-width: 960px) and (max-width: 1279.99px) {
  .my-component {
    display: none;
  }
}

// Or include a range of window sizes
@include uoh-screen(small, large) {
  .my-component {
    display: block;
  }
}

// Will result in:
@media screen and (min-width: 600px) and (max-width: 1919.99px) {
  .my-component {
    display: none;
  }
}

// Or use the min / max mixins
@include uoh-screen-min(small) {
  // or uoh-screen-max(small)
  .my-component {
    display: none;
  }
}

// Will result in:
@media screen and (min-width: 600px) {
  // and (max-width: 600px) for uoh-screen-max
  .my-component {
    display: none;
  }
}
```

#### Functions:

- `uoh-breakpoint-min`: Returns the minimum value for a breakpoint. For example: 'medium' will return 1024px.
- `uoh-breakpoint-max`: Returns the maximum value for a breakpoint. For example: 'medium' will return 1439px.
- `uoh-breakpoint-next`: Returns the name of the next breakpoint. For example: 'medium' will return 'large'.

Usage:

```scss
.my-component {
  min-width: uoh-breakpoint-min(small); // Compiles to min-width: 600px
  max-width: uoh-breakpoint-max(small); // Compiles to max-width: 1023px
}
.my-other-component {
  $next-breakpoint: uoh-breakpoint-next(small); // Returns medium
  max-width: uoh-breakpoint-max($next-breakpoint); // Compiles to max-width: 1439px
}
```

### Responsive table support

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

### Include your custom component theme:

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

### Extra colors:

The theme file also includes two presets: the `uoh-success`, `uoh-success-fill`, `uoh-error` and the `uoh-error-fill` classes. These can be used in your application to set two extra types of messages.

### Print layout:

It includes the following classes: `uoh-no-print` and `uoh-print-only`. The first one eliminates the html tag and its children from print. The second one, sets a tag and its children to be visible only on print.

---

## The accessibility module

This module adds an accessibility menu to set the font size and the theme for the application.

### Consuming the accessibility module

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
<uoh-accessibility [dir]="dir" manifestUrl="https://www.example.com/accessibility-manifest">
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
</uoh-accessibility>
```

> Note: You can set the direction of all the app contents by setting the `dir` input variable to `rtl` (default) or `ltr`.

> Note: You can provide your own link to the accessibility manifest instead of using the default one, linked to the University of Haifa accessibility manifest.

> Note: If you want to set custom labels for the buttons and headers you can set the `labels` input. To learn about the fields that should be set in this input object you can import the `UohAccessibilityLabels` from the same module. For example:

```javascript
labels: UohAccessibilityLabels = {
  header: 'Accessibility',
  increaseFont: 'Increase font size',
  decreaseFont: 'Decrease font size',
  lowContrast: 'High contrast',
  highContrast: 'Low contrast',
  reset: 'Reset',
  manifest: 'Accessibility manifest'
};
```

---

## The body module

This module contains the `uoh-body` component which is used to wrap your app components and apply to them the design rules of this theme. The `uoh-body` is required if you **do not** use the accessibility module. For example:

```xml
<uoh-body dir="rtl">
  <uoh-spinner></uoh-spinner>
  <uoh-header subtitle="בדיקה" [user]="user" (logOut)="logOut()"></uoh-header>
  <uoh-back-to-top minScroll="100"></uoh-back-to-top>
  <router-outlet></router-outlet>
  <uoh-footer [version]="false"></uoh-footer>
</uoh-body>
```

> Note: You can set the `dir` of the `uoh-body` as in the accessibility module.

---

## The header module

This module contains a header with the title for the application, the university logo and logic for log-in functionality.

### Include the assets with the university logo

Add the following line to the `options` --> `assets` array under both the `build` and the `test` sections in the `angular.json` file:

```json
{ "glob": "**/*", "input": "./node_modules/@uoh/ngx-theme/assets", "output": "/assets/" }
```

### Consuming the header module

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
- `clickableTitle`: Whether clicking on the header and subheader the user should be redirected to the starting page in the app. The default is `true`.

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

## The footer module

This module contains a footer with details about the university and the current version of the application (optional).

### Consuming the footer module

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

The footer component accepts a `version` input variable. If it is omitted, the component will try to automatically retrieve the version number from your app's `package.json` file. Alternatively, you can pass a string to it in order to set a custom version name or `false` (as in the above example) if you don't want it to be displayed.

---

### The card module

The theme includes a set of cards with different sizes according to the layout breakpoints: `uoh-card-xsmall` with `max-width: 599.99px`, `uoh-card-small` with `max-width: 959.99px` and so on.
The card module includes both a `uohCard` directive (applicable also to `mat-card` components) and a `uoh-card` component.

Usage:

```xml
<uoh-card size="xsmall" collapse="true">
  <h3>Test!</h3>
  <p>Hello this is a test for uoh-card</p>
</uoh-card>
```

Or use the directive to apply it to other html tag:

```xml
<mat-card uohCard="medium" uohCardCollapse="false">
  <mat-card-content>
    <p>Hello this is a test for uoh-card</p>
  </mat-card-content>
</mat-card>
```

The `uoh-card` accepts a `size` (the default is `medium`) and a `collapse` input (which defaults to `true`). If the collapse is set to `true` and there is no `content-padding` (see the `Include the theme` section above), the borders of the uoh-cards will collapse when the breakpoint is reached. For example: if the `size` is set to `xsmall` is used, the box-shadow will disappear when the screen less or equal to 599.99px.

> Please, note also that there is no max-width set for the `xlarge` size.

---

## The back-to-top module

This module adds a button that returns the focus to the top of the page.

### Consuming the back-to-top module

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

@media screen and (max-width: 600px) {
  .uoh-back-to-top {
    display: block;
  }
}
```

---

## The spinner module

This module includes a spinner loader with the logo of the university.

### Consuming the spinner module

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

The spinner is activated and deactivated by calling the `UohSpinner` methods `add` and `remove`, respectively.
Note that the `remove` method will cancel only the last `add` method called. Thus, if you called the `add` method consecutively more than once and call the `remove` method once, the spinner will still be on screen. If you want to remove all the spinners from screen at once use the `clear` method. For further information refer to issue number [#7](https://github.com/HaifaUniversity/uoh-ngx-theme/issues/7).
Furthermore, you can use the observable pipeable versions of the above methods:

- `addOnEvent` - Adds a spinner when the observable fires
- `removeOnFinalize` - Removes a spinner when the observable finalizes
- `clearOnFinalize` - Removes all the spinners when the observable finalizes

The `UohSpinner` exposes an Observable of type Boolean named `loading`, which can be used to determine if a loading procedure is taking place.

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
    this.spinner.add();
    this.apiService
      .loadStuff()
      .pipe(this.spinner.clearOnFinalize())
      .subscribe(data => (this.data = data));
  }

  loadMoreStudd(): void {
    this.test$ = of(1000, 2000, 2340).pipe(
      concatMap(val =>
        of(`Delayed by ${val}`).pipe(
          this.spinner.addOnEvent(),
          delay(val)
          this.spinner.removeOnFinalize()
        )
      )
    );
  }
}
```

---

## The UohContent service

This service can be used to get the properties of the `uoh-content` (that is, the tag that wraps all your app contents).
You can get the following properties: width, height, top, right, bottom, left, x and y (the last two if they are supported by the browser).

## License

MIT © [Pablo Saracusti](mailto:psaracu1@univ.haifa.ac.il)

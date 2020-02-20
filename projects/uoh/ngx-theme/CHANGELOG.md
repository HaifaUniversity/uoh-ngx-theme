# Changelog

## 5.0.0

### Fixes:

- Schematics `ng add` installs the material and cdk versions correctly.

### Features:

- Add `ng update` schematics.

### BREAKING CHANGES:

- The `Varela` font was changed with the `Rubik` font to add `bold` and `italics`.
- The font is no longer included in the `_theme.scss` file via the `@import` mixin. To import the font add a `link` html in your `index.html`: `<link href="https://fonts.googleapis.com/css?family=Rubik:400,700&display=swap" rel="stylesheet">` or use the `ng add @uoh/ngx-theme` schematics.

## 4.1.0

### Features:

- Add `ng add` schematics (for further information see the [README](./README.md) file).

### Added:

- The `uoh-card` component: similar to a `mat-card` but does not have a division for the header, content & actions.
- Animations to the `uoh-back-to-top` component.
- A `UohContent` service containing the properties of the content: width, height, top, right...

### Changes:

- Use the `uohCard` directive to collapse the card when the maximum width is reached - fixes the problem that the cards did not extend to the full height of the screen when collapsed.
- Improvements to the dark theme colors (mostly influencing the `mat-progress-bar`).

### Fixes:

- Print version: background & font colors.
- Accessibility button `ltr` version: set on the right side of the screen.

## 4.0.0

### BREAKING CHANGES:

- New breakpoints for screen sizes according to the material specifications: `xsmall`, `small`, `medium`, `large` and `xlarge`. New SCSS functions and mixins added.
- The `uoh-content` was **removed** (not longer needed).
- The `.row` class was **removed**.
- If the `uoh-accessibility` is not used, wrap everything inside the `uoh-body` component.
- The `show` and `hide` spinner methods were **removed**. New spinner methods: `add`, `remove` and `clear` and observable pipeable versions: `addOnEvent` - Adds a spinner when the observable fires, `removeOnFinalize`- Removes a spinner when the observable finalizes, `clearOnFinalize` - Removes all the spinners when the observable finalizes (fix for issue #7)
- The `small-card` and `medium-card` classes were **removed**, use `uoh-xsmall-card`, `uoh-small-card`, `uoh-medium-card`, `uoh-large-card` or `uoh-xlarge-card` (for further information see: [material breakpoints](https://material.io/design/layout/responsive-layout-grid.html#breakpoints)).
- The `fullMobile` parameter was **removed**. The borders of the `uoh-cards` collapse automatically.

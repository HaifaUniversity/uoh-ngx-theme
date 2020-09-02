import { Component, Input, OnInit, HostBinding } from '@angular/core';

// import * as app from 'package.json';

@Component({
  selector: 'uoh-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  @HostBinding('class') class = 'uoh-footer';
  @Input() version: string;

  constructor() {}

  ngOnInit(): void {
    if (this.version === undefined) {
      this.version = this.getVersion();
    }
  }

  /**
   * Retrieves the version automatically from the package.json file of the project.
   */
  private getVersion(): string {
    // Try to automatically retrieve the version number
    try {
      // FIXME: Use Ecmascript import to import the package.json. Add schematics to import the version in the app itself.
      // return app.version;
    } catch (e) {
      console.warn('Cannot automatically retrieve the app version', e);
    }

    return undefined;
  }
}

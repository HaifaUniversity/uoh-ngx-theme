import { Component, Input, OnInit, HostBinding } from '@angular/core';

declare const require: any;

@Component({
  selector: 'uoh-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
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

  private getVersion(): string {
    // Try to automatically retrieve the version number
    try {
      const app = require('../../../../package.json');
      if (app && app.version) {
        return app.version;
      }
    } catch (e) {
      console.warn('Cannot automatically retrieve the app version', e);
    }

    return undefined;
  }
}

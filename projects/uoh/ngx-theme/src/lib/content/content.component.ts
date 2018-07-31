import { Component } from '@angular/core';

@Component({
  selector: 'uoh-content',
  template: `
    <ng-content></ng-content>
  `,
  host: { class: 'uoh-content' }
})
export class UohContentComponent {}

import { Component, Input, HostBinding } from '@angular/core';

/**
 * A container component for the app content.
 */
@Component({
  selector: 'uoh-content',
  template: `
    <ng-content></ng-content>
  `,
  styleUrls: ['./content.component.scss']
})
export class UohContentComponent {
  @HostBinding('class') class = 'uoh-content';
  @HostBinding('class.uoh-full-mobile')
  @Input()
  fullMobile = false;
}

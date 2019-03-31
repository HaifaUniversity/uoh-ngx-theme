import { Component, Input, HostBinding } from '@angular/core';

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

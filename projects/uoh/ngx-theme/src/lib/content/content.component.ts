import { Component, Input, HostBinding } from '@angular/core';

@Component({
  selector: 'uoh-content',
  template: `
    <ng-content></ng-content>
  `,
  styleUrls: ['./content.component.scss'],
  host: { class: 'uoh-content' }
})
export class UohContentComponent {
  @HostBinding('class.uoh-full-mobile')
  @Input()
  fullMobile = false;
}

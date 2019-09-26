import { Component, HostBinding, Input } from '@angular/core';
import { Direction } from '@angular/cdk/bidi';

@Component({
  selector: 'uoh-body',
  template: `
    <ng-content></ng-content>
  `,
  styleUrls: ['./body.component.scss']
})
export class UohBodyComponent {
  @HostBinding('class') class = 'uoh-body';
  @HostBinding('dir')
  @Input()
  dir: Direction = 'rtl';
}

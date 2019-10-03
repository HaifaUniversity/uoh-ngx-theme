import { Component, HostBinding, Input } from '@angular/core';
import { Direction } from '@angular/cdk/bidi';

@Component({
  selector: 'uoh-body',
  template: `
    <ng-content select="uoh-spinner"></ng-content>
    <ng-content select="uoh-header"></ng-content>
    <ng-content select="uoh-back-to-top"></ng-content>
    <div class="uoh-content">
      <ng-content></ng-content>
    </div>
    <ng-content select="uoh-footer"></ng-content>
  `,
  styleUrls: ['./body.component.scss']
})
export class UohBodyComponent {
  @HostBinding('class') class = 'uoh-body';
  @HostBinding('attr.role') role = 'region';
  @HostBinding('dir')
  @Input()
  dir: Direction = 'rtl';
}

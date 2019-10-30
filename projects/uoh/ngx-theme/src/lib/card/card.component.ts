import { Component, Input } from '@angular/core';

import { UohCardSize } from './card.model';

@Component({
  selector: 'uoh-card',
  template: `
    <div [uohCard]="size" [uohCardCollapse]="collapse">
      <ng-content></ng-content>
    </div>
  `
})
export class UohCardComponent {
  @Input() size: UohCardSize = UohCardSize.Medium;
  @Input() collapse = true;
}

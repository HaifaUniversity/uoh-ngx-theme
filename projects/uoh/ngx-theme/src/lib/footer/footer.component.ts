import { Component, Input } from '@angular/core';

@Component({
  selector: 'uoh-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  host: { class: 'uoh-footer' }
})
export class FooterComponent {
  @Input() version = '0.0.0';

  constructor() {}
}

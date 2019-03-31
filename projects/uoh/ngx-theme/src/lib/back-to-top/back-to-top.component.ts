import { Component, HostListener, Input, HostBinding } from '@angular/core';

import { UohBackToTop } from './back-to-top.service';

@Component({
  selector: 'uoh-back-to-top',
  templateUrl: './back-to-top.component.html',
  styleUrls: ['./back-to-top.component.scss']
})
export class BackToTopComponent {
  display = false;
  @Input() minScroll = 100;
  @HostBinding('class') class = 'uoh-back-to-top';

  constructor(private backToTopService: UohBackToTop) {}

  backToTop(): void {
    this.backToTopService.back();
    this.display = false;
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event: any): void {
    this.display = this.backToTopService.scrollExceeds(this.minScroll);
  }
}

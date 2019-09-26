import { Component, HostListener, Input, HostBinding } from '@angular/core';

import { UohBackToTop } from './back-to-top.service';

@Component({
  selector: 'uoh-back-to-top',
  templateUrl: './back-to-top.component.html',
  styleUrls: ['./back-to-top.component.scss']
})
export class BackToTopComponent {
  display = false;
  /**
   * The threshold for the back to top to appear.
   */
  @Input() minScroll = 100;
  @HostBinding('class') class = 'uoh-back-to-top';

  constructor(private backToTopService: UohBackToTop) {}

  /**
   * Sends the scrolling bar back to the top of the screen.
   */
  backToTop(): void {
    this.backToTopService.back();
    this.display = false;
  }

  /**
   * Displays the back to top button if the threshold was reached.
   * @param event A scroll event
   */
  @HostListener('window:scroll', ['$event'])
  onScroll(event: any): void {
    this.display = this.backToTopService.scrollExceeds(this.minScroll);
  }
}

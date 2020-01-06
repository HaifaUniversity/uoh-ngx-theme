import { Component, HostListener, Input, HostBinding } from '@angular/core';

import { UohBackToTop } from './back-to-top.service';
import { trigger, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'uoh-back-to-top',
  templateUrl: './back-to-top.component.html',
  styleUrls: ['./back-to-top.component.scss'],
  animations: [
    trigger('fade', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0)' }),
        animate('300ms ease-in', style({ opacity: 1, transform: 'scale(1)' }))
      ]),
      transition(':leave', [
        style({ opacity: 1, transform: 'scale(1)' }),
        animate('300ms ease-out', style({ opacity: 0, transform: 'scale(0)' }))
      ])
    ])
  ]
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

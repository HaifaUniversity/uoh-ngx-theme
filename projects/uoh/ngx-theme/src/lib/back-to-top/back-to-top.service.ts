import { Injectable } from '@angular/core';

/**
 * A service to check the scrolling in order to go back to the top of the screen.
 */
@Injectable()
export class UohBackToTop {
  constructor() {}

  /**
   * Sends the scrolling bar back to the top of the screen.
   */
  back(): void {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  }

  /**
   * Checks if the scrolling bar reached a certain vertical threshold.
   * @param minScroll The threshold.
   */
  scrollExceeds(minScroll: number): boolean {
    const element = document.documentElement.clientHeight ? document.documentElement : document.body;
    const scrollTop = window.pageYOffset ? window.pageYOffset : element.scrollTop;

    return scrollTop > minScroll;
  }
}

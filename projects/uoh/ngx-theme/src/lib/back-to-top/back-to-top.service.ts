import { Injectable, Inject } from '@angular/core';

@Injectable()
export class UohBackToTop {
  constructor() {}

  back(): void {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  }

  scrollExceeds(minScroll: number): boolean {
    const element = document.documentElement.clientHeight ? document.documentElement : document.body;
    const scrollTop = window.pageYOffset ? window.pageYOffset : element.scrollTop;

    return scrollTop > minScroll;
  }
}

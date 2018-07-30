import { Injectable } from '@angular/core';

@Injectable()
export class UohBackToTop {
  constructor() {}

  back(): void {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  }
}

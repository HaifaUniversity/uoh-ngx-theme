import { Component, HostListener, Input } from '@angular/core';

import { UohBackToTop } from './back-to-top.service';

@Component({
  selector: 'uoh-back-to-top',
  templateUrl: './back-to-top.component.html',
  styleUrls: ['./back-to-top.component.scss'],
  host: { class: 'uoh-back-to-top' }
})
export class BackToTopComponent {
  display = false;
  @Input() minScroll = 100;

  constructor(private backToTopService: UohBackToTop) {}

  backToTop(): void {
    this.backToTopService.back();
    this.display = false;
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event: any): void {
    const element = document.documentElement.clientHeight ? document.documentElement : document.body;
    const scrollTop = window.pageYOffset ? window.pageYOffset : element.scrollTop;

    this.display = scrollTop > this.minScroll;
  }
}

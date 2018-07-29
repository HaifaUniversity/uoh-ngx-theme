import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-back-to-top',
  templateUrl: './back-to-top.component.html',
  styleUrls: ['./back-to-top.component.scss']
})
export class BackToTopComponent {
  display = false;
  private BACK_TO_TOP_SCROLL = 100;

  constructor() { }

  backToTop(): void {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    this.display = false;
  }

  @HostListener('window:scroll', ['$event'])
  private onScroll(event: any): void {
    const element = (document.documentElement.clientHeight) ? document.documentElement : document.body;
    const scrollTop = (window.pageYOffset) ? window.pageYOffset : element.scrollTop;

    this.display = (scrollTop > this.BACK_TO_TOP_SCROLL);
  }
}

import { Directive, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { UohBackToTop } from './back-to-top.service';

@Directive({
  selector: 'uohBackToTop'
})
export class UohBackToTopDirective implements OnInit, OnDestroy {
  private routerEvents$: Subscription;

  constructor(private router: Router, private backToTopService: UohBackToTop) {}

  ngOnInit(): void {
    this.routerEvents$ = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => this.backToTopService.back());
  }

  ngOnDestroy(): void {
    if (this.routerEvents$) {
      this.routerEvents$.unsubscribe();
    }
  }
}

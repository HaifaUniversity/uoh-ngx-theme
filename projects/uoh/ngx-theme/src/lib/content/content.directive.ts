import { Directive, ElementRef, OnInit, HostBinding, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';

import { UohPrivateContentService } from './private-content.service';

@Directive({
  selector: '[uohContent]'
})
export class UohContentDirective implements OnInit, OnDestroy {
  @HostBinding('class') class = 'uoh-content';
  @HostBinding('attr.role') role = 'region';
  private subscription = new Subscription();

  constructor(private element: ElementRef, private uohContent: UohPrivateContentService) {}

  ngOnInit(): void {
    this.uohContent.set(this.element);
    this.subscription.add(
      this.uohContent.collapse$.subscribe(collapsed =>
        collapsed ? (this.class = 'uoh-content uoh-collapsed-content') : (this.class = 'uoh-content')
      )
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

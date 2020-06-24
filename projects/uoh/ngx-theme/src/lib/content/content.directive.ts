import { Directive, ElementRef, OnInit, HostBinding, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';

import { UohPrivateContentService } from './private-content.service';

@Directive({
  selector: '[uohContent]',
})
export class UohContentDirective implements OnInit, OnDestroy {
  @HostBinding('class') class = 'uoh-content';
  @HostBinding('attr.role') role = 'region';
  private subscription = new Subscription();

  constructor(private element: ElementRef, private uohContent: UohPrivateContentService) {}

  ngOnInit(): void {
    this.uohContent.set(this.element);
    this.subscription.add(
      this.uohContent.collapse$.subscribe((collapsed) =>
        /**
         * TODO: Improve the logic to prevent the ExpressionChangedAfterItHasBeenCheckedError:
         * The uoh-collapsed-content changes the background of the uohContent depending on the chosen breakpoint for the uohCard directive.
         */
        setTimeout(
          () => (collapsed ? (this.class = 'uoh-content uoh-collapsed-content') : (this.class = 'uoh-content')),
          0
        )
      )
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

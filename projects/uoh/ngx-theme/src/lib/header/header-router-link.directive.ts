import { Directive, Input, ElementRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UohHeaderLinkInterface } from './header.models';

/**
 * A directive to include angular router links inside the header.
 */
@Directive({
  selector: '[uohHeaderRouterLink]'
})
export class UohHeaderRouterLink implements UohHeaderLinkInterface {
  @Input() uohHeaderRouterLink: RouterLink;
  @Input() uohHeaderLinkIcon: string;

  constructor(public elementRef: ElementRef) {}
}

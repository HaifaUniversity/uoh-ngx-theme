import { Directive, Input, ElementRef } from '@angular/core';
import { UohHeaderLinkInterface } from './header.models';

/**
 * A directive to include regular links inside the header.
 */
@Directive({
  selector: '[uohHeaderLink]'
})
export class UohHeaderLink implements UohHeaderLinkInterface {
  @Input() uohHeaderLink: string;
  @Input() uohHeaderLinkIcon: string;

  constructor(public elementRef: ElementRef) {}
}

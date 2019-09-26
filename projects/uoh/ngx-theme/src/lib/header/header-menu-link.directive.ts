import { Directive, Input, ElementRef } from '@angular/core';
import { MatMenu } from '@angular/material/menu';
import { UohHeaderLinkInterface } from './header.models';

/**
 * A directive to include mat-menu links inside the header.
 */
@Directive({
  selector: '[uohHeaderMenuLink]'
})
export class UohHeaderMenuLink implements UohHeaderLinkInterface {
  @Input() uohHeaderMenuLink: MatMenu;
  @Input() uohHeaderLinkIcon: string;

  constructor(public elementRef: ElementRef) {}
}

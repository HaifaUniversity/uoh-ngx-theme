import { Directive, Input, ElementRef } from '@angular/core';
import { UohHeaderLinkInterface } from './header.models';

@Directive({
  selector: '[uohHeaderLink]'
})
export class UohHeaderLink implements UohHeaderLinkInterface {
  @Input() uohHeaderLink: string;
  @Input() uohHeaderLinkIcon: string;

  constructor(public elementRef: ElementRef) {}
}

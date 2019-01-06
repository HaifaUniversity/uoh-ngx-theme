import { Directive, Input, ElementRef } from '@angular/core';
import { MatMenu } from '@angular/material';
import { UohHeaderLinkInterface } from './header.models';

@Directive({
  selector: '[uohHeaderMenuLink]'
})
export class UohHeaderMenuLink implements UohHeaderLinkInterface {
  @Input() uohHeaderMenuLink: MatMenu;
  @Input() uohHeaderLinkIcon: string;

  constructor(public elementRef: ElementRef) {}
}

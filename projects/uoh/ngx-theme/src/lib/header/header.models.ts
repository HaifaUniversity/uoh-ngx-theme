import { ElementRef } from '@angular/core';

export interface UohHeaderLabels {
  logo: string;
  logOut: string;
}

export interface UohHeaderUser {
  name: string;
  details?: string;
  lastLogin?: string;
}

export interface UohHeaderLinkInterface {
  uohHeaderLinkIcon: string;
  elementRef: ElementRef;
}

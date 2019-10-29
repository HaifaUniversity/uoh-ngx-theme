import { Injectable, ElementRef } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UohPrivateContentService {
  element: ElementRef;

  constructor() {}

  set(element: ElementRef): void {
    this.element = element;
  }
}

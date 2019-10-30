import { Injectable, ElementRef } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UohPrivateContentService {
  element: ElementRef;
  private _collapse$ = new BehaviorSubject<boolean>(false);
  collapse$: Observable<boolean> = this._collapse$.asObservable().pipe(distinctUntilChanged());

  constructor() {}

  set(element: ElementRef): void {
    this.element = element;
  }

  collapse(collapsed: boolean): void {
    this._collapse$.next(collapsed);
  }
}

import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UohSpinner {
  private loading$ = new BehaviorSubject<boolean>(false);
  loading = this.loading$.asObservable().pipe(distinctUntilChanged());

  constructor() {}

  show(): void {
    this.loading$.next(true);
  }

  hide(): void {
    this.loading$.next(false);
  }
}

import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, tap, finalize } from 'rxjs/operators';

/**
 * A service to manipulate the spinner.
 */
@Injectable({
  providedIn: 'root'
})
export class UohSpinner {
  private loading$ = new BehaviorSubject<boolean>(false);
  private counter = 0;
  loading = this.loading$.asObservable().pipe(distinctUntilChanged());

  constructor() {}

  /**
   * Adds one spinner to the screen.
   */
  add(): void {
    this.counter++;
    this.loading$.next(true);
  }

  /**
   * Add alias
   * 
   * @return {void}
   */
  show(): void {
    this.add();
  }

  /**
   * Removes one spinner from screen.
   */
  remove(): void {
    this.counter--;
    if (this.counter < 1) {
      this.loading$.next(false);
    }
  }

  /**
   * Remove alias.
   * 
   * @return {void}
   */
  hide(): void {
    this.remove();
  }

  /**
   * Clears all the spinners from screen.
   */
  clear(): void {
    this.counter = 0;
    this.loading$.next(false);
  }

  /**
   * Adds one spinner when the observable fires.
   */
  addOnEvent = () => (source: Observable<any>) => source.pipe(tap(_ => this.add()));

  /**
   * Removes one spinner when the observable finalizes.
   */
  removeOnFinalize = () => (source: Observable<any>) => source.pipe(finalize(() => this.remove()));

  /**
   * Clears all spinners when the observable finalizes.
   */
  clearOnFinalize = () => (source: Observable<any>) => source.pipe(finalize(() => this.clear()));
}

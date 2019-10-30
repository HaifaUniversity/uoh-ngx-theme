import { Directive, HostBinding, OnInit, Input, OnDestroy } from '@angular/core';
import { Breakpoints, BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

import { Subscription, BehaviorSubject } from 'rxjs';
import { distinctUntilChanged, switchMap, tap, map } from 'rxjs/operators';

import { UohPrivateContentService } from '../content/private-content.service';
import { UohCardSize } from './card.model';

interface UohCardState {
  size: UohCardSize;
  collapse: boolean;
}

@Directive({
  selector: '[uohCard]'
})
export class UohCardDirective implements OnInit, OnDestroy {
  @HostBinding('class.uoh-xsmall-card') xsmallClass: boolean;
  @HostBinding('class.uoh-small-card') smallClass: boolean;
  @HostBinding('class.uoh-medium-card') mediumClass: boolean;
  @HostBinding('class.uoh-large-card') largeClass: boolean;
  @HostBinding('class.uoh-xlarge-card') xlargeClass: boolean;
  @HostBinding('class.uoh-collapsible-card') collapsibleClass: boolean;
  @HostBinding('attr.role') role = 'region';
  @HostBinding('style.min-height.px') minHeight: number;
  get uohCard(): UohCardSize {
    return this.state$.getValue().size;
  }
  @Input('uohCard')
  set uohCard(size: UohCardSize) {
    this.state$.next(Object.assign({}, this.state$.getValue(), { size }));
  }
  get uohCardCollapse(): boolean {
    return this.state$.getValue().collapse;
  }
  @Input('uohCardCollapse')
  set uohCardCollapse(value: boolean) {
    const collapse = coerceBooleanProperty(value);
    this.state$.next(Object.assign({}, this.state$.getValue(), { collapse }));
  }
  private state$ = new BehaviorSubject<UohCardState>({ size: UohCardSize.Medium, collapse: true });
  private subscription = new Subscription();

  constructor(private privateUohContent: UohPrivateContentService, private breakpointObserver: BreakpointObserver) {}

  ngOnInit(): void {
    this.subscription.add(
      this.state$
        .pipe(
          distinctUntilChanged((prev, curr) => prev.size === curr.size && prev.collapse === curr.collapse),
          tap(state => this.setProperties(state)),
          map(state => this.getBreakpoints(state.size)),
          switchMap(breakpoints => this.breakpointObserver.observe(breakpoints))
        )
        .subscribe(breakpointState => this.collapse(breakpointState))
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.privateUohContent.collapse(false);
  }

  private setProperties(state: UohCardState): void {
    this.collapsibleClass = state.collapse;
    this.xsmallClass = state.size === UohCardSize.XSmall;
    this.smallClass = state.size === UohCardSize.Small;
    this.mediumClass = state.size === UohCardSize.Medium;
    this.largeClass = state.size === UohCardSize.Large;
    this.xlargeClass = state.size === UohCardSize.XLarge;
  }

  private collapse(breakpointState: BreakpointState): void {
    this.privateUohContent.collapse(this.uohCardCollapse && breakpointState.matches);
  }

  private getBreakpoints(cardSize: UohCardSize): Array<string> {
    switch (cardSize) {
      case UohCardSize.XSmall:
        return [Breakpoints.XSmall];
      case UohCardSize.Small:
        return [Breakpoints.XSmall, Breakpoints.Small];
      case UohCardSize.Medium:
        return [Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium];
      case UohCardSize.Large:
        return [Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium, Breakpoints.Large];
      default:
        return [Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium, Breakpoints.Large, Breakpoints.XLarge];
    }
  }
}

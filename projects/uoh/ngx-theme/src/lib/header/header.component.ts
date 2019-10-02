import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener,
  OnInit,
  ContentChildren,
  QueryList,
  HostBinding
} from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { UohHeaderUser, UohHeaderLabels, UohHeaderLinkInterface, UohHeaderLinksView } from './header.models';
import { UohHeaderLink } from './header-link.directive';
import { UohHeaderRouterLink } from './header-router-link.directive';
import { UohHeaderMenuLink } from './header-menu-link.directive';

@Component({
  selector: 'uoh-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @HostBinding('class') class = 'uoh-header';
  /**
   * The lists of links inside the header component, according to their type: regular links, angular router links & mat-menu links.
   */
  @ContentChildren(UohHeaderLink, { descendants: true })
  links: QueryList<UohHeaderLink>;
  @ContentChildren(UohHeaderRouterLink, { descendants: true })
  routerLinks: QueryList<UohHeaderRouterLink>;
  @ContentChildren(UohHeaderMenuLink, { descendants: true })
  menuLinks: QueryList<UohHeaderMenuLink>;
  /**
   * The title and subtitle for the header.
   */
  @Input()
  header: string;
  @Input() subheader: string;
  /**
   * The user to show as logged in.
   */
  @Input() user: UohHeaderUser;
  @Input() logoLinkUrl = 'https://www.haifa.ac.il/';
  @Input() labels: UohHeaderLabels = { logo: 'אוניברסיטת חיפה', logOut: 'יציאה מהמערכת', links: 'קישורים' };
  @Input() clickableTitle = false;
  @Output() logOut = new EventEmitter<boolean>();
  isXSmall$: Observable<boolean>;
  linksView = UohHeaderLinksView;
  private MAX_ICONS_LINKS = 4;

  constructor(private breakpointObserver: BreakpointObserver) {}

  ngOnInit(): void {
    this.isXSmall$ = this.breakpointObserver.observe([Breakpoints.XSmall]).pipe(map(result => result.matches));
  }

  /**
   * Emits a logOut event when the log out button is pressed.
   */
  onLogOut(): void {
    this.logOut.emit(true);
  }

  /**
   * Opens the haifa website when the logo is pressed.
   */
  openHaifaWebsite(): void {
    window.open(this.logoLinkUrl, '_blank');
  }

  /**
   * Checks if any link has been set for the header.
   */
  hasLinks(): boolean {
    return (
      (this.links && this.links.length > 0) ||
      (this.routerLinks && this.routerLinks.length > 0) ||
      (this.menuLinks && this.menuLinks.length > 0)
    );
  }

  /**
   * Retrieves the type of view used to render the links, according to the screen size, the number of links and icons.
   * @param isXSmall Whether is extra small screen.
   */
  getLinksView(isXSmall: boolean): UohHeaderLinksView {
    // TODO: Improve performance by setting a variable on resize
    const linksLength =
      this.countLinks(this.links) + this.countLinks(this.routerLinks) + this.countLinks(this.menuLinks);

    if (!isXSmall || linksLength === 1) {
      return UohHeaderLinksView.Full;
    } else if (
      linksLength <= this.MAX_ICONS_LINKS &&
      this.allLinksHaveIcons(this.links) &&
      this.allLinksHaveIcons(this.routerLinks) &&
      this.allLinksHaveIcons(this.menuLinks)
    ) {
      return UohHeaderLinksView.Icons;
    } else {
      return UohHeaderLinksView.Menu;
    }
  }

  /**
   * Retrieves the text value of the link.
   * @param link The link to get the text value from.
   */
  getLinkValue(link: UohHeaderLinkInterface): string {
    return link && link.elementRef && link.elementRef.nativeElement ? link.elementRef.nativeElement.innerText : '';
  }

  /**
   * Tracks the changes in the array of links.
   * @param index The index of the link.
   * @param item The link.
   */
  trackByFn(index: number, item: UohHeaderLinkInterface): UohHeaderLinkInterface {
    return item;
  }

  /**
   * Counts the number of links of a certain type.
   * @param links A QueryList containing all the links of a certain type.
   */
  private countLinks(links: QueryList<UohHeaderLinkInterface>): number {
    return links ? links.length : 0;
  }

  /**
   * Checks that all the links of a certaing type contain icons.
   * @param links A QueryList containing all the links of a certain type.
   */
  private allLinksHaveIcons(links: QueryList<UohHeaderLinkInterface>): boolean {
    return links ? links.reduce((prev: boolean, curr) => prev && !!curr.uohHeaderLinkIcon, true) : true;
  }
}

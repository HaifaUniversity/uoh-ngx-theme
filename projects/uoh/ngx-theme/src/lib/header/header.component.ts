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
import { UohHeaderUser, UohHeaderLabels, UohHeaderLinkInterface, UohHeaderLinksView } from './header.models';
import { UohHeaderLink } from './header-link.directive';
import { UohHeaderRouterLink } from './header-router-link.directive';
import { UohHeaderMenuLink } from './header-menu-link.directive';

@Component({
  selector: 'uoh-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @HostBinding('class') class = 'uoh-header';
  @ContentChildren(UohHeaderLink, { descendants: true })
  links: QueryList<UohHeaderLink>;
  @ContentChildren(UohHeaderRouterLink, { descendants: true })
  routerLinks: QueryList<UohHeaderRouterLink>;
  @ContentChildren(UohHeaderMenuLink, { descendants: true })
  menuLinks: QueryList<UohHeaderMenuLink>;
  @Input()
  header: string;
  @Input() subheader: string;
  @Input() user: UohHeaderUser;
  @Input() logoLinkUrl = 'https://www.haifa.ac.il/';
  @Input() labels: UohHeaderLabels = { logo: 'אוניברסיטת חיפה', logOut: 'יציאה מהמערכת', links: 'קישורים' };
  @Input() clickableTitle = false;
  @Output() logOut = new EventEmitter<boolean>();
  isDesktop: boolean;
  linksView = UohHeaderLinksView;
  private MAX_ICONS_LINKS = 4;

  constructor() {}

  ngOnInit(): void {
    this.onResize();
  }

  onLogOut(): void {
    this.logOut.emit(true);
  }

  openHaifaWebsite(): void {
    window.open(this.logoLinkUrl, '_blank');
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?: Event): void {
    this.isDesktop = window.innerWidth >= 600;
  }

  hasLinks(): boolean {
    return (
      (this.links && this.links.length > 0) ||
      (this.routerLinks && this.routerLinks.length > 0) ||
      (this.menuLinks && this.menuLinks.length > 0)
    );
  }

  // TODO: Improve performance by setting a variable on resize
  getLinksView(): UohHeaderLinksView {
    const linksLength =
      this.countLinks(this.links) + this.countLinks(this.routerLinks) + this.countLinks(this.menuLinks);

    if (this.isDesktop || linksLength === 1) {
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

  getLinkValue(link: UohHeaderLinkInterface): string {
    return link && link.elementRef && link.elementRef.nativeElement ? link.elementRef.nativeElement.innerText : '';
  }

  trackByFn(index: number, item: UohHeaderLinkInterface): UohHeaderLinkInterface {
    return item;
  }

  private countLinks(links: QueryList<UohHeaderLinkInterface>): number {
    return links ? links.length : 0;
  }

  private allLinksHaveIcons(links: QueryList<UohHeaderLinkInterface>): boolean {
    return links ? links.reduce((prev: boolean, curr) => prev && !!curr.uohHeaderLinkIcon, true) : true;
  }
}

import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener,
  OnInit,
  ContentChildren,
  QueryList
} from '@angular/core';
import { UohHeaderUser, UohHeaderLabels, UohHeaderLinkInterface } from './header.models';
import { UohHeaderLink } from './header-link.directive';
import { UohHeaderRouterLink } from './header-router-link.directive';
import { UohHeaderMenuLink } from './header-menu-link.directive';

@Component({
  selector: 'uoh-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  host: { class: 'uoh-header' }
})
export class HeaderComponent implements OnInit {
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
  @Input() labels: UohHeaderLabels = { logo: 'אוניברסיטת חיפה', logOut: 'יציאה מהמערכת' };
  @Output() logOut = new EventEmitter<boolean>();
  isDesktop: boolean;

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

  getLinkValue(link: UohHeaderLinkInterface): string {
    return link && link.elementRef && link.elementRef.nativeElement ? link.elementRef.nativeElement.innerHTML : '';
  }

  trackByFn(index: number, item: UohHeaderLinkInterface): UohHeaderLinkInterface {
    return item;
  }
}

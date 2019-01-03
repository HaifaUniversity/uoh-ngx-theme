import { Component, Input, Output, EventEmitter, HostListener, OnInit } from '@angular/core';
import { UohHeaderUser, UohHeaderLabels } from './header.models';

@Component({
  selector: 'uoh-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  host: { class: 'uoh-header' }
})
export class HeaderComponent implements OnInit {
  @Input() title: string;
  @Input() subtitle: string;
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
}

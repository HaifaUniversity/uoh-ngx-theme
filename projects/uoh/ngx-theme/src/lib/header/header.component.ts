import { Component, Input, Output, EventEmitter } from '@angular/core';

export interface HeaderLabels {
  welcome: string;
  logOut: string;
}

@Component({
  selector: 'uoh-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  host: { class: 'uoh-header' }
})
export class HeaderComponent {
  @Input() title = 'אוניברסיטת חיפה';
  @Input() subtitle: string;
  @Input() user: string;
  @Input() logoLinkUrl = 'https://www.haifa.ac.il/';
  @Input() labels: HeaderLabels = { welcome: 'שלום', logOut: 'יציאה מהמערכת' };
  @Output() logOut = new EventEmitter<boolean>();

  constructor() {}

  onLogOut(): void {
    this.logOut.emit(true);
  }

  openHaifaWebsite(): void {
    window.open(this.logoLinkUrl, '_blank');
  }
}

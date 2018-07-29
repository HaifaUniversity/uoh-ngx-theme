import { Component, Input, Output, EventEmitter } from '@angular/core';

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
  @Output() logOut = new EventEmitter<boolean>();

  constructor() {}

  onLogOut(): void {
    this.logOut.emit(true);
  }

  openHaifaWebsite(): void {
    window.open('https://www.haifa.ac.il/', '_blank');
  }
}

import { Component, Input, OnInit, HostBinding } from '@angular/core';

@Component({
  selector: 'uoh-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  @HostBinding('class') class = 'uoh-footer';
  @Input() version: string;

  constructor() {}

  ngOnInit(): void {}
}

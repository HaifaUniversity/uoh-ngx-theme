import { Directive, ElementRef, OnInit, HostBinding } from '@angular/core';

import { UohPrivateContentService } from './private-content.service';

@Directive({
  selector: '[uohContent]'
})
export class UohContentDirective implements OnInit {
  @HostBinding('class') class = 'uoh-content';
  @HostBinding('attr.role') role = 'region';

  constructor(private element: ElementRef, private uohContent: UohPrivateContentService) {}

  ngOnInit(): void {
    this.uohContent.set(this.element);
  }
}

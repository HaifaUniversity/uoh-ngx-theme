import { Component } from '@angular/core';
import { UohContent } from '@uoh/ngx-theme';

@Component({
  selector: 'app-two',
  template: `
    <h1>Two works!</h1>
    <button (click)="test()">test</button>
  `
})
export class TwoComponent {
  constructor(private uohContent: UohContent) {}

  test(): void {
    console.log('content height', this.uohContent.height);
  }
}

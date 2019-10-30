import { Component } from '@angular/core';
import { UohContent } from '@uoh/ngx-theme';

@Component({
  selector: 'app-two',
  template: `
    <mat-card>
      <mat-card-header>
        <h1>Two works!</h1>
      </mat-card-header>
      <mat-card-content>
        <button (click)="test()">test</button>
      </mat-card-content>
    </mat-card>
    <uoh-card size="xsmall" collapse="true">
      <p>Hello this is a test for uoh-card</p>
      <h3>Test!</h3>
    </uoh-card>
  `
})
export class TwoComponent {
  constructor(private uohContent: UohContent) {}

  test(): void {
    console.log('content height', this.uohContent.height);
  }
}

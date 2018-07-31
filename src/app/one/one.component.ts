import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-one',
  templateUrl: './one.component.html'
})
export class OneComponent {
  options = ['אחת', 'שתיים', 'שלוש'];

  constructor(private snackBar: MatSnackBar) {}

  openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: 5000
    });
  }
}

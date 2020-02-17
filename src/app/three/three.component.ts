import { Component } from '@angular/core';

export interface Transaction {
  item: string;
  cost: number;
}

@Component({
  selector: 'app-three',
  templateUrl: './three.component.html',
  styleUrls: ['./three.component.scss']
})
export class ThreeComponent {
  displayedColumns: string[] = ['item', 'cost'];
  transactions: Transaction[] = [
    { item: 'כדור ים', cost: 4 },
    { item: 'מגבת', cost: 5 },
    { item: 'פריסבי', cost: 2 },
    { item: 'קרם הגנה', cost: 4 },
    { item: 'בגד ים', cost: 15 }
  ];

  /** Gets the total cost of all transactions. */
  getTotalCost() {
    return this.transactions.map(t => t.cost).reduce((acc, value) => acc + value, 0);
  }
}

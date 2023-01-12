import { Component } from '@angular/core';
import { Settings } from './tc-virtual-scroll/types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'virtual-scroll';

  settings: Settings = {
    itemHeight: 30,
    amount: 15,
    tolerance: 5,
    minIndex: -9999,
    maxIndex: 200000,
    startIndex: 0
  };
}

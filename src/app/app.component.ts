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
    minIndex: -100,
    maxIndex: 100,
    startIndex: 0
  };
}

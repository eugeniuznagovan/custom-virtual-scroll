import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { Settings } from './tc-virtual-scroll/types';
import { BehaviorSubject } from 'rxjs';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'virtual-scroll';
  settings: Settings = {
    itemHeight: 35,
    amount: 15,
    tolerance: 5,
    minIndex: -100,
    maxIndex: 100,
    startIndex: 15
  };

  @ViewChild('perfectScrollbar')
  perfectScrollbarComponent!: PerfectScrollbarComponent;

  constructor(private changeDetectorRef: ChangeDetectorRef) {
  }

  private scrollSubject = new BehaviorSubject<number>(0);
  public scroll$ = this.scrollSubject.asObservable();

  onScroll($event: any) {
    this.scrollSubject.next($event.target.scrollTop);
    this.changeDetectorRef.detectChanges();
  }

  setInitialScrollPosition(scrollTop: number) {
    this.perfectScrollbarComponent.directiveRef?.scrollToY(scrollTop);
  }
}

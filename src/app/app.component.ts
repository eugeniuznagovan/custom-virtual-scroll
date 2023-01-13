import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, ViewChild } from '@angular/core';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { TcVirtualScrollTypes } from './tc-virtual-scroll/tc-virtual-scroll.types';
import Settings = TcVirtualScrollTypes.Settings;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  settings: Settings = {
    itemHeight: 35,
    amount: 15,
    tolerance: 10,
    minIndex: -100,
    maxIndex: 100,
    startIndex: 100
  };

  scrollPosition = 0;

  @ViewChild('perfectScrollbar')
  perfectScrollbarComponent!: PerfectScrollbarComponent;

  @HostListener('scroll', ['$event'])
  onScroll(event: any) {
    this.scrollPosition = event.target.scrollTop;
    this.changeDetectorRef.detectChanges();
  }

  constructor(private changeDetectorRef: ChangeDetectorRef) {
  }

  setInitialScrollPosition(scrollTop: number) {
    this.perfectScrollbarComponent.directiveRef?.scrollToY(scrollTop);
    this.changeDetectorRef.detach();
  }
}

import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  Input,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { Settings, State } from './types';
import { BehaviorSubject, map, Subject, tap } from 'rxjs';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';

export namespace TcVirtualScrollComponentFns {

  export function getData(settings: Readonly<Settings>, offset: number, limit: number) {
    const {minIndex, maxIndex} = settings;

    const data = [];
    const start = Math.max(minIndex, offset);
    const end = Math.min(offset + limit - 1, maxIndex);

    if (start <= end) {
      for (let i = start; i <= end; i++) {
        data.push({index: i, text: `item ${i}`});
      }
    }

    return data;
  }

  export function initState(settings: Settings): State {
    const {amount, itemHeight, maxIndex, minIndex, tolerance, startIndex} = settings

    // 1) height of the visible part of the viewport (px)
    const viewportHeight = amount * itemHeight
    // 2) total height of rendered and virtualized items (px)
    const totalHeight = (maxIndex - minIndex + 1) * itemHeight
    // 3) single viewport outlet height, filled with rendered but invisible rows (px)
    const toleranceHeight = tolerance * itemHeight
    // 4) all rendered rows height, visible part + invisible outlets (px)
    const bufferHeight = viewportHeight + 2 * toleranceHeight
    // 5) number of items to be rendered, buffered dataset length (pcs)
    const bufferedItems = amount + 2 * tolerance
    // 6) how many items will be virtualized above (pcs)
    const itemsAbove = startIndex - tolerance - minIndex
    // 7) initial height of the top padding element (px)
    const topPaddingHeight = itemsAbove * itemHeight
    // 8) initial height of the bottom padding element (px)
    const bottomPaddingHeight = totalHeight - topPaddingHeight
    // 9) initial scroll position (px)
    const initialPosition = topPaddingHeight + toleranceHeight + itemHeight

    return {
      settings,
      viewportHeight,
      totalHeight,
      toleranceHeight,
      bufferHeight,
      bufferedItems,
      topPaddingHeight,
      bottomPaddingHeight,
      initialPosition,
      data: []
    }
  }

  export function updateState(state: Readonly<State>,) {
    return (eventTarget: any) => {
      const {totalHeight, toleranceHeight, bufferedItems, settings} = state;
      const {itemHeight, minIndex} = settings;

      const index = minIndex + Math.floor((eventTarget.scrollTop - toleranceHeight) / itemHeight);
      const data = fns.getData(settings, index, bufferedItems);
      const topPaddingHeight = Math.max((index - minIndex) * itemHeight, 0)
      const bottomPaddingHeight = Math.max(totalHeight - topPaddingHeight - data.length * itemHeight, 0);

      return {
        topPaddingHeight,
        bottomPaddingHeight,
        data
      };
    }
  }
}

const fns = TcVirtualScrollComponentFns;

@Component({
  selector: 'app-tc-virtual-scroll',
  templateUrl: './tc-virtual-scroll.component.html',
  styleUrls: ['./tc-virtual-scroll.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TcVirtualScrollComponent implements AfterViewInit {
  private stateSubject = new BehaviorSubject<State | undefined>(undefined);
  public state$ = this.stateSubject.asObservable();

  public scrollSubject = new Subject();
  public scroll$ = this.scrollSubject.asObservable();

  constructor(private changeDetectorRef: ChangeDetectorRef) {

  }

  @ViewChild('viewport')
  perfectScrollbar!: PerfectScrollbarComponent

  @Input()
  set settings(settings: Settings) {
    this.stateSubject.next(fns.initState(settings))
  }

  trackByIndex = (index: number, item: any) => item.index;

  @ContentChild('contentTemplate')
  contentTemplate!: TemplateRef<any>;

  ngAfterViewInit() {
    if (!this.stateSubject.value) {
      throw new Error('Missing settings');
    }

    this.scroll$.pipe(
      map(fns.updateState(this.stateSubject.value)),
    ).subscribe(updatedState => {
      this.stateSubject.next({...this.stateSubject.value, ...updatedState} as State);
      this.changeDetectorRef.detectChanges();
    });

    const initialScrollPosition = this.stateSubject.value.initialPosition;
    this.perfectScrollbar.directiveRef?.scrollToY(initialScrollPosition);
    this.scrollSubject.next({scrollTop: initialScrollPosition});
  }

  onScroll(event: Partial<Event>) {
    // @ts-ignore
    const scrollPosition = this.perfectScrollbar.directiveRef.instance.lastScrollTop;
    this.scrollSubject.next({scrollTop: scrollPosition});
  }
}

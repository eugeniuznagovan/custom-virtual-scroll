import { AfterViewInit, ChangeDetectionStrategy, Component, ContentChild, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { TcVirtualScrollTypes } from './tc-virtual-scroll.types';
import { TcVirtualScrollFns } from './tc-virtual-scroll.fns';
import State = TcVirtualScrollTypes.State;
import Settings = TcVirtualScrollTypes.Settings;


@Component({
  selector: 'app-tc-virtual-scroll[settings][scrollPosition]',
  templateUrl: './tc-virtual-scroll.component.html',
  styleUrls: ['./tc-virtual-scroll.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TcVirtualScrollComponent implements AfterViewInit {
  private stateSubject = new BehaviorSubject<State | undefined>(undefined);
  public state$ = this.stateSubject.asObservable();

  public scrollPositionSubject = new BehaviorSubject<number>(0);
  public scrollPosition$ = this.scrollPositionSubject.asObservable();

  @Input()
  set settings(settings: Settings) {
    this.stateSubject.next(TcVirtualScrollFns.initState(settings))
  }

  @Input()
  set scrollPosition(scrollPosition: number) {
    this.scrollPositionSubject.next(scrollPosition);
  }

  @Output()
  initialScrollPositionSet = new EventEmitter<number>();

  trackByIndex = (index: number, item: any) => item.index;

  @ContentChild('mainTemplate')
  mainTemplate!: TemplateRef<any>;

  @ContentChild('footerTemplate')
  footerTemplate!: TemplateRef<any>;

  @ContentChild('headerTemplate')
  headerTemplate!: TemplateRef<any>;

  ngAfterViewInit() {
    if (!this.stateSubject.value) {
      throw new Error('Missing settings');
    }

    this.scrollPosition$.pipe(
      map(TcVirtualScrollFns.updateState(this.stateSubject.value)),
    ).subscribe(updatedState => {
      this.stateSubject.next({...this.stateSubject.value, ...updatedState} as State);
    });

    this.scrollPositionSubject.next(this.stateSubject.value.initialScrollPosition);
    this.initialScrollPositionSet.emit(this.stateSubject.value.initialScrollPosition);
  }
}

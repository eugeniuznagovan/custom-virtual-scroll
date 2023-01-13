import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tc-item',
  templateUrl: './tc-item.component.html',
  styleUrls: ['./tc-item.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TcItemComponent implements OnInit {
  @Input()
  text!: string
  ngOnInit() {
  }
}

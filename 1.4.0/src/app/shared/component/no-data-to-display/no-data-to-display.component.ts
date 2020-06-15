import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'no-data-to-display',
  templateUrl: './no-data-to-display.component.html',
  styleUrls: ['./no-data-to-display.style.css']
})
export class NoDataToDisplayComponent implements OnInit {

  @Input() message = 'No data to display';
  @Input() icon = 'sentiment_very_dissatisfied';
  @Input() showDesc = false;
  @Input() link = 'click here to add new item';
  @Output() clicked: EventEmitter<any> = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {
  }
  linkClicked($event) {
    this.clicked.emit({ clicked: true });
  }

}

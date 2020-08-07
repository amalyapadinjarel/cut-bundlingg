import { Component, OnInit } from '@angular/core';
import { ValueSetSharedService } from '../../services/valueSet-shared.service';

@Component({
  selector: 'app-validation-query-based',
  templateUrl: './validation-query-based.component.html',
  styleUrls: ['./validation-query-based.component.scss'],
  host: { 'class': 'header-card' }
})
export class ValidationQueryBasedComponent implements OnInit {
  disabled: any = {};
  constructor(public _shared: ValueSetSharedService) { }

  ngOnInit(): void {
  }
  getIfEditable(key) {
    return !this.disabled[key] && this._shared.getHeaderEditable(key, this._shared.valueSet);
  }
}

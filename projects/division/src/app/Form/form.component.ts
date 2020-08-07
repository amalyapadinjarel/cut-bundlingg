import { Component, OnInit } from '@angular/core';
import { DivisionSharedService } from '../services/division-shared.service';
import { DateUtilities } from 'app/shared/utils';


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  host: { 'class': 'form-view' }

})
export class FormComponent implements OnInit {

  constructor(public _shared: DivisionSharedService,
    public dateUtils:DateUtilities) { }

  ngOnInit(): void {
  }

}

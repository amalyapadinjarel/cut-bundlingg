import { Component, OnInit } from '@angular/core';
import { FacilitySharedService } from '../../services/facility-shared.service';
import { DateUtilities } from 'app/shared/utils';

@Component({
  selector: 'app-form',
  templateUrl: './facility-form.component.html',
  styleUrls: ['./facility-form.component.scss'],
  host: { 'class': 'form-view' }
})
export class FacilityFormComponent implements OnInit {

  constructor(public _shared: FacilitySharedService,
    public dateUtils:DateUtilities) { }

  ngOnInit(): void {
  }

}

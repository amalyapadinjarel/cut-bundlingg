import { Component, OnInit } from '@angular/core';
import {MfgRoutingSharedService} from '../../../../services/mfg-routing-shared.service';

@Component({
  selector: 'general-details',
  templateUrl: './general-details.component.html',
  styleUrls: ['./general-details.component.scss'],
  host: { 'class': 'header-card' }

})
export class GeneralDetailsComponent implements OnInit {

  disabled: any = {};
  styleLov = JSON.parse(JSON.stringify(styleLovconfig));
  facilityLov = JSON.parse(JSON.stringify(FacilityLovConfig));


  constructor(public _shared: MfgRoutingSharedService) { }

  ngOnInit(): void {
  }

  getIfEditable(key) {
    return !this.disabled[key] && this._shared.getHeaderEditable(key, this._shared.id);
  }

  valueChangedFromUI($event: any) {
    
  }
}

export const styleLovconfig: any = {
  title: 'Select operation',
  url: 'lovs/styles',
  dataHeader: 'data',
  returnKey: 'value',
  displayKey: 'label',
  filterAttributes: ['label'],
  displayFields: [
    {
      key: 'label',
      title: 'Style'
    }]
};

export const FacilityLovConfig: any = {
  title: 'Select Facility',
  url: 'lovs/facility?userAcessOnly=true',
  dataHeader: 'data',
  returnKey: 'value',
  displayKey: 'label',
  filterAttributes: ['label'],
  displayFields: [{
    key: 'shortCode',
    title: 'Facility Short Code'
  }, {
    key: 'label',
    title: 'Facility Name'
  }]
};

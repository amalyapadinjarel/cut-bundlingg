import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { SmdDataTable } from 'app/shared/component';
import { MachinesSharedService } from '../services/machine-shared.service';
import { Subscription } from 'rxjs';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { MachinesService } from '../services/machine.service';


@Component({
  selector: 'machines-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  lovConfig: any = {};
  private refreshMachineList: Subscription;
  operationsLov = JSON.parse(JSON.stringify(operationsLovconfig));
  machineTypeLov = JSON.parse(JSON.stringify(machineTypeLovConfig));
  facilityLov = JSON.parse(JSON.stringify(facilityLovconfig));
// workCenterLov = JSON.parse(JSON.stringify(workCenterLovConfig));
  @ViewChild(SmdDataTable, { static: true }) datatable: SmdDataTable;
  constructor(public _shared: MachinesSharedService,
    public _inputService: TnzInputService,
    public service: MachinesService) { }

  ngOnInit(): void {
    
    this.refreshMachineList = this._shared.refreshMachineData.subscribe(
      change => {
          this.datatable.refresh(this._shared.formData['machines'])
      }
  );
  }
  

  _onDataChange(dataChange: any) {
    if (dataChange.data && dataChange.data.machines) {
        this._shared.formData = dataChange.data;
        this._shared.setFormData(dataChange.data);
        this._shared.setListData(dataChange.data);
    }
}

pageChanged(event) {
  this._shared.selectedPage = event.page;
}
deleteLine(index) {
  this._shared.deleteLine('machines', index)
}

validateData(event, index, attr) {
  const attrValue = event.value.trim();
  const upperValue = attrValue.toUpperCase();
  if (attr == 'machineCode' && attrValue.length > 0) {
      this.service.duplicateMachineCodeCheck(upperValue).then(data => {
          if (data) {
              this._inputService.setError(event.path, 'Duplicate machine code -' + upperValue + ' !');
          }
      }).catch(err => {
      });
  }
}
valueChangedFromFacility(index,event , primaryKeyvalue = null){
  if(primaryKeyvalue == 0 ){
    this._inputService.updateInput(this._shared.getMachinesAttrPath(index,'wc'),'');
  }
  else{
    this._shared.formData["machines"][index].wc = "";}
	// let wcParam = `?facility=${event.value.value}`;
	// let wcUrl = 'lovs/work-center';
	// let newUrl = wcUrl + wcParam
  // this.workCenterLov = {...this.workCenterLov, url: newUrl};
 
 
}
  

workCenterLov(index,field) {
  let cache = this._inputService.getInputValue(this._shared.getMachinesAttrPath(index,'facility'))
  return JSON.parse(JSON.stringify(workCenterLovConfig(cache ? cache.value != "" ? cache.value: 0 : 0)));
}

}

export const operationsLovconfig: any = {
  title: 'Select operation',
  url: 'lovs/operation',
  dataHeader: 'data',
  returnKey: 'value',
  displayKey: 'label',
  filterAttributes: ['label'],
  displayFields: [
      {
          key: 'label',
          title: 'Operation'
      },
      {
          key: 'shortCode',
          title: 'Operation Code'
      },]
};

export const machineTypeLovConfig: any = {
	title: 'Select Machine Type',
	url: 'lovs/machine-type',
	dataHeader: 'data',
  returnKey: 'value',
  displayKey: 'label',
	filterAttributes: ['label'],
	displayFields: [
		{
			key: 'label',
			title: 'Name'
		}
	]
};


export const facilityLovconfig: any = {
  title: 'Select packing Method',
  url: 'lovs/facility-for-user',
  dataHeader: 'data',
  returnKey: 'value',
  displayKey: 'shortCode',
  filterAttributes: ['shortCode'],
  displayFields: [{
      key: 'label',
      title: 'Facility Name'
  },
  {
      key: 'shortCode',
      title: 'Facility Short code'
  }]
};


// export const workCenterLovConfig: any = {
//   title: 'Select Workcenter',
//   url: 'lovs/work-center',
// dataHeader: 'data',
// returnKey: 'value',
// displayKey: 'shortCode',
//   filterAttributes: ['label'],
//   displayFields: [
//     {
//       key: 'label',
//       title: 'Name'
//   },
//   {
//     key: 'shortCode',
//     title: 'Short Code'
//     }
// ]

// };

export function workCenterLovConfig(facilityId) {
  let json =
      {
          title: 'Select Work Center',
         url: "lovs/work-center?facility="+facilityId ,
          dataHeader: 'data',
          returnKey: 'value',
          displayKey: 'shortCode',
          filterAttributes: ['shortCode'],
          displayFields: [{
              key: 'label',
              title: 'Work center Name'
          },
          {
              key: 'shortCode',
              title: 'Work center Short code'
          }]
      }
  return json
}

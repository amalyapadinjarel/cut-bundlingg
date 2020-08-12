import { Component, OnInit, OnDestroy } from '@angular/core';
import { FacilitySharedService } from '../../../services/facility-shared.service';
import { FacilityService } from '../../../services/facility.service';
import { ApiService } from 'app/shared/services';
import { Address } from '../../../models/facility.model';
import { LocationLovConfig } from '../../../models/lov-config';
import { MatDialog } from '@angular/material/dialog';
import { AddlocationPopupComponent } from '../addlocation-popup/addlocation-popup.component';
import {SubSink} from 'subsink';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';

@Component({
  selector: 'app-facility-header',
  templateUrl: './facility-header.component.html',
  styleUrls: ['./facility-header.component.scss'],
  host: { 'class': 'header-card' }
})
export class FacilityHeaderComponent implements OnInit, OnDestroy {
  disabled: any = {};
  locationLov = JSON.parse(JSON.stringify(LocationLovConfig));
  subs = new SubSink();
  alertUtils: any;

    constructor(public _shared: FacilitySharedService,
      private inputService: TnzInputService,
    private _service: FacilityService,
    private apiService: ApiService,
    private dialog: MatDialog) { }

  ngOnInit(): void {
  }
  getIfEditable(key) {
		return !this.disabled[key] && this._shared.getHeaderEditable(key, this._shared.id);
  }
  // valueChangedFromUI(change) {
  //   if (change.displayValue == 'ADD NEW') {
  
  //     const dialogRef = this.dialog.open(AddlocationPopupComponent);
    
  //     this.subs.sink = dialogRef.afterClosed().subscribe(res => {
  //       console.log(res);
        
  //         if (res) {
  //             let newLocation = {
  //                 value: res.locationId,
  //                 label: res.locationCode
  //             }
  //             this.inputService.updateInput(change.path, newLocation);
  //         } else {
  //             this.inputService.updateInput(change.path, '');
  //         }
  //     })
  // }
  // else{
  //   let flag = false;
  //   let foundOne = false;
  //   let path = change.path;
  //   if (flag){
      
  //     this.alertUtils.showAlerts('Selected location already exist.');
  //     this.inputService.setError(path, 'Selected location already exist.')
  //   }
  // }
  // if (change.displayValue != 'ADD NEW'){
  //   this._shared.addressLoading = true;
  //  this._service.fetchAddress(change.value.value).then((address : Address)=>{
  //  this._shared.setAddress(address);
  //  console.log(this._shared.formData);
   
  //  this._shared.addressLoading = false;
  //  });
  
  // }
  
  // }
  ngOnDestroy(): void {
  }
  valueChangedFromUI(change) {
 
    if(change.value.value ){
  
     this._shared.addressLoading = true;
    this._service.fetchAddress(change.value.value).then((address : Address)=>{
    this._shared.setAddress(address);
   
  
    this._shared.addressLoading = false;
    
    
    });
   
   }
 
 }
 addLocation(){
  // if (change.displayValue == 'ADD NEW') {
 
    let path='facility.'+this._shared.id+'.header.location'
     const dialogRef = this.dialog.open(AddlocationPopupComponent);
     this.subs.sink = dialogRef.afterClosed().subscribe(res => {
          if (res) {
              let newLocation = {
                  value: res.locationId,
                  label: res.locationCode
              }
             this.inputService.updateInput(path, newLocation);
         } else {
             // this.inputService.updateInput(path, '');
         }
     })
 //  } else {
 //      let flag = false;
 //      let foundOne = false;
 //      let path = change.path;
 //      if (flag) {
 //          this.alertUtils.showAlerts('Selected location already exist.');
 //          this.inputService.setError(path, 'Selected location already exist.')
 //      }
 //     }
 }
}

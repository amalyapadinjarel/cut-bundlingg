import { Component, OnInit, OnDestroy } from '@angular/core';
import { DivisionSharedService } from '../../services/division-shared.service';
import { LocationLovConfig } from '../../models/lov-config';
import { ApiService } from 'app/shared/services';
import { Address } from '../../models/division.model';
import { DivisionService } from '../../services/division.service';
import { AlertUtilities } from 'app/shared/utils';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { MatDialog } from '@angular/material/dialog';
import { NewOperationGroupComponent } from '../../../../../mfg-routing/src/app/components/mfg-routing-form/components/new-operation-group/new-operation-group.component';
import { SubSink } from 'subsink';
import { NewLocationComponent } from '../new-location/new-location.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  host: { 'class': 'header-card' }
})
export class HeaderComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  disabled: any = {};
  locationLov = JSON.parse(JSON.stringify(LocationLovConfig));
  constructor(public _shared: DivisionSharedService,
    private _service: DivisionService,
    private apiService: ApiService,
    private alertUtils: AlertUtilities,
    public inputService: TnzInputService,
    private dialog: MatDialog,) { }

  ngOnInit(): void {
    // this.subs.sink = this.router.events.subscribe(change => {
    //   this.routerChanged(change);
  }getIfEditable(key) {
		return !this.disabled[key] && this._shared.getHeaderEditable(key, this._shared.id);
  }
  
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

   let path='division.'+this._shared.id+'.header.location'
    const dialogRef = this.dialog.open(NewLocationComponent);
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

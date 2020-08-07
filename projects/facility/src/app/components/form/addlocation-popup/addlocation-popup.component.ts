import { Component, OnInit } from '@angular/core';
import { FacilitySharedService } from '../../../services/facility-shared.service';
import { FacilityService } from '../../../services/facility.service';
import { FormBuilder } from '@angular/forms';
import { ApiService } from 'app/shared/services';
import { AlertUtilities } from 'app/shared/utils';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { MatDialogRef } from '@angular/material/dialog';
import { CountryLovConfig } from '../../../models/lov-config';
import {SubSink} from 'subsink';

@Component({
  selector: 'app-addlocation-popup',
  templateUrl: './addlocation-popup.component.html',
  styleUrls: ['./addlocation-popup.component.scss']
})
export class AddlocationPopupComponent implements OnInit {
  subs = new SubSink();
  countryLov = JSON.parse(JSON.stringify(CountryLovConfig));
  constructor(
    public _shared: FacilitySharedService,
    private _service: FacilityService,
    private fb: FormBuilder,
              private apiService: ApiService,
              private alertService: AlertUtilities,
              public dialogRef: MatDialogRef<AddlocationPopupComponent>,
              private _inputService: TnzInputService,
              private inputService: TnzInputService
  ) { }

  ngOnInit(): void {
  }
  save() {
    const inputs = this.inputService.getInput(this._shared.locationPath);
  
    if (inputs) {
      
      const invalid = Object.keys(inputs).some(key => {
        if (inputs[key] && inputs[key].status != 'ok' && inputs[key].status != 'changed') {
          return true;
        }
      });
      if (invalid) {
        this.alertService.showAlerts('Please fill the mandatory fields.');
      } else {
        const saveData = {};
        Object.keys(inputs).some(key => {
          if (inputs[key]) {
            console.log('key',inputs[key])
            if(inputs[key]._key=="locationCode"){
            inputs[key]._value=inputs[key]._value.toUpperCase();
            console.log('inputs[key]._value-----',inputs[key]._value)
            }
            saveData[key] = inputs[key]._value;
          }
        });
        // @ts-ignore
        // saveData.opOrGroup = 'G'
        
       this.subs.sink =  this.apiService.post('/division/location', saveData).subscribe(ret => {
          if (ret) {
            if (!ret.data) {
              this.alertService.showAlerts('Save operation failed. ' + 'Location already exists');
            } else {
              this.dialogRef.close(ret.data);
            }
          }
        })
      }
    }
  }
  emailValidation(change) {
    if (!(/^(.+)@(.+)$/.test(change.displayValue)))
      this.inputService.setError(this._shared.getlocationPath('email'), 'Please enter a valid email address.');
 
  }
  PhoneNumberValidation1(change) {
    var reg = /^\d+$/;
    if (!reg.test(change.displayValue))
      this._inputService.setError(this._shared.getlocationPath('telephoneNo1'), 'Please enter a valid phone number (Only numbers allowed)!');
  }
  PhoneNumberValidation2(change) {
    var reg = /^\d+$/;
    if (!reg.test(change.displayValue))
      this._inputService.setError(this._shared.getlocationPath('telephoneNo2'), 'Please enter a valid phone number (Only numbers allowed)!');
  }
  // UrlValidation(change) {
  // var reg=/^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;
  // if (!reg.test(change.displayValue))
  // this._inputService.setError(this._shared.getlocationPath('websiteUrl'), 'Please enter a valid url.');
  // }

}

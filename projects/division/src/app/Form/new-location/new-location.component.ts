import { Component, OnInit } from '@angular/core';
import { DivisionSharedService } from '../../services/division-shared.service';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { AlertUtilities } from 'app/shared/utils';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';
import { ApiService } from 'app/shared/services';
import { SubSink } from 'subsink';
import { CountryLovConfig } from '../../models/lov-config';

@Component({
  selector: 'app-new-location',
  templateUrl: './new-location.component.html',
  styleUrls: ['./new-location.component.scss']
})
export class NewLocationComponent implements OnInit {
  subs = new SubSink();
  countryLov = JSON.parse(JSON.stringify(CountryLovConfig));
  constructor(public _shared: DivisionSharedService,
    private fb: FormBuilder,
    public inputService: TnzInputService,
    private alertService: AlertUtilities,
    public dialogRef: MatDialogRef<NewLocationComponent>,
    private apiService: ApiService,
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
            if(inputs[key]._key=="locationCode"){
            inputs[key]._value=inputs[key]._value.toUpperCase();
            }
    
            saveData[key] = inputs[key]._value;
          }
        });
        // @ts-ignore
       // saveData.opOrGroup = 'G'
       this.subs.sink =  this.apiService.post('/division/location', saveData).subscribe(ret => {
          if (ret) {
            if (!ret.data) {
              this.alertService.showAlerts('Save operation failed. ' + 'location already exists');
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

  
  PhoneNumberValidation(change) {
    var reg = /^\d+$/;
    if (!reg.test(change.displayValue))
      this.inputService.setError(this._shared.getlocationPath('telephoneNo1'), 'Please enter a valid phone number (Only numbers allowed)!');
  }
}

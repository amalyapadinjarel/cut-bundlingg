import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ApiService} from '../../../../../../../../src/app/shared/services';
import {AlertUtilities} from '../../../../../../../../src/app/shared/utils';
import {MatDialogRef} from '@angular/material/dialog';
import {TnzInputService} from '../../../../../../../../src/app/shared/tnz-input/_service/tnz-input.service';
import {MfgRoutingSharedService} from '../../../../services/mfg-routing-shared.service';
import {MfgRoutingService} from '../../../../services/mfg-routing.service';
import {SubSink} from 'subsink';

@Component({
  selector: 'app-new-operation-group',
  templateUrl: './new-operation-group.component.html',
  styleUrls: ['./new-operation-group.component.scss']
})
export class NewOperationGroupComponent implements OnInit, OnDestroy {
  subs = new SubSink();
  constructor(private fb: FormBuilder,
              private apiService: ApiService,
              private alertService: AlertUtilities,
              public dialogRef: MatDialogRef<NewOperationGroupComponent>,
              private _inputService: TnzInputService,
              public _shared: MfgRoutingSharedService,
              public _service: MfgRoutingService,
              private inputService: TnzInputService
  ) {
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  save() {
    const inputs = this.inputService.getInput(this._shared.operationGroupPath);
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
            saveData[key] = inputs[key]._value;
          }
        });
        // @ts-ignore
        saveData.opOrGroup = 'G'
       this.subs.sink =  this.apiService.post('/routing/operation', saveData).subscribe(ret => {
          if (ret) {
            if (!ret.data) {
              this.alertService.showAlerts('Save operation failed. ' + 'Operation group already exists');
            } else {
              this.dialogRef.close(ret.data);
            }
          }
        })
      }
    }
  }

  valueChangedFromUI(event) {

  }


}

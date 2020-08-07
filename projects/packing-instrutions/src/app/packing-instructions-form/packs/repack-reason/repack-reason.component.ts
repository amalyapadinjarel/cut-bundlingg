import { Component, OnInit } from '@angular/core';
import { PackingInstructionsSharedService } from '../../../services/packing-instructions-shared.service';
import { AlertUtilities } from 'app/shared/utils';
import { rePackReasonLovconfig } from '../../../models/lov-config';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'app/shared/services';

@Component({
  selector: 'app-repack-reason',
  templateUrl: './repack-reason.component.html',
  styleUrls: ['./repack-reason.component.scss']
})
export class RepackReasonComponent implements OnInit {

  rePackReason = JSON.parse(JSON.stringify(rePackReasonLovconfig));
  csPackId : Number = 0;
  constructor(public _shared: PackingInstructionsSharedService,
    private alertService: AlertUtilities,
    private inputService: TnzInputService,
    private apiService: ApiService,
    public dialogRef: MatDialogRef<RepackReasonComponent>) { }
   
  ngOnInit(): void {
  }

  save(){
    let inputs = this.inputService.getInput(this._shared.rePackReasonPath);
    if (inputs) {
      let invalid = Object.keys(inputs).some(key => {
            if (inputs[key] && inputs[key].status != "ok" && inputs[key].status != "changed") {
              return true;
            }
      });
      if(invalid){
        this.alertService.showAlerts("Please fill the mandatory fields.");
      }
      else{
        let saveData = {};
        Object.keys(inputs).some(key => {
          if (inputs[key]) {
            saveData[key]=inputs[key]._value;
          }
        });
        if(this.csPackId && this.csPackId != 0 ){
          this.apiService.put('/' + this._shared.apiBase + "/rePack/" + this.csPackId,saveData).subscribe(ret=>{
            if(ret){
              if(ret.status == 'F')
                this.alertService.showAlerts("Save operation failed. " + ret.data.msg);
              else{
                  this.dialogRef.close(true);
              }
            }
          })
        }
      }
    }
  }
  

  onValueChange(event){
    
  }

}

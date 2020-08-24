import { Component, OnInit } from '@angular/core';
import { CopyFromUserLovConfig, UserLovConfig } from '../Models/lov-config';
import { UserWcAccessSharedService } from '../_services/user-wc-access-shared.service';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { AlertUtilities } from 'app/shared/utils';
import { SubSink } from 'subsink';
import { UserWcAccessService } from '../_services/user-wc-access.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-copy-from-user',
  templateUrl: './copy-from-user.component.html',
  styleUrls: ['./copy-from-user.component.scss']
})
export class CopyFromUserComponent implements OnInit {
  subs = new SubSink();
fromUser
toUser
  CopyFromUserLov = JSON.parse(JSON.stringify(CopyFromUserLovConfig));
  UserLov = JSON.parse(JSON.stringify(UserLovConfig));
  constructor(public _shared:UserWcAccessSharedService,
    private service:UserWcAccessService,
    public inputService: TnzInputService,
    private alertService: AlertUtilities,
    public dialogRef: MatDialogRef<CopyFromUserComponent>) { }

  ngOnInit(): void {
  }
  Add(){
    const inputs = this.inputService.getInput(this._shared.userPath);
    if (inputs) {
      const invalid = Object.keys(inputs).some(key => {
        if (inputs[key] && inputs[key].status != 'ok' && inputs[key].status != 'changed') {
          return true;
        }
      });
      if (invalid) {
        this.alertService.showAlerts('Please fill the mandatory fields.');
      } else {
        Object.keys(inputs).some(key => {
          if (inputs[key]) {
            if(inputs[key]._key=="fromuser")
            this.fromUser= inputs[key]._value
            if(inputs[key]._key=="newuser")
            this.toUser= inputs[key]._value
          }
        });
     
        this.service.getCopyUserData(this.fromUser,this.toUser).then(
          (data: any) => {
            const newLine = this._shared.getLineModel(null);
            data.forEach(element => {
              newLine['userName']= this.toUser
              newLine['facility']=element.facility
              newLine['workCenter']=element.workCenter
              this._shared.addLine("userWcAccess", newLine)
              this.dialogRef.close();
              this._shared.editMode = true;
            });
        },
        (err) => {
          if(err="NODATA")
          this.alertService.showAlerts("No Data to Copy!")
else
          this.alertService.showAlerts("Failed to Copy Mapping")

      }
        
        );
      }
    }    
  }  
}

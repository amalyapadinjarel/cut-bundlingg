import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from 'app/shared/services';
import { AlertUtilities } from 'app/shared/utils';
import { MatDialogRef } from '@angular/material/dialog';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { RoutingSharedService } from '../../_service/routing-shared.service';
import { RoutingService } from '../../_service/routing.service';

@Component({
  selector: 'app-add-new-semi-product',
  templateUrl: './add-new-semi-product.component.html',
  styleUrls: ['./add-new-semi-product.component.scss']
})
export class AddNewSemiProductComponent implements OnInit {

  formGroup: FormGroup;
  constructor(private fb: FormBuilder,
      private apiService: ApiService,
      private alertService: AlertUtilities,
      public dialogRef: MatDialogRef<AddNewSemiProductComponent>,
      private _inputService: TnzInputService,
      public _shared: RoutingSharedService,
      public _service: RoutingService,
      private inputService: TnzInputService
      ) { 
    this.formGroup = this.fb.group({
      semiProdName: "",
      semiProdCode: "",
      description: ""
    });
  }

  ngOnInit(): void {
  }

  save(){
    let inputs = this.inputService.getInput(this._shared.semiProdPath);
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
      this.apiService.post("/routing/semi-products",saveData).subscribe(ret=>{
              if(ret && ret.data){
                if(ret.data.status == 'F')
                  this.alertService.showAlerts("Save operation failed. " + ret.data.msg);
                else{
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

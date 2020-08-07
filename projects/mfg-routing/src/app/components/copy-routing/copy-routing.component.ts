import { Component, OnInit } from '@angular/core';
import { MfgRoutingSharedService } from '../../services/mfg-routing-shared.service';
import { styleLovconfig } from '../mfg-routing-form/components/general-details/general-details.component';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-copy-routing',
  templateUrl: './copy-routing.component.html',
  styleUrls: ['./copy-routing.component.scss']
})
export class CopyRoutingComponent implements OnInit {
  styleLov = JSON.parse(JSON.stringify(styleLovconfig));
  loading = false;
  styleId;
  constructor(
    private dialogRef: MatDialogRef<CopyRoutingComponent>
  ) { }

  ngOnInit(): void {
  }

  valueChangedFromUI(event){
    console.log(event)
    if(event && event.value && event.value.value){
      this.styleId = event.value.value
    } else {
      this.styleId = null
    }
  }

  close(flag){
      this.dialogRef.close(flag? this.styleId: null)
  }

}

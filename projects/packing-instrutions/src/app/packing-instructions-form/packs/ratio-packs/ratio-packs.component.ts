import { Component, OnInit, Input } from '@angular/core';
import { PackingInstructionsService } from '../../../services/packing-instructions.service';
import { PackingInstructionsSharedService } from '../../../services/packing-instructions-shared.service';
import { AlertUtilities } from 'app/shared/utils';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ratio-packs',
  templateUrl: './ratio-packs.component.html',
  styleUrls: ['./ratio-packs.component.scss']
})
export class RatioPacksComponent implements OnInit {

  @Input() mainIndex;
  @Input() formData ;any;
  public noOfCartons;
  public quantity;
  public sizeArray = [];
  public excess;
  public short;
  private refreshPackDetails: Subscription;
  private updatePackDetails: Subscription;
  public sequence;

  constructor(private _service: PackingInstructionsService,
		public _shared: PackingInstructionsSharedService,
		private alertUtils: AlertUtilities,
		public inputService: TnzInputService,
		private dialog: MatDialog) {
      this._shared.validationEmitter.subscribe(data=>{
        if(data){
          this.setError(data.error);
        }
      })
     }

  ngOnInit(): void {
    this.noOfCartons = this._shared.formData['packsDetails'].grpKey[this.mainIndex].noOfCartons;
    this.excess = this._shared.formData['packsDetails'].grpKey[this.mainIndex].excess;
    this.short = this._shared.formData['packsDetails'].grpKey[this.mainIndex].short;
    this.sequence = this._shared.formData['packsDetails'].grpKey[this.mainIndex].sequence;
    this.refreshPackDetails = this._shared.refreshpacksDetails.subscribe(change => {
			if (change){}
    });
    this.updatePackDetails = this._shared.updatePackDetails.subscribe(change => {
			this.sequence = this._shared.formData['packsDetails'].grpKey[this.mainIndex]?.sequence;
    });
    let sum = 0;
    this.formData['color'].forEach(elem=>{
      if(elem && elem.size){
        let sizeCache = [];
        elem.size.forEach((element,index)=>{
          sum = sum + Number(element.value ? element.value : 0);
          if(this.sizeArray.indexOf(element.sizeValue) == -1 && element.value){
            this.sizeArray.push(element.sizeValue)
          }
          if(element.value){
            sizeCache.push(element);
          }
        })
        elem.size = sizeCache;
      }
    });
    this.quantity = sum * Number(this.noOfCartons);

    this.formData['color'].forEach(elem=>{
      let size = [];
        this.sizeArray.forEach(y=>{
        let flag = false;
        elem.size.forEach(z=>{
          if(y == z.sizeValue){
            flag = true;
            size.push(z);
          }
        })
        if(!flag){
          size.push([]);
        }
      });
      elem.size = [...size];
    });
  }

  deleteRatioLine(index){
    if(!this._shared.isCartonGenerated){
      this._shared.deleteRatioLine('packsDetails',index,this.mainIndex);
    }
    else{
      this.alertUtils.showAlerts("Carton already generated");
    }
  }
  
  valuechanged(event,key){
    switch(key){
      case 'noOfCartons' : {
        if(event.value != ""){
          this.formData.orderQty = Number(event.value) * Number(this.formData.qntyPerCtn);
          this.inputService.updateInputCache(this._shared.getRatioHeaderFromKey(this.mainIndex,'orderQty'),this.formData.orderQty);
        } 
        break;      
      }
    }
  }

  setError(data){
    let isValid = true;
    data.forEach(pId=>{
      this.formData['color'].forEach((elem,index)=>{
        elem.size.forEach(x=>{
          if(x.productId == pId){
            isValid = false;
          }
        })
      })
    });
    if(!isValid){
      this.inputService.setError(this._shared.getRatioHeaderFromKey(this.mainIndex,'noOfCartons'),'Specified quantity greater than order quantity')
    }
  }

  checkShortAndExcessEditable(key) : Boolean{
    let value = this.inputService.getInputValue(this._shared.getRatioHeaderFromKey(this.mainIndex,key))
    if(value && value != ""){
      return false;
    }
    return true;
  }
  
}

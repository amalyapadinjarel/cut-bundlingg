import { Component, OnInit, Input } from '@angular/core';
import { PackingInstructionsService } from '../../../services/packing-instructions.service';
import { PackingInstructionsSharedService } from '../../../services/packing-instructions-shared.service';
import { AlertUtilities } from 'app/shared/utils';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { packingMethodLovconfig } from '../../../models/lov-config';
import { ConfirmPopupComponent } from 'app/shared/component';
import { RepackReasonComponent } from '../repack-reason/repack-reason.component';

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
  packingMethod = JSON.parse(JSON.stringify(packingMethodLovconfig));

  constructor(private _service: PackingInstructionsService,
		public _shared: PackingInstructionsSharedService,
		private alertUtils: AlertUtilities,
		public inputService: TnzInputService,
		private dialog: MatDialog) {
      this._shared.validationEmitter.subscribe(data=>{
        if(data.error){
          this.setError(data.error);
        }
        if(data.packQtyNotValidSeq){
          this.setErrorForPackQty(data.packQtyNotValidSeq);
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
      let totalUnit = 0;
      if(elem && elem.size){
        let sizeCache = [];
        elem.size.forEach((element,index)=>{
          sum = sum + Number(element.value ? element.value : 0);
          totalUnit = totalUnit + Number(element.value ? element.value : 0)
          if(this.sizeArray.indexOf(element.sizeValue) == -1 && element.value){
            this.sizeArray.push(element.sizeValue)
          }
          if(element.value){
            sizeCache.push(element);
          }
        })
        elem.size = sizeCache;
        elem.totalUnit = totalUnit;
      }
    });
    this.sizeArray.push('Total Units');
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
        if(!flag && y != 'Total Units'){
          size.push([]);
        }
        if(!flag && y == 'Total Units'){
          size.push(y);
        }
      });
      elem.size = [...size];
    });
  }

  deleteRatioLine(index){
    if(!this._shared.isCartonGenerated || this.formData.activeCarton == 0){
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
      case 'packQty' : {
        if(event.value !=""){
          let prePack = this.inputService.getInputValue(this._shared.getRatioHeaderFromKey(this.mainIndex,'prePack'));
          let packQty = this.inputService.getInputValue(this._shared.getRatioHeaderFromKey(this.mainIndex,'packQty'));
          if(Number(event.value) % Number(this.formData.sumOfRatios) == 0){
            this.formData.noOfCartons = Math.ceil(Number(event.value)/(Number(prePack) * Number(this.formData.sumOfRatios)));
            this.inputService.updateInputCache(this._shared.getRatioHeaderFromKey(this.mainIndex,'noOfCartons'),this.formData.noOfCartons);
            this.formData.orderQty = Number(event.value);
            this.inputService.updateInputCache(this._shared.getRatioHeaderFromKey(this.mainIndex,'orderQty'),this.formData.orderQty);
            this.inputService.updateInputCache(this._shared.getRatioHeaderFromKey(this.mainIndex,'prePack'),prePack);
            if(Number(event.value) < (Number(prePack) * Number(this.formData.sumOfRatios))){
              this.inputService.setError(this._shared.getRatioHeaderFromKey(this.mainIndex,'packQty'),"Pack quantity should be greater than 'Pre Pack * Total Units' (" + (Number(prePack) * Number(this.formData.sumOfRatios)) + ")");
            }
            else{
              this.inputService.resetError(this._shared.getRatioHeaderFromKey(this.mainIndex,'packQty'));
            }
          }
          else{
            this.inputService.setError(this._shared.getRatioHeaderFromKey(this.mainIndex,'packQty'),"Pack quantity should be a multiple of sum of ratios (" + this.formData.sumOfRatios + ")");
          }
        }
        break;
      }
      case 'prePack' :{
        if(event.value !=""){
          let packQty = this.inputService.getInputValue(this._shared.getRatioHeaderFromKey(this.mainIndex,'packQty'));
          this.formData.noOfCartons = Math.ceil(Number(packQty)/(Number(event.value) * Number(this.formData.sumOfRatios)));
          this.formData.qntyPerCtn = Number(this.formData.sumOfRatios) * Number(event.value);
          this.inputService.updateInputCache(this._shared.getRatioHeaderFromKey(this.mainIndex,'noOfCartons'),this.formData.noOfCartons);
          this.inputService.updateInputCache(this._shared.getRatioHeaderFromKey(this.mainIndex,'qntyPerCtn'),this.formData.qntyPerCtn);
          this.inputService.updateInputCache(this._shared.getRatioHeaderFromKey(this.mainIndex,'packQty'),packQty);
          if(Number(packQty) < (Number(event.value) * Number(this.formData.sumOfRatios))){
            this.inputService.setError(this._shared.getRatioHeaderFromKey(this.mainIndex,'packQty'),"Pack quantity should be greater than 'Pre Pack * Total Units' (" + (Number(event.value) * Number(this.formData.sumOfRatios)) + ")");
          }
          else{
            this.inputService.resetError(this._shared.getRatioHeaderFromKey(this.mainIndex,'packQty'));
          }
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
      this.inputService.setError(this._shared.getRatioHeaderFromKey(this.mainIndex,'packQty'),'Specified quantity greater than order quantity')
    }
  }

  checkShortAndExcessEditable(key) : Boolean{
    let value = this.inputService.getInputValue(this._shared.getRatioHeaderFromKey(this.mainIndex,key))
    if(value && value != ""){
      return false;
    }
    return true;
  }

  deleteRatioCartonLine(index){
    if(this._shared.isCartonGenerated){
      this._service.deleteCartonPerPackValidation(this.formData.csPackId).then(data=>{
        if(data){
          const dialog = this.dialog.open(ConfirmPopupComponent);
          dialog.componentInstance.dialogTitle = 'Warning';
          dialog.componentInstance.message = 'Are you sure to delete carton?';
          dialog.componentInstance.confirmText = 'Delete';
          dialog.afterClosed().subscribe(data=>{
            if(data){
              this._service.deleteCartonPerPack(this.formData.csPackId).then(data=>{
                if(data){
                  this.alertUtils.showAlerts("Carton delete successfull.")
                  this._shared.refreshData.next(true);
                }
                else{
                  this.alertUtils.showAlerts("Carton delete Failed.")
                }
              })
              .catch(err=>{
              })
            }
          })
        }
      })
    }
    else{
      this.alertUtils.showAlerts("No cartons generated");
    }
  }

  setErrorForPackQty(seqList){
    if(seqList.includes(Number(this.formData.sequence))){
      let prePack = this.inputService.getInputValue(this._shared.getRatioHeaderFromKey(this.mainIndex,'prePack'));
      let packQty = this.inputService.getInputValue(this._shared.getRatioHeaderFromKey(this.mainIndex,'packQty'));
      if(Number(this.formData.orderQty) % Number(this.formData.sumOfRatios) != 0){
        this.inputService.setError(this._shared.getRatioHeaderFromKey(this.mainIndex,'packQty'),"Pack quantity should be a multiple of sum of ratios (" + this.formData.sumOfRatios + ")");
      }
      else if(Number(packQty) < (Number(prePack) * Number(this.formData.sumOfRatios))){
        this.inputService.setError(this._shared.getRatioHeaderFromKey(this.mainIndex,'packQty'),"Pack quantity should be greater than 'Pre Pack * Total Units' (" + (Number(prePack) * Number(this.formData.sumOfRatios)) + ")");
      }
    }
  }

  rePackCarton(mainIndex){
    if(this._shared.isCartonGenerated){
      this._service.rePackCartonValidation(this.formData.csPackId).then(data=>{
        if(data){
          const dialog = this.dialog.open(RepackReasonComponent);
          dialog.componentInstance.csPackId = Number(this.formData.csPackId);
          dialog.afterClosed().subscribe(data=>{
            if(data){
                  this.alertUtils.showAlerts("Carton repack successfull.")
                  this._shared.refreshData.next(true);
            }
            else{
              this.alertUtils.showAlerts("Carton repack Failed.")
            }
          })
        }
      })
    }
    else{
      this.alertUtils.showAlerts("No cartons generated");
    }
  }
  
}

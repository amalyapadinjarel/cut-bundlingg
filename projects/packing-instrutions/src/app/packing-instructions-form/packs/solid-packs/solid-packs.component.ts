import { Component, OnInit, ViewChild } from '@angular/core';
import { PackingInstructionsService } from '../../../services/packing-instructions.service';
import { PackingInstructionsSharedService } from '../../../services/packing-instructions-shared.service';
import { AlertUtilities } from 'app/shared/utils';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { MatDialog } from '@angular/material/dialog';
import { Input } from '@angular/core';
import { SmdDataTable } from 'app/shared/component';
import {JSONUtils} from 'app/shared/utils/json.utility';
import { Subscription } from 'rxjs/internal/Subscription';


@Component({
  selector: 'app-solid-packs',
  templateUrl: './solid-packs.component.html',
  styleUrls: ['./solid-packs.component.scss']
})
export class SolidPacksComponent implements OnInit {
  key = 'packsDetails';
  @ViewChild(SmdDataTable, { static: true }) dataTable: SmdDataTable;
  @Input() mainIndex;
  @Input() formData ;any;
  public qntyPerCtn;
	private refreshPackDetails: Subscription;
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

  ngOnInit(){
    this.qntyPerCtn = this._shared.formData['packsDetails'].grpKey[this.mainIndex].qntyPerCtn;
    this.refreshDataTable();
    this.refreshPackDetails = this._shared.refreshpacksDetails.subscribe(change => {
			if (change){}
        this.refreshDataTable();
		});
  }

  deleteLine(index){
    if(!this._shared.isCartonGenerated){
      this._shared.deleteSolidLine(this.key, index,this.mainIndex);
    }
    else{
      this.alertUtils.showAlerts("Carton already generated");
    }
  }
  
  valuechanged(event){
  }

  getShort(val): String{
    if(val && val != ''){
      return "-" +val + " Pcs"
    }
    return ""
  }

  getExcess(val): String{
    if(val && val != ''){
      return "+" +val + " Pcs"
    }
    return ""
  }

  setError(data){
    data.forEach(pId=>{
      this.formData.forEach((elem,index)=>{
        if(pId == elem.productId){
          this.inputService.setError(this._shared.getPacksDetailsPath(this.mainIndex,index,'orderQty'),'Specified quantity greater than order quantity')
        }
      })
    })
  }

  onRowSelected() {
		this._shared.setSelectedLines(this.key,this.mainIndex,this.dataTable.selectedModels())
	}

  refreshDataTable(){
    this.dataTable.refresh(this.formData);
  }

  onValueChanged(event,index,key){ 
    if(event){
      if(key == 'orderQty'){
        let noOfCtn = Math.ceil(Number(event.value)/this.qntyPerCtn);
        this.inputService.updateInput(this._shared.getPacksDetailsPath(this.mainIndex,index,'noOfCartons'),noOfCtn)
      }
    }
  }

  checkShortAndExcessEditable(index,key) : Boolean{
    let value = this.inputService.getInputValue(this._shared.getPacksDetailsPath(this.mainIndex,index,key))
    if(value && value != ""){
      return false;
    }
    return true;
  }
}

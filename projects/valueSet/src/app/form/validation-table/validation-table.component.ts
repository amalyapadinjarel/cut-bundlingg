import { Component, OnInit } from '@angular/core';
import { ValueSetSharedService } from '../../services/valueSet-shared.service';
import { TableLovConfig, ColumnLovConfig } from '../../model/lov.config';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';

@Component({
  selector: 'app-validation-table',
  templateUrl: './validation-table.component.html',
  styleUrls: ['./validation-table.component.scss'],
  host: { 'class': 'header-card' }
})
export class ValidationTableComponent implements OnInit {
  disabled: any = {};
  changedtable: any = {};
  tableLov = JSON.parse(JSON.stringify(TableLovConfig));
  columnLov = JSON.parse(JSON.stringify(ColumnLovConfig))
  constructor(public _shared: ValueSetSharedService,
    private _inputService: TnzInputService,) { }

  ngOnInit(): void {
  }
  getIfEditable(key) {
    return !this.disabled[key] && this._shared.getHeaderEditable(key, this._shared.valueSet);
  }
  valueChangedFromTable(event){

	//this._inputService.updateInput(this._shared.getHeaderAttrPath('facility'),'');
	this. changedtable=  event.value.value;  
	let tableParam = `?columnsFromTable=${event.value.value}`;
	let columnUrl = 'lovs/columns';
	let newUrl = columnUrl + tableParam
	this.columnLov = {...this.columnLov, url: newUrl};
  this._inputService.updateInput(this._shared.getHeaderAttrPath('returnFieldName'),'');
		
   }
}

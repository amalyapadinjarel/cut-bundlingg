import { Component, OnInit, ViewChild } from '@angular/core';
import { SmdDataTable } from 'app/shared/component';
import { UserService } from 'app/shared/services';
import { OperationSharedService } from '../_service/operation-shared.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { OperationService } from '../_service/operation.service';
import { SubSink } from 'subsink';
import { ParentOperationLovconfig } from '../models/lov-config';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { AlertUtilities } from 'app/shared/utils';

@Component({
  selector: 'operation-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  @ViewChild(SmdDataTable, { static: true }) dataTable: SmdDataTable;

  public listData: any;
  disabled: any = {};

  private refreshSub: Subscription;
  private refreshOp: Subscription;

  constructor(
    private service: UserService,
    public _shared: OperationSharedService,
    private router: Router,
    private _service: OperationService,
    private inputService: TnzInputService,
    private _alertUtils:AlertUtilities) { }


  ngOnInit(): void {
    this.refreshOp = this._shared.refreshOperationData.subscribe(change => {
      this.dataTable.refresh(this._shared.formData["operations"]);
    });

  }


  getOperationsLov(id) {
    let lov = JSON.parse(JSON.stringify(ParentOperationLovconfig));
    lov.url += id;
    return lov;
  }

  rowSelected(event) {
    // this._shared.id=0;
    // if(event.model.opId!="")    this._shared.id = event.model.opId;
    // let val = this.operationsLov.url.split("=")[1];
    // let newurl = this.operationsLov.url.replace(val, "");
    // console.log("newurl=",newurl)
    // this.operationsLov.url = newurl +this._shared.id;
    // console.log(this.operationsLov.url)
  }



  _onDataChange(dataChange: any) {
    if (dataChange.data && dataChange.data.operations) {
      this._shared.formData = dataChange.data;
      this._shared.operations = JSON.parse(JSON.stringify(dataChange.data));
      this._shared.setListData(dataChange.data);
      this._shared.listConfig.offset = dataChange.offset;
      this._shared.listConfig.limit = dataChange.limit;
      this._shared.columnFilterValues = dataChange.columnFilterValues;
    }
  }

  _onPageChange(pageChangeEvent: any) {
    this._shared.selectedPage = pageChangeEvent.page;
  }


  onRowSelected() {

  }

  //length check and duplicate check and upper case conversion
  validateOpcode(event, index) {

    let val = event.value;
    if (val != null && val != "" && val != " ")
      val = val.toUpperCase();
    else {
      this.inputService.setError(event.path, 'Operation code cannot be blank!');
    }
    val = val.trim();
    this.inputService.updateInput(event.path, val);


    if (val.length > 30) {
      this.inputService.setError(event.path, 'Length exceeded 30 characters!');
    }
    else {
      //check for duplicates
      this._shared.formData.operations.forEach((line, i) => {
        let value = this.inputService.getInputValue(this._shared.getOperationsPath(i, 'shortCode'));
      
        if (i != index && value!=null) {
          value=value.trim();
          if (value.toUpperCase() == val) {
            this.inputService.setError(this._shared.getOperationsPath(index, 'shortCode'), 'Duplicate operation code -'+ value+"!");
          }
          else {
            // if (this.inputService.getStatus(this._shared.getOperationsPath(i, 'shortCode')) == 'error') {
            // 	this.inputService.resetError(this._shared.getOperationsPath(i, 'shortCode'));

            // }
          }
        }
      })

      //duplicate check from db
      this._service.duplicateOperationCodeCheck(val).then(data => {
        if (data) {
          this.inputService.setError(event.path, 'Duplicate operation code -' + val + ' !');
        }
      }).catch(err => {
        console.log("Exception caught on duplicate check", err)
      });

    }


  }

   validateData(event, index, attr) {
    const attrValue = event.value.trim();
    const upperValue = attrValue.toUpperCase();
    const descriptionLen = 60;
    const codeLen = 30;
    const opNameLen = 100;


    if (attrValue.length > codeLen && (attr == 'shortCode')) {
      this.inputService.setError(this._shared.getOperationsPath(index, attr), 'Length exceeded 30 characters!');
    }

    if (attrValue.length > opNameLen && (attr == 'opName')) {
      this.inputService.setError(this._shared.getOperationsPath(index, attr), 'Length exceeded 100 characters!');
    }
    if (attrValue.length > descriptionLen && attr == 'description') {
      this.inputService.setError(this._shared.getOperationsPath(index, attr), 'Length exceeded 60 characters!');
    }
    if (attrValue == '' || attrValue == ' ' || attrValue == null) {
      switch (attr) {
        case 'opName':
          this.inputService.setError(this._shared.getOperationsPath(index, attr), 'Operation name cannot be left blank!');
          break;
        case 'shortCode':
          this.inputService.setError(this._shared.getOperationsPath(index, attr), 'Operation code cannot be left blank!');
          break;
      }
    }
    if (attr == 'shortCode' && attrValue.length > 0) {
      this._service.duplicateOperationCodeCheck(upperValue).then(data => {
        if (data) {
          this.inputService.setError(event.path, 'Duplicate operation group code -' + upperValue + ' !');
        }
      }).catch(err => {
      });
    }
  }


}

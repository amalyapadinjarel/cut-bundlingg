import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { DocumentTypeSharedService } from '../../_service/document-type-shared.service';
import { DocumentTypeService } from '../../_service/document-type.service';
import { SubSink } from 'subsink';
import { MatDialog } from '@angular/material/dialog';

import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { TnzInputLOVComponent } from 'app/shared/tnz-input/input-lov/input-lov.component';
import { CopystatusLovConfig } from '../form.component';
import { CopyRolesLovConfig } from '../form.component';
import { AlertUtilities } from 'app/shared/utils';
import { Input } from '@angular/core';
import { UserAppService } from '../../_service/user.service';
import { UserSharedService } from '../../_service/user-shared.service';



@Component({
  selector: 'status-detail',
  templateUrl: './status-details.component.html',
  styleUrls: ['./status-details.component.scss']
})
export class StatusDetailsComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
 // @ViewChild(SmdDataTable) dataTable: SmdDataTable;
  public key = "StatusDetail";
  newline

  @Input() noDataDisplayMessage: string = "No data to display";
	@Input() noDataDisplayIcon: string = "sentiment_very_dissatisfied";
  constructor(private _service: UserAppService,
    public _shared: UserSharedService,
    public inputService: TnzInputService,
    private dialog: MatDialog,
    private alertUtils: AlertUtilities) { }


  ngOnInit(): void {
    this.subs.sink = this._shared.refreshData.subscribe(change => {
     
      this._service.setStatusData();
      console.log("length",this._shared.statusList)
   
  });


  }


  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }


  valueChanged(event, i, field) {

    event.stopPropagation()
    let flag = true
    this._shared.saveIndex.forEach(element => {
      if (element == i)
        flag = false
    });
    if (flag) (this._shared.saveIndex.push(i))

  }
  RolevalueChanged(event, index, i) {

    let flag = true
    let flagT = true
    let RoleIndex = { "StatusIndex": index, "RoleIndex": i }
    this._shared.saveIndex.forEach(element => {
      if (element == index)
      flagT = false
    });
    if (flagT) (this._shared.saveIndex.push(index))

    this._shared.saveRoleIndex.forEach(element => {

      if (JSON.stringify(element) == JSON.stringify(RoleIndex))
        flag = false
    });
    if (flag) (this._shared.saveRoleIndex.push(RoleIndex))



  }


  preventOpen(event) {
    event.stopPropagation()

  }
  addStatus() {
    let lovConfig: any = {};
    let AddedStatusArray = [];
    let unAddedStatusArray = [];
    let flag = false;
    lovConfig = JSON.parse(JSON.stringify(CopystatusLovConfig));
    let ExistStatusList = this._shared.statusList;
    const dialogRef = this.dialog.open(TnzInputLOVComponent);
    dialogRef.componentInstance.lovConfig = lovConfig;
    dialogRef.afterClosed().subscribe(StatusArray => {
      if (StatusArray && StatusArray.length) {
        StatusArray.forEach(res => {
          if (ExistStatusList && ExistStatusList.length) {
            ExistStatusList.forEach(ex => {
              if (res.value == ex.docStatus.value) {
                flag = true;
              }
            });
          }
          if (flag == true) {
            unAddedStatusArray.push(res)
          }
          else {
            AddedStatusArray.push(res)
            this.addNewLine(res)
          }
          flag = false;
        });

        if (unAddedStatusArray.length) {
          this.alertUtils.showAlerts(unAddedStatusArray.length + " line(s) are not copied as they already exist.")
        }

      }
    })

  }

  addNewLine(res) {
    this.newline = this._shared.getLineModel(this.key)
    let attributes = this._shared.StatusDetailAttributes;
    let IndexNo
    if (this._shared.statusList.length)
      IndexNo = this._shared.statusList.length
    else IndexNo = 0 
    attributes.forEach(attr => {
      if (attr == 'docTypeId')
        this.newline[attr] = this._shared.id;

      if (attr == 'docStatus')
        this.newline[attr] = res;

      if (attr == 'docTypeId')
        this.newline[attr] = this._shared.id;
      if (attr == 'roledocStatusAssignmentId')
        this.newline[attr] = 0;

      if (attr == 'isEditAllowed' || attr == 'isRevisionAllowed')
        this.newline[attr] = false;

      if (attr == 'active')
        this.newline[attr] = true;
    });

    this._shared.statusList.push(this.newline)

    this._shared.saveIndex.push(IndexNo)

  }

  
  deleteStatusLine(ind) {
 
   let removeIndex=this._shared.statusList.length-1
   
    this._shared.statusList.splice(ind, 1);

this._shared.saveIndex.forEach((element ,index)=> {
  if (element == removeIndex)
  this._shared.saveIndex.splice(index, 1);
 
})
  
    if(this._shared.saveIndex.length==0)  this._shared.removedAll=true
   
  }

  addRole(index) {
    let lovConfig: any = {};
    let AddedRolesArray = [];
    let unAddedRolesArray = [];
    let ExistRoleList = [];
    let flag = false;
    let docStatus = this._shared.statusList[index].docStatus
    lovConfig = JSON.parse(JSON.stringify(CopyRolesLovConfig(this._shared.id)));
    if (this._shared.statusList[index].roles) {
      this._shared.statusList[index].roles.forEach(row => {
        if (row.role)

        ExistRoleList.push(row)



      });
    }
  

    
    const dialogRef = this.dialog.open(TnzInputLOVComponent);
    dialogRef.componentInstance.lovConfig = lovConfig;
    dialogRef.afterClosed().subscribe(RolesArray => {
      if (RolesArray && RolesArray.length) {
        RolesArray.forEach(res => {
          if (ExistRoleList && ExistRoleList.length) {
            ExistRoleList.forEach(ex => {

              if (res.value == ex.role.value) {
                flag = true;
              }
            });
          }
          if (flag == true) {
            unAddedRolesArray.push(res)
          }
          else {
            AddedRolesArray.push(res)
            this.addNewRoleLine(res, index, docStatus)
          }
          flag = false;
        });

        if (unAddedRolesArray.length) {
          this.alertUtils.showAlerts(unAddedRolesArray.length + " line(s) are not copied as they already exist.")
        }

      }
    })

  }
  addNewRoleLine(res, index, docStatus) {
    let newLine = this._shared.getLineModel(this.key)
    let attributes = this._shared.StatusDetailAttributes;
    let flag = true
    let IndexNo
    if (this._shared.statusList[index].roles.length)
      IndexNo = this._shared.statusList[index].roles.length
    else IndexNo = 0

    attributes.forEach(attr => {
  
      if (attr == 'docTypeId')
        newLine[attr] = this._shared.id;

      if (attr == 'docStatus')
        newLine[attr] = docStatus;
      if (attr == 'role')
        newLine[attr] = res;

      if (attr == 'roledocStatusAssignmentId')
        newLine[attr] = 0;

      if (attr == 'isEditAllowed' || attr == 'isRevisionAllowed')
        newLine[attr] = false;

      if (attr == 'active')
        newLine[attr] = true;
    });
    this._shared.statusList[index].roles.push(newLine)
    this._shared.saveIndex.forEach(element => {
      if (element == index)
        flag = false
    });
    if (flag) (this._shared.saveIndex.push(index))
    

    let RoleIndex = { "StatusIndex": index, "RoleIndex": IndexNo }

    this._shared.saveRoleIndex.push(RoleIndex)
 


  }

  deleteRolesLine(index,i ){
    let removeIndex=this._shared.statusList[index].roles.length-1   
    let RemoveRoleIndex = { "StatusIndex": index, "RoleIndex": removeIndex }
    this._shared.statusList[index].roles.splice(i, 1);

    this._shared.saveRoleIndex.forEach((element,index )=> {

      if (JSON.stringify(element) == JSON.stringify(RemoveRoleIndex))
      this._shared.saveRoleIndex.splice(index, 1);
    });
   
    
  }

}

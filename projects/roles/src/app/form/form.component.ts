import { Component, OnInit, OnDestroy } from '@angular/core';
import { RolesSharedService } from '../_service/roles-shared.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router, NavigationEnd, ResolveEnd } from '@angular/router';
import { RolesService } from '../_service/roles.service';
import { MatDialog } from '@angular/material/dialog';
import { TnzInputLOVComponent } from 'app/shared/tnz-input/input-lov/input-lov.component';
import { CopyFromUsersLovConfig,  CopyFromOrgAccessLovConfig, CopyFromDivisionLovConfig, CopyFromTaskFlowLovConfig } from '../models/lov-config';
import { RoleUsers } from '../models/role-users';
import { AlertUtilities, DateUtilities } from 'app/shared/utils';
import { RolesOrgAccess } from '../models/roles-org-access';
import { date } from 'app/shared/directives/validators/date';
import { getLocaleDateTimeFormat, getLocaleDateFormat } from '@angular/common';
import { RolesTaskFlowAccess } from '../models/roles-taskflow-access';

@Component({
  selector: 'roles-form',
  templateUrl: './form.component.html',
  host: { 'class': 'form-view' }
})
export class FormComponent implements OnInit {

  hasNextRecord: boolean = false;
  hasPreviousRecord: boolean = false;
  public clicked = false;

  private routerSubs: Subscription;

  
  constructor(
    public _shared:RolesSharedService,
    private route:ActivatedRoute,
    private router:Router,
    private _service:RolesService,
    private dialog:MatDialog,
	private alertUtils:AlertUtilities,
	public dateUtils:DateUtilities
    ) { }

  //init method
  ngOnInit(): void {
    this.setRoles();
    this.routerSubs=this.router.events.subscribe(change=>{
      this.routerChanged(change);
    })
  }

//method to handle route changes (events)
  routerChanged(change) {
    if(change instanceof ResolveEnd){
      if(change.url.startsWith("/roles/list")){
        this.unsetRoles();
      }
    }
    if(change instanceof NavigationEnd){
      this.setRoles();
    }
  }

  //method to reset/unset shared variables
  unsetRoles() {
    this._shared.editMode=false;
    this._shared.id=0;
    this._shared.setFormData({});
  }

  //method to set shared variables
  setRoles() {
    if(this.router.url.endsWith("/create")){
      this._shared.editMode=true;
	  this._shared.id=0;
	  //this._shared.refreshData.next(true);

    }else{
      this._shared.id=Number(this.route.snapshot.params.roleId);
      if(this.router.url.endsWith("/edit")){
        this._shared.editMode=true;
      }else{
        this._shared.editMode=false;
        this._shared.refreshData.next(true);
      }
    }
	this._shared.setFormData({});
	this._shared.resetAllInput();
}

  //method to destroy subscription
  ngOnDestroy():void{
    if(this.routerSubs)
    this.routerSubs.unsubscribe();
  }

 
  copyFromUsers() {
		let lovConfig: any = {};
		lovConfig = JSON.parse(JSON.stringify(CopyFromUsersLovConfig));
		const dialogRef = this.dialog.open(TnzInputLOVComponent);
		dialogRef.componentInstance.lovConfig = lovConfig;
		dialogRef.afterClosed().subscribe(resArray => {
			let routingIds = [];
			let unAddedOrderLines = [];
			if (resArray && resArray.length) {
				resArray.forEach(res => {
					res = this.mapResToRoleUsers(res);
					let rolesLineIndex = this._shared.formData.roleUsers.findIndex(data => {
						return res.userId == data.userId
					})
					if (rolesLineIndex == -1) {
						this._shared.addLine('roleUsers', res,false);
										
					} else {
						unAddedOrderLines.push(res)
					}
				});
				//-------------------
				this._shared.refreshRoleUsersData.next(true);
				//-------------------
				if (unAddedOrderLines.length) {
					this.alertUtils.showAlerts(unAddedOrderLines.length + " line(s) are not copied as they already exist.")
				}
			}
		})
	}

	mapResToRoleUsers(res) {
		let model = new RoleUsers();
		model.roleUserAssignmentId="0"; 
		model.roleId = this._shared.id;
		model.userId = res.userId ? res.userId : "";
		model.userName = res.userName ? res.userName : "";
	    model.knownAs = res.knownAs ? res.knownAs : "";
		model.userAssignmentStartDate = DateUtilities.formatDate(new Date());
		model.userAssignmentEndDate="";
		model.active='Y';
		return model;
	}

	copyFromDivision(){
		let lovConfig: any = {};
		lovConfig = JSON.parse(JSON.stringify(CopyFromDivisionLovConfig));
		const dialogRef = this.dialog.open(TnzInputLOVComponent);
		dialogRef.componentInstance.lovConfig = lovConfig;
		dialogRef.afterClosed().subscribe(resArray => {
			let unAddedOrderLines = [];
			if (resArray && resArray.length) {
				resArray.forEach(res => {
					res = this.mapResToRolesOrgAccess(res);
					let orgAccessLineIndex = this._shared.formData.rolesOrgAccess.findIndex(data => {
						return res.divisionId == data.divisionId
					})
					if (orgAccessLineIndex == -1) {
						this._shared.addLine('rolesOrgAccess', res,false);
					} else {
						unAddedOrderLines.push(res)
					}
				});

				//------------------
				this._shared.refreshOrgAccessData.next(true);
				//------------------

				if (unAddedOrderLines.length) {
					this.alertUtils.showAlerts(unAddedOrderLines.length + " line(s) are not copied as they already exist.")
				}
			}
		})
	}
	
	mapResToRolesOrgAccess(res: any): any {
		let model = new RolesOrgAccess();
		model.orgAccessId=0;
		model.roleId = this._shared.id;
	 	model.userId = "0";
		model.division=res.divisionShortCode?res.divisionShortCode:"";
		model.divisionId=res.divisionId?res.divisionId:"";
		model.facility="";
		model.facilityId="0";
		model.access="Y";
		model.default="N";
		model.active="Y";
		return model;
	}

	copyFromTaskFlow(){
		let lovConfig: any = {};
		lovConfig = JSON.parse(JSON.stringify(CopyFromTaskFlowLovConfig));
		lovConfig.url += this._shared.id+"?applicationCode="+this._shared.selectedApplicationCode;
	//	console.log("url=",lovConfig.url)
		const dialogRef = this.dialog.open(TnzInputLOVComponent);
		dialogRef.componentInstance.lovConfig = lovConfig;
		dialogRef.afterClosed().subscribe(resArray => {
			let unAddedOrderLines = [];
			if (resArray && resArray.length) {
				resArray.forEach(res => {
					res = this.mapResToRolesTaskFlowAccess(res);
					let taskFlowAccessLineIndex = this._shared.formData.rolesTaskFlowAccess.findIndex(data => {
						return res.taskFlowId == data.taskFlowId
					})
					if (taskFlowAccessLineIndex == -1) {
						this._shared.addLine('rolesTaskFlowAccess', res,false);
					} else {
						unAddedOrderLines.push(res)
					}
				});

				//---add to refresh table-------------------
				this._shared.refreshTaskFlowAccessData.next(true);
				//----------------------------------
				if (unAddedOrderLines.length) {
					this.alertUtils.showAlerts(unAddedOrderLines.length + " line(s) are not copied as they already exist.")
				}
			}
		})
	}

	mapResToRolesTaskFlowAccess(res: any): any {
		let model = new RolesTaskFlowAccess();
		model.roleTaskFlowAssignmentId="0";
		model.roleId = this._shared.id;
	 	model.taskFlowId = res.taskFlowId?res.taskFlowId:"0";
		model.taskFlowName=res.taskFlowName?res.taskFlowName:"";
		model.description=res.description?res.description:"";
		model.isRead=res.isRead?res.isRead:"N";
		model.isEdit=res.isEdit?res.isEdit:"N";
		model.isCreate=res.isCreate?res.isCreate:"N";
		model.isDelete=res.isDelete?res.isDelete:"N";
		model.active="Y";
		return model;
	}
}

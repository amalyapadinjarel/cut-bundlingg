import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserSharedService } from '../_service/user-shared.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router, NavigationEnd, ResolveEnd } from '@angular/router';
import { UserAppService } from '../_service/user.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TnzInputLOVComponent } from 'app/shared/tnz-input/input-lov/input-lov.component';
import { CopyFromRolesLovConfig, CopyFromDivisionLovConfig } from '../models/lov-config';
import { UserRoles } from '../models/user-roles';
import { AlertUtilities, DateUtilities } from 'app/shared/utils';
import { UserOrgAccess } from '../models/user-org-access';
import { date } from 'app/shared/directives/validators/date';
import { getLocaleDateTimeFormat, getLocaleDateFormat } from '@angular/common';
import { HelpComponent } from './help/help';

@Component({
  selector: 'user-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  host: { 'class': 'form-view' }
})
export class FormComponent implements OnInit {

  hasNextRecord: boolean = false;
  hasPreviousRecord: boolean = false;
  public clicked = false;

  private routerSubs: Subscription;

  private matDialogRef: MatDialogRef<HelpComponent, any>;

  constructor(
    public _shared:UserSharedService,
    private route:ActivatedRoute,
    private router:Router,
    private _service:UserAppService,
    private dialog:MatDialog,
	private alertUtils:AlertUtilities,
	public dateUtils:DateUtilities
    ) { }

  //init method
  ngOnInit(): void {
    this.setUser();
    this.routerSubs=this.router.events.subscribe(change=>{
      this.routerChanged(change);
    })
  }

//method to handle route changes (events)
  routerChanged(change) {
    if(change instanceof ResolveEnd){
      if(change.url.startsWith("/user/list")){
        this.unsetUser();
      }
    }
    if(change instanceof NavigationEnd){
      this.setUser();
    }
  }

  //method to reset/unset shared variables
  unsetUser() {
    this._shared.editMode=false;
    this._shared.id=0;
    this._shared.setFormData({});
  }

  //method to set shared variables
  setUser() {
    if(this.router.url.endsWith("/create")){
      this._shared.editMode=true;
      this._shared.id=0;
    }else{
      this._shared.id=Number(this.route.snapshot.params.userId);
      if(this.router.url.endsWith("/edit")){
        this._shared.editMode=true;
      }else{
        this._shared.editMode=false;
        this._shared.refreshData.next(true);
      }
    }
	this._shared.setFormData({});
}

  //method to destroy subscription
  ngOnDestroy():void{
    if(this.routerSubs)
    this.routerSubs.unsubscribe();
  }

 
  copyFromRoles() {
		let lovConfig: any = {};
		lovConfig = JSON.parse(JSON.stringify(CopyFromRolesLovConfig));
		const dialogRef = this.dialog.open(TnzInputLOVComponent);
		dialogRef.componentInstance.lovConfig = lovConfig;
		dialogRef.afterClosed().subscribe(resArray => {
			let routingIds = [];
			let unAddedOrderLines = [];
			if (resArray && resArray.length) {
				resArray.forEach(res => {
					res = this.mapResToUserRoles(res);
					let rolesLineIndex = this._shared.formData.userRoles.findIndex(data => {
						return res.roleId == data.roleId
					})
					if (rolesLineIndex == -1) {
						this._shared.addLine('userRoles', res);
										
					} else {
						unAddedOrderLines.push(res)
					}
				});
				if (unAddedOrderLines.length) {
					this.alertUtils.showAlerts(unAddedOrderLines.length + " line(s) are not copied as they already exist.")
				}
			}
		})
	}

	mapResToUserRoles(res) {
		let model = new UserRoles();
		model.roleUserAssignmentId=0; 
		model.userId = this._shared.id;
		model.roleId = res.roleId ? res.roleId : "";
		model.roleShortCode = res.roleShortCode ? res.roleShortCode : "";
	    model.roleName = res.roleName ? res.roleName : "";
		model.roleStartDate = DateUtilities.formatDate(new Date());
		model.roleEndDate="";
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
					res = this.mapResToUserOrgAccess(res);
					let orgAccessLineIndex = this._shared.formData.userOrgAccess.findIndex(data => {
						return res.divisionId == data.divisionId
					})
					if (orgAccessLineIndex == -1) {
						this._shared.addLine('userOrgAccess', res);
					} else {
						unAddedOrderLines.push(res)
					}
				});
				if (unAddedOrderLines.length) {
					this.alertUtils.showAlerts(unAddedOrderLines.length + " line(s) are not copied as they already exist.")
				}
			}
		})
	}
	
	mapResToUserOrgAccess(res: any): any {
		let model = new UserOrgAccess();
		model.orgAccessId=0;
		model.userId = this._shared.id;
	 	model.roleId = "0";
		model.division=res.divisionShortCode?res.divisionShortCode:"";
		model.divisionId=res.divisionId?res.divisionId:"";
		model.facility="";
		model.facilityId="0";
		model.access="Y";
		model.default="N";
		model.active="Y";
		return model;
	}


	openHelp(){
		this.matDialogRef = this.dialog.open(HelpComponent);

	}

}

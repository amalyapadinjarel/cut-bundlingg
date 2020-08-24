import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { SubSink } from 'subsink';
import { MatDialog } from '@angular/material/dialog';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { TnzInputLOVComponent } from 'app/shared/tnz-input/input-lov/input-lov.component';
import { AlertUtilities } from 'app/shared/utils';
import { Input } from '@angular/core';
import { CopyFromDivisionLovConfig, CopyFromFacilityLovConfig } from '../../models/lov-config';
import { RolesSharedService } from '../../_service/roles-shared.service';
import { RolesService } from '../../_service/roles.service';
import { RolesOrgAccess } from '../../models/roles-org-access';

@Component({
  selector: 'org-access-expansion-panel',
  templateUrl: './org-access-expansion-panel.html',
  styleUrls: ['./org-access-expansion-panel.scss']
})
export class OrgAccessExpansionComponent implements OnInit, OnDestroy {

  disabled: any = {};

  private subs = new SubSink();
  public key = "rolesOrgAccess";
  newline

  @Input() noDataDisplayMessage: string = "No data to display";
  @Input() noDataDisplayIcon: string = "sentiment_very_dissatisfied";

  constructor(private _service: RolesService,
    public _shared: RolesSharedService,
    public inputService: TnzInputService,
    private dialog: MatDialog,
    private alertUtils: AlertUtilities) { }


  ngOnInit(): void {
    this.subs.sink = this._shared.refreshData.subscribe(change => {
      this._service.setDivisionData();
      console.log("length", this._shared.orgAccessList)
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

  FacilityValueChanged(event, index, i) {
    console.log("div index:", index);
    console.log("facility index:", i)
    let flag = true
    let flagT = true
    let FacilityIndex = { "DivisionIndex": index, "FacilityIndex": i }
    this._shared.saveIndex.forEach(element => {
      if (element == index)
        flagT = false
    });
    if (flagT) (this._shared.saveIndex.push(index))
    this._shared.saveFacilityIndex.forEach(element => {
      if (JSON.stringify(element) == JSON.stringify(FacilityIndex))
        flag = false
    });
    if (flag) (this._shared.saveFacilityIndex.push(FacilityIndex))
  }


  preventOpen(event) {
    event.stopPropagation()
  }

  addDivision() {
    let lovConfig: any = {};
    let AddedDivisionArray = [];
    let unAddedDivisionArray = [];
    let flag = false;
    lovConfig = JSON.parse(JSON.stringify(CopyFromDivisionLovConfig));
    let ExistorgAccessList = this._shared.orgAccessList;

    const dialogRef = this.dialog.open(TnzInputLOVComponent);
    dialogRef.componentInstance.lovConfig = lovConfig;
    dialogRef.afterClosed().subscribe(StatusArray => {
      if (StatusArray && StatusArray.length) {
        StatusArray.forEach(res => {
          if (ExistorgAccessList && ExistorgAccessList.length) {
            ExistorgAccessList.forEach(ex => {
              if (res.divisionId == ex.divisionId) {
                flag = true;
              }
            });
          }
          if (flag == true) {
            unAddedDivisionArray.push(res)
          }
          else {
            AddedDivisionArray.push(res)
            this.addNewLine(res)
          }
          flag = false;
        });

        if (unAddedDivisionArray.length)
          this.alertUtils.showAlerts(unAddedDivisionArray.length + " line(s) are not copied as they already exist.")
      }
    })

  }

  addNewLine(res) {
    this.newline = this._shared.getLineModel(this.key)
    let attributes = this._shared.rolesOrgAccessAttributes;
    let IndexNo
    if (this._shared.orgAccessList.length)
      IndexNo = this._shared.orgAccessList.length
    else IndexNo = 0
    attributes.forEach(attr => {
      console.log("attr:", attr);
      console.log("Res:", res)
      if (attr == 'roleId')
        this.newline[attr] = this._shared.id;

      if (attr == 'division')
        this.newline[attr] = res.divisionShortCode;

      if (attr == 'divisionId')
        this.newline[attr] = res.divisionId;

      if (attr == this._shared.rolesOrgAccessPrimaryKey)
        this.newline[attr] = 0;

      if (attr == 'facility')
        this.newline[attr] = '';

      if (attr == 'facilityId')
        this.newline[attr] = 0;

      if (attr == 'active')
        this.newline[attr] = true;

      if (attr == 'default')
        this.newline[attr] = true;
    });

    this._shared.orgAccessList.push(this.newline)
    this._shared.saveIndex.push(IndexNo)
  }


  deleteDivisionLine(ind) {
    let removeIndex = this._shared.orgAccessList.length - 1
    this._shared.orgAccessList.splice(ind, 1);
    this._shared.saveIndex.forEach((element, index) => {
      if (element == removeIndex)
        this._shared.saveIndex.splice(index, 1);
    })
    if (this._shared.saveIndex.length == 0) this._shared.removedAll = true
  }

  addFacility(index) {
    let lovConfig: any = {};
    let AddedFacilityArray = [];
    let unAddedFacilityArray = [];
    let ExistFacilityList = [];
    let flag = false;
    console.log("org access [index]", this._shared.orgAccessList[index])
    // let docStatus = this._shared.orgAccessList[index].docStatus
    lovConfig = JSON.parse(JSON.stringify(CopyFromFacilityLovConfig));
    lovConfig.url +=this._shared.orgAccessList[index].divisionId;

    if (this._shared.orgAccessList[index].facility) {
      console.log("i am here",this._shared.orgAccessList[index].facility)

      this._shared.orgAccessList[index].facility.forEach(element => {
        console.log("facility :", element)
        if (element.facilityId!=0)
          ExistFacilityList.push(element)
      })
  }

    const dialogRef = this.dialog.open(TnzInputLOVComponent);
    dialogRef.componentInstance.lovConfig = lovConfig;
    dialogRef.afterClosed().subscribe(FacilityArray => {
      if (FacilityArray && FacilityArray.length) {
        FacilityArray.forEach(res => {

          console.log("ExistFacilityList:",ExistFacilityList)
          if (ExistFacilityList && ExistFacilityList.length) {
            console.log("value in exist facility")
            ExistFacilityList.forEach(ex => {

              console.log("exist facility:",ex);
              console.log("facility:",res);

              if (res.facilityId == ex.facilityId) {
                flag = true;
              }
            });
          }
          if (flag == true) {
            unAddedFacilityArray.push(res)
          }
          else {
            AddedFacilityArray.push(res)
            this.addNewFacilityLine(res, index)
          }
          flag = false;
        });

        if (unAddedFacilityArray.length) {
          this.alertUtils.showAlerts(unAddedFacilityArray.length + " line(s) are not copied as they already exist.")
        }

      }
    })

  }

  addNewFacilityLine(res, index) {
    let newLine = this._shared.getLineModel(this.key)
    let attributes = this._shared.rolesOrgAccessAttributes;
    let flag = true
    console.log("orgaccess list in faciliy lov:",this._shared.orgAccessList[index]);
    let IndexNo
    if (this._shared.orgAccessList[index].facility.length)
      IndexNo = this._shared.orgAccessList[index].facility.length
    else IndexNo = 0

    attributes.forEach(attr => {
      console.log("res:", res)
      console.log("attr:", attr)
      if (attr == 'roleId')
        newLine[attr] = this._shared.id;

      // if (attr == 'facility')
      // newLine[attr] = res;
      // if (attr == 'division')
      // newLine[attr] = res.divisionShortCode;

      if (attr == 'facility')
        newLine[attr] = res.facilityShortCode;

      if (attr == 'facilityId')
        newLine[attr] = res.facilityId;

      if (attr == this._shared.rolesOrgAccessPrimaryKey)
        newLine[attr] = 0;

      if (attr == 'active')
        newLine[attr] = true;
    });
    this._shared.orgAccessList[index].facility.push(newLine)
    this._shared.saveIndex.forEach(element => {
      if (element == index)
        flag = false
    });
    if (flag) (this._shared.saveIndex.push(index))

    let FacilityIndex = { "DivisionIndex": index, "FacilityIndex": IndexNo }
    this._shared.saveFacilityIndex.push(FacilityIndex)
  }

  deleteFacilityLine(index, i) {
    let removeIndex = this._shared.orgAccessList[index].facility.length - 1
    let RemoveFacilityIndex = { "DivisionIndex": index, "FacilityIndex": removeIndex }
    this._shared.orgAccessList[index].facility.splice(i, 1);

    this._shared.saveFacilityIndex.forEach((element, index) => {

      if (JSON.stringify(element) == JSON.stringify(RemoveFacilityIndex))
        this._shared.saveFacilityIndex.splice(index, 1);
    });


  }

  copyFromDivision() {
    let lovConfig: any = {};
    lovConfig = JSON.parse(JSON.stringify(CopyFromDivisionLovConfig));
    const dialogRef = this.dialog.open(TnzInputLOVComponent);
    dialogRef.componentInstance.lovConfig = lovConfig;
    dialogRef.afterClosed().subscribe(resArray => {
      let unAddedOrderLines = [];
      if (resArray && resArray.length) {
        resArray.forEach(res => {
          res = this.mapResDivisionToRolesOrgAccess(res);
          let orgAccessLineIndex = this._shared.formData.rolesOrgAccess.findIndex(data => {
            return res.divisionId == data.divisionId
          })
          if (orgAccessLineIndex == -1) {
            this._shared.addLine('rolesOrgAccess', res, false);
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

  mapResDivisionToRolesOrgAccess(res: any): any {
    let model = new RolesOrgAccess();
    model.orgAccessId = 0;
    model.roleId = this._shared.id;
    model.userId = "0";
    model.division = res.divisionShortCode ? res.divisionShortCode : "";
    model.divisionId = res.divisionId ? res.divisionId : "";
    model.facility = "";
    model.facilityId = "0";
    model.access = "Y";
    model.default = "N";
    model.active = "Y";
    return model;
  }

  getIfEditable(key) {
    return !this.disabled[key] && this._shared.getHeaderEditable(key, this._shared.id);

  }

}

import { Component, OnInit , OnDestroy} from '@angular/core';
import { FacilityService } from '../../../services/facility.service';
import { FacilitySharedService } from '../../../services/facility-shared.service';
import { Router, ActivatedRoute,NavigationEnd, ResolveEnd } from '@angular/router';
import { AlertUtilities } from 'app/shared/utils';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import {SubSink} from 'subsink';
import { Facility } from '../../../models/facility.model';
import { CompanyLovConfig, FacilityGroupLovConfig } from '../../../models/lov-config';
import { DivisionLovConfig } from '../../../models/lov-config';

@Component({
  selector: 'app-facility-card',
  templateUrl: './facility-card.component.html',
  styleUrls: ['./facility-card.component.scss'],
  host: { 'class': 'header-card' }
})
export class FacilityCardComponent implements OnInit, OnDestroy {
  private subs = new SubSink()
  disabled: any = {};
  private loading: boolean;
  companyLov = JSON.parse(JSON.stringify(CompanyLovConfig));
  divisionLov = JSON.parse(JSON.stringify(DivisionLovConfig));
  facilityGroupLov = JSON.parse(JSON.stringify(FacilityGroupLovConfig));

  constructor(
    private _service: FacilityService,
    public _shared: FacilitySharedService,
    private _inputService: TnzInputService,
    private router: Router,
    private route: ActivatedRoute,
    private alertUtils: AlertUtilities,
    ){}

    ngOnInit(): void {
      this.setFacility();
      this.subs.sink = this.router.events.subscribe(change => {
          this.routerChanged(change);
      })
      this.subs.sink = this._shared.refreshData.subscribe(change => {
          this.loadData();
      })
    }
    setFacility() {
      if (this.router.url.endsWith('/create')) {
          this._shared.id = 0;
          this._shared.editMode = true;
          this._inputService.updateInput(this._shared.getHeaderAttrPath('active'),'Y');
      } else {
        this._shared.id = Number(this.route.snapshot.params.facilityId);
          if (this.router.url.endsWith('/edit')) {
              this._shared.editMode = true;
          } else {
              this._shared.editMode = false;
              this._shared.refreshData.next(true);
          }
          
      }
      this._shared.setFormData({});
     
  }
  
  routerChanged(change) {
    if (change instanceof ResolveEnd) {
        if (change.url.startsWith('/facility/list')) {
            this.unsetFacility();
        }
    }
    if (change instanceof NavigationEnd) {
        this.setFacility();
    }
}
  getIfEditable(key) {
    return !this.disabled[key] && this._shared.getHeaderEditable(key, this._shared.facility);
  }
  private loadData() {
    this.setLoading(true);
    this._service.fetchFormData(this._shared.id).then((data: Facility) => {
        this._shared.setFormHeader(data);
        this._shared.setAddress(data.getAddress);
        this.setLoading(false);
        
    }, err => {
        this.setLoading(false);
        if (err) {
            this.alertUtils.showAlerts(err, true)
        }
    });
}
unsetFacility() {
  this._shared.editMode = false;
  this._shared.id = 0;
  this._shared.setFormData({});
}
setLoading(flag: boolean) {
  this.loading = flag;
  this._shared.headerLoading = flag;
  this._shared.loading = flag;
  this._shared.addressLoading = flag;
}
ngOnDestroy(): void {
  this.subs.unsubscribe();
  this._shared.formData={};
}
valueChangedFromShortCode(event){
  this._service.duplicateFacilityCheck(event.value).then(data => {
    if (data) {
      this._inputService.setError(this._shared.getHeaderAttrPath('shortCode'), 'Duplicate facility -' + event.value + ' !');
    }
  });
}
valueChangedFromUI(event) {

  let tmp = event.value.toUpperCase();
  this._shared.formData.header.facility = tmp;

  if (tmp.length > 60) {
    this._inputService.setError(this._shared.getHeaderAttrPath('facility'), 'Length exceeded 60 characters!');
  }
  else {
    //check for duplicates
    this._service.duplicateFacilityCheck(event.value).then(data => {
      if (data) {
        this._inputService.setError(this._shared.getHeaderAttrPath('facility'), 'Duplicate facility -' + event.value + ' !');
      }
    });
  }
}
setCompanyLovValue(event)
{
  if(event.key = 'company')
  this._shared.formData.header.company = event.value;
}
}

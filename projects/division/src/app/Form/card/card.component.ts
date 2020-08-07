import { Component, OnInit, OnDestroy } from '@angular/core';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import {ActivatedRoute, NavigationEnd, ResolveEnd, Router} from '@angular/router';
import {SubSink} from 'subsink';
import { AlertUtilities } from 'app/shared/utils';
import { DivisionService } from '../../services/division.service';
import { DivisionSharedService } from '../../services/division-shared.service';
import { CompanyLovConfig } from '../../models/lov-config';
import { Division } from '../../models/division.model';

@Component({
  selector: 'card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  host: { 'class': 'general-card' }
})
export class CardComponent implements OnInit , OnDestroy{
  private subs = new SubSink()
  disabled: any = {};
  private loading: boolean;
  companyLov = JSON.parse(JSON.stringify(CompanyLovConfig));

  constructor(
    private _service: DivisionService,
    public _shared: DivisionSharedService,
    private _inputService: TnzInputService,
    private router: Router,
    private route: ActivatedRoute,
    private alertUtils: AlertUtilities,
    ) {

     }
 
     ngOnInit(): void {
      this.setDivision();
      this.subs.sink = this.router.events.subscribe(change => {
          this.routerChanged(change);
      })
      this.subs.sink = this._shared.refreshData.subscribe(change => {
          this.loadData();
      })
    }
    setDivision() {
      if (this.router.url.endsWith('/create')) {
          this._shared.id = 0;
          this._shared.editMode = true;
          this._inputService.updateInput(this._shared.getHeaderAttrPath('active'),'Y');
      } else {
        this._shared.id = Number(this.route.snapshot.params.divisionId);
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
        if (change.url.startsWith('/division/list')) {
            this.unsetDivision();
        }
    }
    if (change instanceof NavigationEnd) {
        this.setDivision();
    }
}

unsetDivision() {
  this._shared.editMode = false;
  this._shared.id = 0;
  this._shared.setFormData({});
}

	valueChangedFromUI(event) {
  
     let tmp = event.value.toUpperCase();
     
     this._shared.formData.header.division = tmp;
      
      if (tmp.length > 30) {
        this._inputService.setError(this._shared.getHeaderAttrPath('shortCode'), 'Length exceeded 30 characters!');
      }
      
    }
    valueChangedFromDivision(event) {
  
    //  let tmp = event.value.toUpperCase();

     
    //  this._shared.formData.header.division = tmp;
      
    //   if (tmp.length > 30) {
    //     this._inputService.setError(this._shared.getHeaderAttrPath('divisionName'), 'Length exceeded 30 characters!');
    //   }
      
    }
    getIfEditable(key) {
      return !this.disabled[key] && this._shared.getHeaderEditable(key, this._shared.division);
    }
    
    private loadData() {
      this.setLoading(true);
      this._service.fetchFormData(this._shared.id).then((data: Division) => {
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
  // valueChangedFromShortCode(event){
  //   this._service.duplicateLookupTypeCheck(event.value).then(data => {
  //     if (data) {
  //       this._inputService.setError(this._shared.getHeaderAttrPath('shortCode'), 'Duplicate division -' + event.value + ' !');
  //     }
  //   });
  // }
  
}
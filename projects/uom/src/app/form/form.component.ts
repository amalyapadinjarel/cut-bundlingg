import { Component, OnInit, OnDestroy } from '@angular/core';
import { SubSink } from 'subsink';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { ActivatedRoute, Router, ResolveEnd, NavigationEnd } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AlertUtilities, DateUtilities } from 'app/shared/utils';
import { UomSharedService } from '../service/uom-shared.service';
import { UomService } from '../service/uom.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  host: { 'class': 'form-view' }
})
export class FormComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  private loading: boolean;
  constructor(   private _inputService: TnzInputService,
    private route: ActivatedRoute,
    private router: Router,
  private dialog: MatDialog,
  private alertUtils: AlertUtilities,
  public dateUtils:DateUtilities,
  public _shared: UomSharedService,
  public _service: UomService) { }

  ngOnInit(): void {
    this.setUom();
    this.subs.sink = this.router.events.subscribe(change => {
        this.uomChanged(change);		
      })
  
      this.subs.sink =this._shared.refreshData.subscribe(change => {
              this.loadData();
             if(this._shared.id==0)
			          this._inputService.updateInput(this._shared.getHeaderAttrPath('active'),'Y');
          })

  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
  
  setUom() {
    if (this.router.url.endsWith('/create')) {
      this._shared.id = 0;
      this._shared.editMode = true;
    }
    else {
   
      this._shared.id = this.route.snapshot.params.categoryId;
      if (this.router.url.endsWith('/edit')) {
        this._shared.editMode = true;
      }
      else {
        // this._shared.initLocalCache();
        this._shared.editMode = false;
        this._shared.refreshData.next(true);
      }
  
    }

    this._shared.setFormData({});
    // this._shared.resetAll();

  }
  uomChanged(change) {
    if (change instanceof ResolveEnd) {
      if (change.url.startsWith('/uom/list')) {
        this.unsetUom();
      }
    }
    if (change instanceof NavigationEnd) {
      this.setUom();
    }
  }
  unsetUom() {
    this._shared.editMode = false;
    this._shared.id = 0;
    this._shared.setFormData({});
    // this._inputService.resetInputService(this._shared.appKey)
  }

  loadData() {
  this.setLoading(true);
  this._service.fetchFormData(this._shared.id).then((data: any) => {
    this._shared.setFormHeader(data);
    this.setLoading(false);
  }, err => {
    this._shared.setFormHeader({});

    this.setLoading(false);
    if (err)
      this.alertUtils.showAlerts(err, true)
  });

}

setLoading(flag: boolean) {
  this.loading = flag;
  this._shared.headerLoading = flag;
  this._shared.loading = flag;
  this._shared. UomdetailLoading = flag
  this._shared.ConversiondetailLoading = flag
}
  

}

import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { LookupSharedService } from './_service/lookup-shared.service';
import { LookupService } from './_service/lookup.service';
import { AlertUtilities } from 'app/shared/utils';
import { NavigationService, UserService, EventService, DocumentService } from 'app/shared/services';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

@Component({
  selector: 'app-lookup',
  templateUrl: './lookup.component.html',
  styleUrls: ['./lookup.component.scss']
})
export class LookupComponent {
  title = 'Lookup';
  reportData: any = {};

  @ViewChild("reportsBtn") reportsBtn: ElementRef;

  constructor(
    private router: Router,
    private location: Location,
    public _shared: LookupSharedService,
    public _service: LookupService,
    private alertutils: AlertUtilities,
    private navService: NavigationService,
    private userService: UserService,
    private docService: DocumentService
  ) {
    this._shared.init();
  }

  ngOnInit() {
   
  }

  ngOnDestroy() {
    this._shared.clear();
  }

  newLookup() {
    this.docService.checkAppPermission(this._shared.taskFlowName, 'create')
      .then(() => {
        

        if (this.router.routerState.snapshot.url == '/lookup/create') {
          this.location.go('/lookup/create');
          this._shared.lookupType='--';
          this._service.inputService.resetInputCache(this._shared.appPath);
          this._shared.initLocalCache();
          this._shared.editMode = true;
          this._shared.refreshData.next(true);

        }
        else {
          this.router.navigateByUrl('/lookup/create').then(done => {
            this._shared.editMode = true;
            this._shared.initLocalCache();


          }).catch((err) => { console.log('Caught Exception on create!', err) })
        }
      }).catch(err => {
        this.alertutils.showAlerts(err);
      })
  }

  editLookup() {
    this.docService.checkAppPermission(this._shared.taskFlowName, 'edit')
      .then(data => {
        this.location.go('lookup/' + this._shared.lookupType + '/edit');
        this._shared.editMode = true;
        this._shared.initLocalCache();
        this._shared.refreshData.next(true);

      })
      .catch(err => {
        this.alertutils.showAlerts(err)
      })
  }

  cancelEdit() {
    if (this._shared.lookupType!="--") {
      this.location.go('/lookup/' + this._shared.lookupType);
      this._shared.editMode = false;
      this._shared.initLocalCache();
      this._shared.resetLines();
     // this._shared.formData.header.lookupType = "--";

    }
    else {
      this.router.navigateByUrl('/lookup/list').then(done => {
        this._shared.editMode = false;
        this._shared.initLocalCache();
      });
    }
  }

 
  save(exit=false) {
    this._service.save(exit).then((flag) => {
      if (flag && exit) {
       // this._service.cancelEdit();
      // this._shared.formData.header.lookupType = "--";

        this.cancelEdit();

      }
    })
  }



}

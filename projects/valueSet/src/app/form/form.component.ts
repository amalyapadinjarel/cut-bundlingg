import { Component, OnInit, OnDestroy } from '@angular/core';
import { SubSink } from 'subsink';
import { ValueSetSharedService } from '../services/valueSet-shared.service';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { ActivatedRoute, Router, ResolveEnd, NavigationEnd } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AlertUtilities, DateUtilities } from 'app/shared/utils';
import { ValueSetService } from '../services/valueSet.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  host: { 'class': 'form-view' }
})
export class FormComponent implements OnInit, OnDestroy {

   private subs = new SubSink();
  // public clicked = false;
   private loading: boolean;
 
   constructor(
    private _service:ValueSetService,
     public _shared: ValueSetSharedService,
     private _inputService: TnzInputService,
     private route: ActivatedRoute,
     private router: Router,
   private dialog: MatDialog,
   private alertUtils: AlertUtilities,
   public dateUtils:DateUtilities
   
     ) {  
 
     }
 
   ngOnInit(){
     this.setValueSet();
   this.subs.sink = this.router.events.subscribe(change => {
       this.routerChanged(change);		
     })
 
     this.subs.sink =this._shared.refreshData.subscribe(change => {
             this.loadData();
         })
       
   }
   ngOnDestroy(): void {
     this.subs.unsubscribe();
   }
 
 
   setValueSet() {
     if (this.router.url.endsWith('/create')) {
       this._shared.id = 0;
       this._shared.editMode = true;
      //  this._inputService.updateInput(this._shared.getHeaderAttrPath('active'),'Y');
      // this._inputService.updateInput(this._shared.getHeaderAttrPath('validationType'),'Q');
      this._shared.validationType='N';
     }
     else {
    
       this._shared.id = this.route.snapshot.params.setId;
       console.log('id-------'+this.route.snapshot.params.setId);
 
       if (this.router.url.endsWith('/edit')) {
         this._shared.editMode = true;
         this._shared.validationType='N';
       }
       else {
         this._shared.editMode = false;
        //this._shared.initLocalCache();

         this._shared.refreshData.next(true);
       }
       //this._shared.id = this.route.snapshot.params.docTypeId;
   
     }
     
     
     this._shared.setFormData({});
     this._shared.resetAll();
    //  this._inputService.resetInputService(this._shared.appKey);
   }
   routerChanged(change) {
     if (change instanceof ResolveEnd) {
       if (change.url.startsWith('/valueSet/list')) {
         this.unsetValueSet();
       }
     }
     if (change instanceof NavigationEnd) {
       this.setValueSet();
     }
   }
   unsetValueSet() {
     this._shared.editMode = false;
     this._shared.id = 0;
     this._shared.setFormData({});
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
   this._shared. validDetailsLoading = flag
  //  this._shared.StatusDetailLoading = flag
 }
   
   
   print() {
     console.log((this._shared.formData));
   }
 
   /*deleteLines(key:
     string){
       {
         this._service.deleteLines(key);
       }
   }*/
 
 ///}

}

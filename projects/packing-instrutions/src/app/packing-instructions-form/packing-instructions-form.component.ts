import { Component, OnInit } from '@angular/core';
import { PackingInstructionsSharedService } from '../services/packing-instructions-shared.service';
import { PackingInstructionsService } from '../services/packing-instructions.service';
import { Subscription } from 'rxjs';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { ActivatedRoute, Router, ResolveEnd, NavigationEnd } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AlertUtilities, DateUtilities } from 'app/shared/utils';
import { AddPacksComponent } from './packs/add-packs/add-packs.component';
import { ConfirmPopupComponent } from 'app/shared/component';
import { PushMessageService } from 'app/shared/websocket/push-message.service';

@Component({
  selector: 'app-packing-instructions-form',
  templateUrl: './packing-instructions-form.component.html',
  host: { 'class': 'form-view' }
})
export class PackingInstructionsFormComponent implements OnInit {

  private routerSubs: Subscription;
  hasNextRecord: boolean = false;
	hasPreviousRecord: boolean = false;

  constructor(public _shared: PackingInstructionsSharedService,
		private _service: PackingInstructionsService,
		private _inputService: TnzInputService,
		private route: ActivatedRoute,
		private router: Router,
		private dialog: MatDialog,
    private alertUtils: AlertUtilities,
    public dateUtils: DateUtilities) { }

    ngOnInit() {
      this.setPackingInstructions();
      this.routerSubs = this.router.events.subscribe(change => {
        this.routerChanged(change);
      });
    }
  
    ngOnDestroy(): void {
      if (this.routerSubs)
        this.routerSubs.unsubscribe();
    }
  
    routerChanged(change) {
      if (change instanceof ResolveEnd) {
        if (change.url.startsWith('/packing-instructions/list')) {
          this.unsetPackingInstructions();
        }
      }
      if (change instanceof NavigationEnd) {
        this.setPackingInstructions();
      }
    }
  
    unsetPackingInstructions() {
      this._shared.editMode = false;
      this._shared.id = 0;
      this._shared.poId = 0;
      this._shared.orderId = 0;
      this._shared.parentProductId = 0;
      this._shared.setFormData({});
    }

    setPackingInstructions() {
      if (this.router.url.endsWith('/edit')) {
        this._shared.editMode = true;
      }
      else {
        this._shared.editMode = false;
        this._shared.refreshData.next(true);
      }
      this._shared.poId = this.route.snapshot.params.poId;
      this._shared.orderId = this.route.snapshot.params.orderId;
      this._shared.parentProductId = this.route.snapshot.params.parentProductId;
      this._shared.setFormData({});
    }

    deleteLine(key) {
      if(!this._shared.isCartonGenerated){
        this._service.deleteLines(key);
      }
      else{
        this.alertUtils.showAlerts("Carton already generated");
      }
    }

    addLine(key, model = null) {
      this._shared.findMaxSequence();
      if(!this._shared.isCartonGenerated){
        let dialogRef = this.dialog.open(AddPacksComponent);
        if(key == 'packDetailsSolid'){
          dialogRef.componentInstance.addType = 0;
        }
        else if(key == 'packDetailsRatio'){
          dialogRef.componentInstance.addType = 1;
        }
        dialogRef.afterClosed().subscribe(data => {
            if (data) {
              if(key == 'packDetailsSolid'){
                this._shared.grpNewLines(data,'packsDetails');
                this._shared.refreshpacksDetails.next(true); 
              }
              else{
                this._shared.addNewRatioLine('packsDetails',null,data);
                this._shared.refreshpacksDetails.next(true); 
              }
            }
        }) ;
      }
      else{
        this.alertUtils.showAlerts("Carton already generated");
      }
    }

    deleteCartonLines(){
      this._service.validateCartonDelete().then(data=>{
        if(data == 0){
          const dialog = this.dialog.open(ConfirmPopupComponent);
          dialog.componentInstance.dialogTitle = 'Warning';
          dialog.componentInstance.message = 'Are you sure to delete all carton?';
          dialog.componentInstance.confirmText = 'Delete';
          dialog.afterClosed().subscribe(data=>{
            if(data){
              this._service.deleteCarton().then(data=>{
                let packIds = this._shared.fetchAllPackIds();
                let pushMessage = {
                  appIdentifier: 'PACKING',
                  action: 'PACK_DELETED',
                  content: packIds
                };
                this._service.sendMessage(pushMessage);
                this._shared.refreshData.next(true);
                this._service.loadData('carton');
              })
            }
          })
        }
        else{
          this.alertUtils.showAlerts("One or more carton is not in OPEN status or has excess or short quantity");
        }
      })
    }

    generateCartonLines(){
      if(this._shared.totalPacks > 0){
        this._service.generateCarton('Y').then(data=>{
          let pushMessage = {
            appIdentifier: 'PACKING',
            action: 'PACK_GENERATED',
            content: {
              style: this._shared.styleId,
              purchaseOrder: this._shared.poId
            }
          };
          this._service.sendMessage(pushMessage);
        })
      }
      else{
        this.alertUtils.showAlerts("Failed to generate cartons. No packs created");
      }
      // if(this._shared.isCartonGenerated){
      //   this.alertUtils.showAlerts("Carton already generated ");
      // }
      // else{
      //   if(this._shared.totalPacks > 0){
      //     this._service.generateCarton('Y').then(data=>{
      //     })
      //   }
      //   else{
      //     this.alertUtils.showAlerts("Failed to generate cartons. No packs created");
      //   }
      // }
    }
}
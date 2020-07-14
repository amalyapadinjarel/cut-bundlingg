import { Component, OnDestroy, OnInit, AfterContentInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd, ResolveEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { CutRegisterSharedService } from '../_service/cut-register-shared.service';
import { CutRegisterService } from '../_service/cut-register.service';
import { OrderDetails, LayerDetails, MarkerDetails, CutPanelDetails } from '../models/cut-register.model';
import { MatDialog } from '@angular/material/dialog';
import { TnzInputLOVComponent } from 'app/shared/tnz-input/input-lov/input-lov.component';
import { CopyFromSOLovConfig } from '../models/lov-config';
import { MarkerDetailsComponent } from './marker-details/marker-details.component';
import { AlertUtilities, DateUtilities } from 'app/shared/utils';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { HttpParams } from '@angular/common/http';
import { ConfirmPopupComponent } from 'app/shared/component';

@Component({
	selector: 'cut-register-form',
	templateUrl: './form.component.html',
	host: { 'class': 'form-view' }
})
export class PdmCostingFormComponent {

	hasNextRecord: boolean = false;
	hasPreviousRecord: boolean = false;
	private routerSubs: Subscription;
	public clicked = false;
	public copyFromOptions = [
		{
			label: "Copy From SO",
			value: "S"
		},
		{
			label: "Copy From MO",
			value: "M"
		},
	]

	constructor(
		public _shared: CutRegisterSharedService,
		private _service: CutRegisterService,
		private _inputService: TnzInputService,
		private route: ActivatedRoute,
		private router: Router,
		private dialog: MatDialog,
		private alertUtils: AlertUtilities,
		public dateUtils: DateUtilities
	) {
	}

	ngOnInit() {
		this.setCosting();
		this.routerSubs = this.router.events.subscribe(change => {
			this.routerChanged(change);
		})
	}

	ngOnDestroy(): void {
		if (this.routerSubs)
			this.routerSubs.unsubscribe();
	}

	routerChanged(change) {
		if (change instanceof ResolveEnd) {
			if (change.url.startsWith('/cut-register/list')) {
				this.unsetCosting();
			}
		}
		if (change instanceof NavigationEnd) {
			this.setCosting();
		}
	}

	unsetCosting() {
		this._shared.editMode = false;
		this._shared.id = 0;
		this._shared.setFormData({});
	}

	setCosting() {
		if (this.router.url.endsWith('/create')) {
			this._shared.id = 0;
			this._shared.editMode = true;
		}
		else {
			this._shared.id = Number(this.route.snapshot.params.costingId);
			if (this.router.url.endsWith('/edit')) {
				this._shared.editMode = true;
			}
			else {
				this._shared.editMode = false;
				this._shared.refreshData.next(true);
			}
		}
		this._shared.setFormData({});
		this._shared.resetAllInput();
	}

	deleteLine(key) {
		this._service.deleteLines(key)
	}

	print() {
		console.log((this._shared.formData));
	}

	copyFrom(op) {
		let lovConfig: any = {};
		if (op.value == 'S') {
			lovConfig = JSON.parse(JSON.stringify(CopyFromSOLovConfig));
		}
		lovConfig.url += this._shared.getHeaderAttributeValue('attributeSet');
		const dialogRef = this.dialog.open(TnzInputLOVComponent);
		dialogRef.componentInstance.lovConfig = lovConfig;
		dialogRef.afterClosed().subscribe(resArray => {
			let routingIds = [];
			let unAddedOrderLines = [];
			if (resArray && resArray.length) {
				resArray.forEach(res => {
					let routingId = res.routingId
					res = this.mapResToOrderDetails(res);
					let orderLineIndex = this._shared.formData.orderDetails.findIndex(data => {
						return res.refDocLineId == data.refDocLineId
					})
					if (orderLineIndex == -1) {
						routingIds.push(routingId);
						this._shared.addLine('orderDetails', res);
						let index = this._shared.formData.markerDetails.findIndex(data => {
							return data.attrValId == res.attrValId;
						});
						if (index == -1) {
							res = this.mapFromOrderToMarkerDetails(res);
							this._shared.addLine('markerDetails', res);
						}
					} else {
						unAddedOrderLines.push(res)
					}
				});
				if (unAddedOrderLines.length) {
					this.alertUtils.showAlerts(unAddedOrderLines.length + " line(s) are not coppied as they already exist.")
				}
				if (routingIds.length)
					this._service.getCutPanelsFromRoutingIds(routingIds).then((cutPanels: any) => {
						cutPanels.forEach(line => {
							let index = this._shared.formData.cutPanelDetails.findIndex(data => {
								return data.panelName == line.panelCode && data.refProdId == line.refProdId;
							});
							if (index == -1) {
								let cutPanelLine = this.mapToCutPanelLine(line);
								this._shared.addLine('cutPanelDetails', cutPanelLine)
							}
						})
					})
			}
		})
	}

	mapResToOrderDetails(res) {
		let model = new OrderDetails();
		model.layRegstrId = this._shared.id ? this._shared.id.toString() : "0";
		model.bpartName = res.customer ? res.customer : "";
		model.bpartnerDocNo = res.bpartnerDocNo ? res.bpartnerDocNo : "";
		model.bpartnerId = res.bpartnerId ? res.bpartnerId : "";
		model.ordQtyUom = res.qtyUom ? res.qtyUom : "";
		model.lineQty = res.orderQty ? res.orderQty : "";
		model.kit = res.kit ? res.kit : "";
		model.allwdQty = res.maxAllowQty ? res.maxAllowQty : "";;

		model.refDocId = res.orderId ? res.orderId : "";
		model.refDocLineId = res.orderLineId ? res.orderLineId : "";
		model.refDocRevNo = res.revisionNo ? res.revisionNo : "";
		model.refBaseDoc = res.refBaseDoc ? res.refBaseDoc : "";
		model.refDocTypeId = res.docTypeId ? res.docTypeId : "";
		model.refDocNo = res.documentNo ? res.documentNo : "";
		model.refDocDate = res.orderDate ? res.orderDate : "";
		model.refDoc = res.docType ? res.docType : "";
		model.refProduct = res.productNum ? res.productNum : "";
		model.refProductId = res.productId ? res.productId : "";
		model.refProdAttr = res.prdAttribute ? res.prdAttribute : "";


		model.excQty = res.excQty ? res.excQty : "";
		model.color = res.color ? res.color : "";
		model.displayOrder = res.displayOrder ? res.displayOrder : "";
		model.cutAllowanceQty = res.cutAllowanceQty ? res.cutAllowanceQty : "";
		model.createdBy = res.createdBy ? res.createdBy : "";
		model.layOrderRefId = res.layOrderRefId ? res.layOrderRefId : "";
		model.facility = res.facility ? res.facility : "";
		model.orderRefNo = res.orderReference ? res.orderReference : "";
		model.bpartnerDocNo = res.orderReference ? res.orderReference : "";

		model.cutAllowancePercent = this._shared.getHeaderAttributeValue('cutAllowance');
		model.totalOrderQty = this._service.calculateAllowedQty(res.orderQty, model.cutAllowancePercent);
		model.attribute1 = res.attribute1 ? res.attribute1 : "";
		model.attribute2 = res.attribute2 ? res.attribute2 : "";
		model.attribute3 = res.attribute3 ? res.attribute3 : "";
		model.attribute4 = res.attribute4 ? res.attribute4 : "";
		model.attribute5 = res.attribute5 ? res.attribute5 : "";
		model.attribute6 = res.attribute6 ? res.attribute6 : "";
		model.attribute7 = res.attribute7 ? res.attribute7 : "";
		model.attribute8 = res.attribute8 ? res.attribute8 : "";
		model.attribute9 = res.attribute9 ? res.attribute9 : "";
		model.attribute10 = res.attribute10 ? res.attribute10 : "";
		model.totCutQty = res.totCutQty ? res.totCutQty : "";

		model.prevqty = res.prevCutQty ? res.prevCutQty : "";
		model.comboTr = res.comboTitle ? res.comboTitle : "";
		model.combo = res.combo ? res.combo : "";
		model.routingId = res.routingId ? res.routingId : "";
		model.markerAttrVal = res.markerAttrVal ? res.markerAttrVal : "";
		model.attrValId = res.attrValId ? res.attrValId : "";
		model.styleId = res.parProdId ? res.parProdId : "";
		return model;
	}

	mapFromOrderToMarkerDetails(res: OrderDetails) {
		let model = new MarkerDetails();
		model.layRegstrId = res.layRegstrId;
		model.prodName = res.refProduct;
		model.productId = res.refProductId;
		model.prodAttr = res.markerAttrVal;
		model.facility = res.facility;
		model.attrValId = res.attrValId;

		model.attribute1 = res.attribute1;
		model.attribute2 = res.attribute2;
		model.attribute3 = res.attribute3;
		model.attribute4 = res.attribute4;
		model.attribute5 = res.attribute5;
		model.attribute6 = res.attribute6;
		model.attribute7 = res.attribute7;
		model.attribute8 = res.attribute8;
		model.attribute9 = res.attribute9;
		model.attribute10 = res.attribute10;
		return model;
	}

	mapToCutPanelLine(line) {
		let cutPanel = new CutPanelDetails();
		cutPanel.layRegstrId = this._shared.id.toString();
		cutPanel.panelName = line.panelCode;
		cutPanel.panelNameTr = line.panelName;
		cutPanel.mOpId = line.opId;
		cutPanel.opSeq = line.opSequence;
		cutPanel.refProdId = line.refProdId;
		cutPanel.facility = this._shared.getHeaderAttributeValue('cutFacility');
		return cutPanel;
	}

	generateBundleLines() {
		if (this._service.checkIfEdited()) {
			this.alertUtils.showAlerts('Changes detected. Please save the changes before generating bundle lines.')
		} else {
			this._service.generateBundleLines(this._shared.id).then(data => {
				this._service.loadData('cutBundle');
				this._shared.refreshHeaderData.next(true)
			}).catch(err => {
				this.alertUtils.showAlerts(err);
			})
		}
	}

	deleteBundleLines() {
		if (this._shared.formData.cutBundle && this._shared.formData.cutBundle.length) {
			if (this._service.checkIfEdited()) {
				this.alertUtils.showAlerts('Changes detected. Please save the changes before deleting bundle lines.')
			} else {
				let dialogRef = this.dialog.open(ConfirmPopupComponent);
				dialogRef.componentInstance.dialogTitle = 'Delete Bundle Line(s)';
				dialogRef.componentInstance.message = 'Are you sure you want to delete all the bundle lines '
				dialogRef.afterClosed().subscribe(flag => {
					if (flag) {
						this._service.deleteBundleLines(this._shared.id).then(data => {
							this._service.loadData('cutBundle');
						}).catch(err => {
							this.alertUtils.showAlerts(err);
						})
					}
				})
			}

		}
	}

	compute() {
		let cutAllowance = this._shared.getHeaderAttributeValue('cutAllowance');
		let primaryKey = this._shared.orderDetailsPrimaryKey;
		if (typeof cutAllowance != 'undefined' && cutAllowance !== '') {
			this._shared.formData.orderDetails.forEach((data, index) => {
				this._inputService.updateInput(this._shared.getOrderDetailsPath(index, 'cutAllowancePercent'), cutAllowance, primaryKey)
				this._inputService.updateInput(this._shared.getOrderDetailsPath(index, 'cutAllowanceQty'), '', primaryKey)
				let allowQty = this._service.calculateAllowedQty(data.lineQty, cutAllowance);
				this._inputService.updateInput(this._shared.getOrderDetailsPath(index, 'allwdQty'), allowQty, primaryKey)
			});
		}
	}

	regenerateCutPanels() {
		this._shared.cutPanelDetailsLoading = true;
		let routingIds = [];
		this._shared.formData.orderDetails.forEach(line => {
			if (routingIds.indexOf(line.routingId) == -1)
				routingIds.push(line.routingId);
		})
		if (routingIds.length)
			this._service.getCutPanelsFromRoutingIds(routingIds).then((cutPanels: any) => {
				this._service.deleteAll('cutPanelDetails');
				cutPanels.forEach(line => {
						let cutPanelLine = this.mapToCutPanelLine(line);
						this._shared.addLine('cutPanelDetails', cutPanelLine)
				})
				this._shared.cutPanelDetailsLoading = false;				
			})
	}

}


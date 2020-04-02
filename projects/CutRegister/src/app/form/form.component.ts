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
import { AlertUtilities } from 'app/shared/utils';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';

@Component({
	selector: 'cut-register-form',
	templateUrl: './form.component.html',
	host: { 'class': 'form-view' }
})
export class PdmCostingFormComponent {

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
		private alertUtils: AlertUtilities
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
			if (this.router.url.endsWith('/edit')) {
				this._shared.editMode = true;
			}
			else {
				this._shared.editMode = false;
				this._shared.refreshData.next(true);
			}
			this._shared.id = Number(this.route.snapshot.params.costingId);
		}
		this._shared.setFormData({});
	}

	deleteLine(key) {
		this._shared.deleteLines(key)
	}

	print() {
		console.log((this._shared.formData));
	}

	copyFrom(op) {
		let lovConfig = {};
		if (op.value == 'S') {
			lovConfig = JSON.parse(JSON.stringify(CopyFromSOLovConfig));
		}
		const dialogRef = this.dialog.open(TnzInputLOVComponent);
		dialogRef.componentInstance.lovConfig = lovConfig;
		dialogRef.afterClosed().subscribe(resArray => {
			let routingIds = [];
			if (resArray && resArray.length) {
				resArray.forEach(res => {
					routingIds.push(res.routingId);
					res = this.mapResToOrderDetails(res);
					this._shared.addLine('orderDetails', res);
					let markerDetails = this._shared.formData.markerDetails;
					let index = markerDetails.findIndex(data => {
						return data.productId == res.refProductId;
					});
					if (index == -1) {
						res = this.mapFromOrderToMarkerDetails(res);
						this._shared.addLine('markerDetails', res);
					}
				});
				console.log(routingIds);
				this._service.getCutPanelsFromRoutingIds(routingIds).then((cutPanels: any) => {
					console.log(cutPanels)
					cutPanels.forEach(line => {
						let cutPanelLine = this.mapToCutPanelLine(line);
						console.log(cutPanelLine) 
						this._shared.addLine('cutPanelDetails', cutPanelLine)
					})
				})
			}
		})
	}

	mapResToOrderDetails(res) {
		let model = new OrderDetails();
		model.layRegstrId = this._shared.id ? this._shared.id.toString() : "0";
		model.bpartName = res.customer ? res.customer : "";
		model.bpartnerDocNo = res.orderReference ? res.orderReference : "";
		model.ordQtyUom = res.qtyUom ? res.qtyUom : "";
		model.lineQty = res.orderQty ? res.orderQty : "";
		model.kit = res.kit ? res.kit : "";

		model.refDocId = res.refDocId ? res.refDocId : "";
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
		model.allwdQty = res.allwdQty ? res.allwdQty : "";
		model.cutAllowanceQty = res.cutAllowanceQty ? res.cutAllowanceQty : "";
		model.createdBy = res.createdBy ? res.createdBy : "";
		model.layOrderRefId = res.layOrderRefId ? res.layOrderRefId : "";
		model.facility = res.facility ? res.facility : "";

		model.cutAllowancePercent = res.cutAllowancePercent ? res.cutAllowancePercent : "";
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

		model.prevqty = res.prevqty ? res.prevqty : "";
		model.comboTr = res.comboTitle ? res.comboTitle : "";
		model.combo = res.combo ? res.combo : "";
		return model;
	}

	mapFromOrderToMarkerDetails(res: OrderDetails) {
		let model = new MarkerDetails();
		// layMarkerId
		// displayOrder
		// attribute 
		// currcutqtysql = 
		model.layRegstrId = res.layRegstrId;
		model.prodName = res.refProduct;
		model.productId = res.refProductId;
		model.prodAttr = res.refProdAttr;
		model.facility = res.facility;

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

	mapToCutPanelLine(line){
		let cutPanel = new CutPanelDetails();
		cutPanel.layRegstrId = this._shared.id.toString();
		cutPanel.panelName = line.panelCode;
		cutPanel.panelNameTr = line.panelName;
		return cutPanel;
	}

	generateBundleLines() {
		this._service.generateBundleLines(this._shared.id).then(data => {
			this._service.loadData('cutBundle');
		}).catch(err => {
			this.alertUtils.showAlerts(err);
		})
	}

	deleteBundleLines() {
		this._service.deleteBundleLines(this._shared.id).then(data => {
			this._service.loadData('cutBundle');
		}).catch(err => {
			this.alertUtils.showAlerts(err);
		})
	}

	compute() {
		let cutAllowance = this._shared.getHeaderAttributeValue('cutAllowance');
		if (typeof cutAllowance != 'undefined' && cutAllowance !== '') {
			this._shared.formData.orderDetails.forEach((data, index) => {
				this._inputService.updateInput(this._shared.getOrderDetailsPath(index, 'cutAllowancePercent'), cutAllowance)
				this._inputService.updateInput(this._shared.getOrderDetailsPath(index, 'cutAllowanceQty'), '')
				let allowQty = this._service.calculateAllowedQty(data.lineQty, cutAllowance);
				this._inputService.updateInput(this._shared.getOrderDetailsPath(index, 'allwdQty'), allowQty)
			});
		}
	}
}


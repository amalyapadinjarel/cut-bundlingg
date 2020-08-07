import { Component, OnInit, OnDestroy } from '@angular/core';
import { DocumentTypeSharedService } from '../../_service/document-type-shared.service';
import { DocumentTypeService } from '../../_service/document-type.service';
import { DateUtilities, AlertUtilities } from 'app/shared/utils';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { Subscription } from 'rxjs';
@Component({
	selector: 'doctype-general',
	templateUrl: './general.component.html',
	styleUrls: ['./general.component.scss'],
	host: { 'class': 'general-card' }
})
export class GeneralComponent implements OnInit, OnDestroy {
	docSeqFlag = false;
	loading = true;
	disabled: any = {};
	baseDocLov = JSON.parse(JSON.stringify(baseDocConfig));
	statusLov = JSON.parse(JSON.stringify(statusLovConfig));
	docSeqLov = JSON.parse(JSON.stringify(docSeqLovConfig));
	roundMethodLov = JSON.parse(JSON.stringify(roundMethodLovConfig));
	currConvLov = JSON.parse(JSON.stringify(currConvLovConfig));
	workflowLov = JSON.parse(JSON.stringify(workflowLovConfig));

	constructor(
		public _shared: DocumentTypeSharedService,
		private _service: DocumentTypeService,
		public dateUtils: DateUtilities,
		private alertUtils: AlertUtilities,
		private _inputService: TnzInputService) { }

	ngOnInit(): void {

	}


	ngOnDestroy(): void {

	}



	getIfEditable(key) {
		return !this.disabled[key] && this._shared.getHeaderEditable(key, this._shared.id);
	}


	valueChangedFromUI(event) {
		
		if (event.key == "shortCode") {
			let attribute = event.value.trim();


			let shortCode = attribute.toUpperCase();
		
			this._shared.formData.header.shortCode = shortCode;

			if (shortCode.length > 30) {

				this._inputService.setError(this._shared.getHeaderAttrPath('shortCode'), 'Length exceeded 30 characters!');
			}
			else {
				//check for duplicates
				this._service.duplicateDocTypeCheck().then(data => {
					if (data) {
						this._inputService.setError(this._shared.getHeaderAttrPath('shortCode'), 'Duplicate Short Code -' + event.value + ' !');
					}
				});
			}
		}
		if (event.key == "numControlled") {
			
			if (event.value == "Y") {
				this._shared.formData.header.numControlled = 'Y'
				this.docSeqFlag = true

			}
			else {
				this._shared.formData.header.numControlled = 'N'
				this.docSeqFlag = false
			}
		}
	}
	ValidateEntryNum(event) {
		
		var reg = /^\d+$/;
		if (!reg.test(event.value)){
		if (event.key == "backEntry") {
		  this._inputService.setError(this._shared.getHeaderAttrPath('backEntry'), 'Please enter a valid number!');
	  
		}
		if (event.key == "forwdEntry") {
		this._inputService.setError(this._shared.getHeaderAttrPath('forwdEntry'), 'Please enter a valid number!');
	
	  }
	}}

}
export const baseDocConfig: any = {
	title: 'Select Base Document',
	url: 'lovs/base-doc',
	dataHeader: 'data',
	returnKey: 'value',
	displayKey: 'label',
	filterAttributes: ['label'],
	displayFields: [
		{
			key: 'label',
			title: 'Name'
		}
		, {
			key: 'value',
			title: 'Short Code'
		}]
};
export const statusLovConfig: any = {
	title: 'Select Opening Status',
	url: 'lovs/doc-status',
	dataHeader: 'data',
	returnKey: 'value',
	filterAttributes: ['label'],
	displayFields: [
		{
			key: 'label',
			title: 'Name'
		}
	]
};


export const docSeqLovConfig: any = {
	title: 'Select Base Document',
	url: 'lovs/doc-sequence',
	dataHeader: 'data',
	returnKey: 'value',
	displayKey: 'label',
	filterAttributes: ['label'],
	displayFields: [
		{
			key: 'shortCode',
			title: 'Short Code'
		}
		, {
			key: 'label',
			title: 'Name'
		}]
};

export const roundMethodLovConfig: any = {
	url: 'lovs/rounding-method',
	dataHeader: 'data',
	returnKey: 'value',
	displayKey: 'label',
	filterAttributes: ['label'],
	displayFields: [
		{
			key: 'label',
			title: 'Name'
		}
	]

};

export const currConvLovConfig: any = {
	url: 'lovs/curr-conv-type',
	dataHeader: 'data',
	returnKey: 'value',
	displayKey: 'label',
	filterAttributes: ['label'],
	displayFields: [
		{
			key: 'label',
			title: 'Name'
		}
	]

};



export const workflowLovConfig: any = {
	title: 'Select Workflow',
	url: 'lovs/workflow',
	dataHeader: 'data',
	returnKey: 'value',
	displayKey: 'label',
	filterAttributes: ['label'],
	displayFields: [
		{
			key: 'label',
			title: 'WorkFlow'
		},
		{
			key: 'shortCode',
			title: 'Key'
		}
	]
};
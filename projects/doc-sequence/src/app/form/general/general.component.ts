import { Component, OnInit, OnDestroy } from '@angular/core';
import { DocSequenceSharedService } from '../../_service/doc-sequence-shared.service';
import { DocSequenceService } from '../../_service/doc-sequence.service';
import { ApplicationLovConfig } from '../../../../../lookup/src/app/models/lov-config';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';
import { SubSink } from 'subsink';
import { AlertUtilities } from 'app/shared/utils';

@Component({
	selector: 'doc-seq-general',
	templateUrl: './general.component.html',
	styleUrls: ['./general.component.scss'],
	host: { 'class': 'general-card' }
})

export class GeneralComponent implements OnInit ,OnDestroy{
	customFlag = false;
	AppLov = JSON.parse(JSON.stringify(ApplicationLovConfig));
	AuthorOptions = [
		{
			label: 'User',
			value: 'U'
		},
		{
			label: 'System',
			value: 'S'
		}
	];
	private subs = new SubSink();
	constructor(public _shared: DocSequenceSharedService,
		private _service: DocSequenceService,
		private alertUtils: AlertUtilities,
		private _inputService: TnzInputService) { }

	ngOnInit(): void {

		
		this.subs.sink = this._shared.refreshData.subscribe(change => {
			this.loadData();
			this.setDefaultValues() 
		  })
		
	}
	ngOnDestroy(): void {
		this.subs.unsubscribe();
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
		this._shared.headerLoading = flag;
		this._shared.loading = flag;
		this._shared.SeqLineDetailLoading = flag;
	  }
	getIfEditable(key) {
		return this._shared.getHeaderEditable(key);
	}
	valueChangedFromUI(event) {

		if (event.key == "shortCode") {
			let attribute = event.value.trim();

			let shortCode = attribute.toUpperCase();

			this._shared.formData.header.shortCode = shortCode;

			if (shortCode.length > 30) {

				this._inputService.setError(this._shared.getHeaderAttrPath('shortCode'), 'Length must not exceed 30 characters!');
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
		if (event.key == "useCustPgm") {

			if (event.value == "Y") {
				if (this._shared.formData.header)
					this._shared.formData.header.useCustPgm = 'Y'
				this._shared.customFlag = false

			}
			else {
				if (this._shared.formData.header)
					this._shared.formData.header.useCustPgm = 'N'
				this._shared.customFlag = true
			}

		}
		if (event.key == "resetYear") {

			if (event.value == "Y") {
				if (this._shared.formData.header)
					this._shared.formData.header.resetYear = 'Y'
				this._shared.resetyearFlag = true
				this._shared.notresetyearFlag = false
			}
			else {
				if (this._shared.formData.header)
					this._shared.formData.header.resetYear = 'N'
				this._shared.resetyearFlag = false
				this._shared.notresetyearFlag = true
			}

		}
	}


	NumValidation(event) {

		var reg = /^\d+$/;
		if (!reg.test(event.value)) {
			if (event.key == "autoReset") {
				this._inputService.setError(this._shared.getHeaderAttrPath('autoReset'), 'Please enter a valid number!');

			}
			if (event.key == "nextNum") {
				this._inputService.setError(this._shared.getHeaderAttrPath('nextNum'), 'Please enter a valid number!');

			}
			if (event.key == "incrementBy") {
				this._inputService.setError(this._shared.getHeaderAttrPath('incrementBy'), 'Please enter a valid number!');

			}
		}
	}
	checkLimit(event) {
		let value = event.value.trim();

		if(event.key == "docSeqName" && value.length>60)
		this._inputService.setError(this._shared.getHeaderAttrPath('docSeqName'), 'Length must not exceed 60 characters!');
		
		if(event.key == "prefix" && value.length>60)
		this._inputService.setError(this._shared.getHeaderAttrPath('prefix'), 'Length must not exceed 255 characters!');

		if(event.key == "suffix" && value.length>60)
		this._inputService.setError(this._shared.getHeaderAttrPath('suffix'), 'Length must not exceed 255 characters!');

		if(event.key == "description" && value.length>60)
		this._inputService.setError(this._shared.getHeaderAttrPath('description'), 'Length must not exceed 255 characters!');

	}
	setDefaultValues(){
		if (this._shared.id == 0){
		this._inputService.updateInput(this._shared.getHeaderAttrPath('active'),'Y');
		this._inputService.updateInput(this._shared.getHeaderAttrPath('resetYear'),'N');
		this._inputService.updateInput(this._shared.getHeaderAttrPath('useCustPgm'),'N');
       this._inputService.updateInput(this._shared.getHeaderAttrPath('incrementBy'),1);
       this._inputService.updateInput(this._shared.getHeaderAttrPath('autoReset'),1);
	   this._inputService.updateInput(this._shared.getHeaderAttrPath('nextNum'),'1');
	 //  this._shared.resetyearFlag = false
		//this._shared.customFlag = false
		//this._shared.notresetyearFlag = false
	   
	}
}
}

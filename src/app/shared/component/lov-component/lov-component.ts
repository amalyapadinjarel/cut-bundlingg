import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { MatDialogRef } from '@angular/material/dialog';

import { ApiServiceV4 } from '../../services/api-v4.service';
import { SmdDataTable } from '../smd/smd-datatable/datatable.component';
import { environment } from 'environments/environment';
import { AlertUtilities } from 'app/shared/utils/alert.utility';
import { DateUtilities } from 'app/shared/utils';

@Component({
	selector: 'lov-component',
	templateUrl: './lov-component.html'
})
export class LOVComponent implements OnInit, OnDestroy {
	selectedRows: any;
	primaryKey;
	assetEnv = environment.asset_url;
	selectMultiple: boolean = false;
	width = 'input-card no-padding popup-width';
	paginated: boolean = false;
	rowCount;
	application = 'HCM';
	countRows: boolean = false;
	title = "LOV";
	apiClass;
	apiMethod = 'GET';
	postBody: any = {};
	limit = 30;
	apiUrl;
	dataHeader;
	fields: any[];
	listAttrs;
	listAttrTitles;
	sortable: boolean = false;
	filterAttrs;
	numericAttrs = [];
	dateFieldAttrs = [];
	timeFieldAttrs = [];
	sortAttrs = [];
	searchParams: URLSearchParams;
	returnAttrs;
	isTitleNeeded = true;
	numeric: Array<boolean> = [];
	dateField: Array<boolean> = [];
	private dataSubs;
	records;
	recordsAll;
	searchEnabled = true;
	filterValue;
	model;
	searchDB = true;
	toolTipAttrs = [];
	iconAttrs = [];
	icons = [];
	iconColorAttrs = [];
	flagAttrs = [];
	showTableFilter: boolean = true;
	showColumnFilter: boolean = false;
	existingattrs = [];
	uniqueKey;
	useInternalSearch = false;
	models = null;
	
	@ViewChild(SmdDataTable, { static: true }) dataTable: SmdDataTable;
	@ViewChild('searchInput', { static: true }) searchInput: ElementRef;

	constructor(
		public dialogRef: MatDialogRef<LOVComponent>,
		private apiService: ApiServiceV4,
		private alertUtils: AlertUtilities,
	) { }

	ngOnInit() {
		if (!this.searchParams)
			this.searchParams = new URLSearchParams();
		if (!this.filterAttrs)
			this.filterAttrs = this.listAttrs;
		if (!this.listAttrTitles)
			this.listAttrTitles = this.listAttrs;
		if (!this.returnAttrs)
			this.returnAttrs = this.listAttrs;
		if (!this.apiClass)
			this.apiClass = this.apiService;
		if (!this.fields) {
			this.fields = [];
			if (this.listAttrs) {
				for (let i = 0; i < this.listAttrs.length; i++) {
					let field: any = {};
					field.key = this.listAttrs[i];
					field.title = this.listAttrTitles[i];
					field.toolTip = this.toolTipAttrs[i];
					field.iconImg = this.icons[i];
					field.iconColor = this.iconColorAttrs[i];
					field.filterable = this.filterAttrs.indexOf(field.key) > -1;
					field.sortable = this.numericAttrs.indexOf(field.key) > -1;
					field.dateField = this.dateFieldAttrs.indexOf(field.key) > -1;
					field.timeField = this.timeFieldAttrs.indexOf(field.key) > -1;
					field.numeric = this.sortAttrs.indexOf(field.key) > -1;
					field.flag = this.flagAttrs.indexOf(field.key) > -1;
					field.icon = this.iconAttrs.indexOf(field.key) > -1;
					this.fields.push(field);
				}
			}
		}
	}

	ngOnDestroy() {
		if (this.dataSubs)
			this.dataSubs.unsubscribe();
		delete this.apiClass;
		delete this.apiUrl;
		delete this.dataHeader;
		delete this.listAttrs;
		delete this.listAttrTitles;
		delete this.filterAttrs;
		delete this.searchParams;
		delete this.returnAttrs;
		delete this.records;
	}

	rowSelected(event) {
		this.model = event.model;
		if (event.selected && !this.selectMultiple) {
			this.selectRecord();
		}
	}

	checkedRows(event) {
		if (event.checkedArr.checkedList) {
			this.selectedRows = event.checkedArr.checkedList;

		}
	}
	selectRecord() {
		if (this.selectMultiple) {
			if (this.primaryKey && this.primaryKey.length > 0 && this.selectedRows)
				this.dialogRef.close(this.selectedRows);
			else
				this.dialogRef.close(this.dataTable.selectedModels());
		}
		else {
			if (this.model) {
				this.dialogRef.close(this.model);
			} else {
				this.alertUtils.showAlerts('Selection failed');
			}
		}
	}

	toLower(upper) {
		return upper.toLowerCase();
	}
	
	convertToDate(date) {
		return DateUtilities.formatDate(!date || date == '' ? null : new Date(date).toString());
	}

	convertToDateTime(date) {
		return DateUtilities.formatToDateTime(!date || date == '' ? null : new Date(date).toString());
	}

	_onDataChange(dataChange: any) {
		if (this.existingattrs.length > 0 && this.uniqueKey) {
			let apiData = [];
			apiData = dataChange.data[this.dataHeader];
			for (let idx = 0; idx < apiData.length; idx++) {
				let index = this.existingattrs.indexOf(apiData[idx][this.uniqueKey]);
				if (index >= 0) {
					apiData.splice(idx, 1);
					idx--;
				}
			}
			this.dataTable.refresh(apiData);
		}

	}
}

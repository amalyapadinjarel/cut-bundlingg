
import {
	AfterContentChecked,
	AfterContentInit,
	ChangeDetectorRef,
	Component,
	ContentChild,
	ContentChildren,
	Directive,
	EmbeddedViewRef,
	EventEmitter,
	forwardRef,
	Inject,
	Input,
	OnDestroy,
	OnInit,
	Output,
	QueryList,
	TemplateRef,
	ViewChild,
	ViewContainerRef,
	ViewEncapsulation,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { URLSearchParams } from '@angular/http';
import { Subscription, Observable } from 'rxjs';
import { isNullOrUndefined } from 'util';

import { SmdPaginatorComponent } from '../smd-paginator/paginator.component';
import { CommonUtilities } from 'app/shared/utils/common.utility';
import { ApiService } from '../../../services';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';

let columnIds = 0;
export class SmdDataRowModel {
	originalOrder?: number;

	constructor(public model: any,
		public checked?: boolean, public selected?: boolean) {
	}
}

@Directive({
	selector: '[smd-data-cell]'
})
export class SmdDataTableCellComponent implements OnInit, OnDestroy {
	@Input() column: SmdDataTableColumnComponent | any;
	@Input() data: any;
	@Input() index: number;
	@Input() templ: TemplateRef<SmdDataTableCellComponent>;

	childView: EmbeddedViewRef<SmdDataTableCellComponent>;

	constructor(private _viewContainer: ViewContainerRef) { }

	ngOnInit(): void {
		if (this._viewContainer && this.templ) {
			this.childView = this._viewContainer.createEmbeddedView(this.templ, this);
		}
	}

	ngOnDestroy(): void {
		this.childView.destroy();
	}
}

@Component({
	selector: "[smd-datatable-row]",
	template: `<td *ngIf="renderCheckbox" class="smd-datatable-body-checkbox">
  <div class="smd-checkbox">
  <mat-icon *ngIf="row.model.smdProperties?.childRow" class="child-icon">subdirectory_arrow_right</mat-icon>
  <mat-checkbox [(ngModel)]="row.checked" (change)="_parent._onRowCheckChange(row)">
  </mat-checkbox>
  </div>
  </td>
  <td *ngFor="let column of columns"
  [class.smd-numeric-column]="column.numeric"
  [class.smd-editable]="column.editable"
  [class.smd-stretch]="column.stretch"
  [ngStyle]="column.colStyle"
  [ngClass]="column.contentAlign ? 'align-' + column.contentAlign : ''"
  >
  <span class="smd-column-title">
  {{column.title}}
  </span>
  <span class="smd-cell-data">
  <ng-template smd-data-cell [column]="column" [data]="row.model" [index]="row.originalOrder" [templ]="column.template"></ng-template>
  <span class="smd-editable-field-placeholder" *ngIf="column.editable && !row.model[column.field]">{{column.editablePlaceholder}}</span>
  </span>
  </td>`
})
export class SmdDataTableRowComponent {
	@Input() row: SmdDataRowModel;
	@Input() renderCheckbox: boolean;
	@Input() isTitleNeeded = true;
	@Input() columns: SmdDataTableColumnComponent[];

	constructor(@Inject(forwardRef(() => SmdDataTable)) public _parent: SmdDataTable) {
	}
}

@Component({
	selector: "smd-datatable-column",
	template: `<ng-content select="template"></ng-content>
  <ng-template #internalTemplate *ngIf="!_customTemplate" let-model="data">
  {{getFieldValue(model)}}
  </ng-template>`
})
export class SmdDataTableColumnComponent implements OnInit {
	sortDir?: 'ASC' | 'DESC' = null;
	id: string = '' + ++columnIds;
	headerWidth: number = 0;

	@Input() title: string;

	@Input() titleTooltip: string;
	@Input() field: string;
	@Input() numeric: boolean = false;
	@Input() sortable: boolean = false;

	@Input() filterable: boolean = false;
	@Input() sortFn: (a: any, b: any, sortDir: string) => number;
	@Input() filterFn: (a: any, text: string) => boolean;
	@Input() editable: boolean = false;
	@Input() editablePlaceholder: string;
	@Input() stretch: boolean = false;
	@Input() colStyle = {};
	@Input() totalField;
	@Input() total;
	@Input() summable = false;
	@Input() round;
	@Input() contentAlign;

	@ContentChild(TemplateRef, { static: true }) _customTemplate: TemplateRef<Object>;
	@ViewChild('internalTemplate', { read: TemplateRef }) _internalTemplate: TemplateRef<Object>;

	@Output() onFieldChange: EventEmitter<any> = new EventEmitter<any>();

	get template() {
		return this._customTemplate ? this._customTemplate : this._internalTemplate;
	}

	get hasCustomTemplate(): boolean {
		return !!this._customTemplate;
	}

	constructor() {
	}

	ngOnInit(): void {
		if (!this.title) {
			throw new Error('Title is mandatory on smd-datatable-column');
		}
		if (!this.field) {
			throw new Error('Field is mandatory on smd-datatable-column');
		}
	}

	getFieldValue(model: any) {
		return model[this.field];
	}

}

@Component({
	selector: "smd-datatable-action-button",
	template: `
  <button mat-button
  color="primary"
  *ngIf="_checkButtonIsVisible()"
  (click)="_onButtonClick($event)">
  <span>{{label}}</span>
  </button>
  `
})
export class SmdDatatableActionButton {
	@Input() label: string;
	@Output() onClick: EventEmitter<void> = new EventEmitter<void>();

	constructor(@Inject(forwardRef(() => SmdDataTable)) private _parent: SmdDataTable | any) {
	}

	_onButtonClick() {
		this.onClick.emit();
	}

	_checkButtonIsVisible() {
		return this._parent.selectedRows().length == 0;
	}
}

@Component({
	selector: "smd-datatable-contextual-button",
	template: `
  <button mat-icon-button
  *ngIf="_checkButtonIsVisible()"
  (click)="_onButtonClick($event)">
  <mat-icon>{{icon}}</mat-icon>
  </button>
  `
})
export class SmdContextualDatatableButton {
	@Input() icon: string;
	@Input() minimunSelected: number = -1;
	@Input() maxSelected: number = -1;
	@Output() onClick: EventEmitter<any[]> = new EventEmitter<any[]>();

	constructor(@Inject(forwardRef(() => SmdDataTable)) private _parent: SmdDataTable | any) {
	}

	_onButtonClick() {
		this.onClick.emit(this._parent.selectedModels());
	}

	_checkButtonIsVisible() {
		let shouldShow = true;
		if (this.minimunSelected != null && this.minimunSelected > 0 && this._parent.selectedRows().length < this.minimunSelected) {
			shouldShow = false;
		}
		if (shouldShow && this.maxSelected > 0 && this._parent.selectedRows().length > this.maxSelected) {
			shouldShow = false;
		}
		return shouldShow;
	}
}
@Component({
	selector: "smd-datatable",
	templateUrl: "./datatable.component.html",
	styleUrls: ["./datatable.component.scss"],
	encapsulation: ViewEncapsulation.None,
	host: {
		"[class.smd-responsive]": "responsive",
		"[class.primary-listing]": "primaryListing"
	}
})
export class SmdDataTable
	implements AfterContentInit, AfterContentChecked, OnDestroy {
	totalRow: any;
	rows: SmdDataRowModel[] = [];
	private visibleRows: SmdDataRowModel[] = [];
	private _columnsSubscription: Subscription;
	private sortDirection: string;
	private sortField: string;
	private lastQueryExecutedPage: number = 1;
	private selectedRow: any;
	private params: HttpParams = new HttpParams();
	tableHeight: number;
	private token;
	private lastSelected;
	filteredModels: any[];

	filterInput: FormControl;
	columnFilterInputs: FormControl[] = [];
	columnFilterInputsValues;

	@ViewChild(SmdPaginatorComponent, { static: true }) paginatorComponent: SmdPaginatorComponent;
	@ContentChildren(SmdDataTableColumnComponent) columns: QueryList<SmdDataTableColumnComponent>;

	@Input() tableId: string;
	@Input() apiLevel: number = 4;
	@Input() rowCount: number = 0;
	dummyRowCount: any = 0;
	dummyRows: any[] = [1, 2, 3];
	@Input() showCheckBox: boolean = true;
	@Input() noDataDisplayMessage: string = "No data to display";
	@Input() noDataDisplayIcon: string = "sentiment_very_dissatisfied";
	@Input() isTitleNeeded: boolean = true;
	@Input() models: any[] = null;
	@Input() dataUrl: string;
	@Input() countUrl: string;
	@Input() checked: boolean = false;
	@Input() paginated: boolean = true;
	@Input() paginatorRanges: number[] = [5, 10, 20, 30, 50, 100];
	@Input() defaultRange = 20;
	@Input() dummyRange = 3;
	@Input() ndActionShow = false;
	@Input() ndActionText = "click here to add new item";
	@Input() showSelectedRow = true;
	@Input() responsive: boolean = true;
	@Input() dataHeader: string = "items";
	@Input() primaryListing: boolean = false;
	@Input() selectedPage = 1;
	@Input() filterEnabled: boolean = true;
	@Input() showTableFilter: boolean = false;
	@Input() showColumnFilter: boolean = true;
	@Input() isModel = false;
	@Input() selectMultiple = true;
	@Input() preFetchPages = 1;
	@Output() onRowChecked: EventEmitter<{
		model: any;
		checked: boolean;
	}> = new EventEmitter<{ model: any; checked: boolean }>();
	@Output() allCheckedRows: EventEmitter<any> = new EventEmitter<any>();
	@Output() onRowSelected: EventEmitter<{
		model: any;
		checked: boolean;
		selected: boolean;
	}> = new EventEmitter<{ model: any; checked: boolean; selected: boolean }>();
	@Output() onAllRowsChecked: EventEmitter<{
		model: any;
		checked: boolean;
	}> = new EventEmitter<{ model: any; checked: boolean }>();
	@Output() onAllRowsSelected: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Output() dataChange: EventEmitter<any> = new EventEmitter<any>();
	@Output() pageChange: EventEmitter<any> = new EventEmitter<{ page: number }>();
	@Output() ndAction: EventEmitter<any> = new EventEmitter<any>();
	@Input() selectPage: boolean = false;
	@Input() loading: boolean = false;
	@Output() checkedPksNew: EventEmitter<any> = new EventEmitter<any>();
	@Output() filterParams: EventEmitter<any> = new EventEmitter<any>();

	@Input() apiClass: any;
	@Input() apiMethod = "GET";
	@Input() postBody: any = {};
	@Input() searchDB = true;
	@Input() preFilters: any;
	@Input() primaryKey: any;
	customFilter: any;
	customFilters: any;
	checkedRows: any = [];
	checkedPKs: any = [];
	@Input() inputCheckedPKs: any = [];
	@Input() removeVariable = false;
	@Output() range: EventEmitter<any> = new EventEmitter<any>();
	selectedRowCount: number = 0;
	@Input() showTotal: boolean = false;

	private operators = ['>', '<', '>=', '<='];

	constructor(
		private _viewContainer: ViewContainerRef,
		public changeDetector: ChangeDetectorRef,
		private apiService: ApiService) {
		this.loading = !this.loading && !this.models ? true : this.loading;
		this.filterInput = new FormControl("");
	}

	ngOnInit() {
		this.dummyRows = [1, 2, 3];
		if (this.paginated) {
			this.dummyRows = [];
			for (let i = 0; i < this.defaultRange; i++) {
				this.dummyRows.push(i);
			}
		}
		else {
			this.dummyRows = [];
			for (let i = 0; i < this.dummyRange; i++) {
				this.dummyRows.push(i);
			}
		}
	}

	ngAfterContentInit() {
		if (!this.preFilters && this.apiLevel != 5) {
			this.preFilters = {};
		}
		if (!this.apiClass) {
			this.apiClass = this.apiService;
		}
		if (!this.dataHeader) {
			this.dataHeader = "persons";
		}

		if (!this.paginatorComponent.selectedRange) {
			this.paginatorComponent.selectedRange = this.defaultRange;
		}

		if (!this.models && this.dataUrl) {
			this._queryTableData().then(() => { }, () => { });
		} else {
			this._updateRows();
			if (this.showTotal) {
				this.setTotalRow();
			}
		}
		this._columnsSubscription = this.columns.changes.subscribe(() => {
			this._updateRows();
			this.changeDetector.markForCheck();
		});

		if (this.removeVariable == true) {
			this.checkedPKs = this.inputCheckedPKs;
			this._updateVisibleRows();
		}

		this.filterInput.valueChanges.pipe(
			debounceTime(400),
			distinctUntilChanged())
			.subscribe(() => {
				if (this.paginatorComponent) {
					this.paginatorComponent.reset();
				}
				this._queryTableData().then(() => { }, () => { });
			});

		this.columns.forEach(column => {
			if (column.filterable) {
				this.columnFilterInputs[column.id] = new FormControl(
					this.columnFilterInputsValues
						? this.columnFilterInputsValues[column.field]
							? this.columnFilterInputsValues[column.field]
							: ""
						: ""
				);
				this.columnFilterInputs[column.id].valueChanges.pipe(
					debounceTime(400),
					distinctUntilChanged())
					.subscribe(() => {
						if (this.paginatorComponent) {
							this.paginatorComponent.reset();
						}
						this._queryTableData().then(() => { }, () => { });
					});
			}
		});
	}

	rangeChanged(selectedRange) {
		this.range.emit(selectedRange);
		this.refresh();
	}
	ngOnDestroy(): void {
		this._columnsSubscription.unsubscribe();
	}

	newRecord() {
		this.ndAction.emit({ clicked: true });
	}

	_updateRows() {
		if (this.models) {
			this.rows.length = 0;
			try {
				this.models.forEach(
					(model: any, index: number) =>
						(this.rows[index] = new SmdDataRowModel(model, false))
				);
				this.rows.forEach((row, index) => (row.originalOrder = index));
				this._setSelectedRows();
				this._updateVisibleRows();
			} catch (error) { console.log(error) }
		}
	}

	_updateRowsFromList(models) {
		if (models) {
			this.rows.length = 0;
			try {
				models.forEach(
					(model: any, index: number) =>
						(this.rows[index] = new SmdDataRowModel(model, false))
				);
				this.rows.forEach((row, index) => (row.originalOrder = index));
				this._setSelectedRows();
				this._updateVisibleRows();
			} catch (error) { }
		}
	}

	_matches(
		columns: SmdDataTableColumnComponent[],
		text: string
	): boolean {
		if (isNullOrUndefined(text) || text.trim() == "") {
			return true;
		}

		let subtexts: string[] = text.trim().split(" ");
		for (let { } of subtexts) {
			for (let column of columns) {
				if (column.hasCustomTemplate) {
					// filterFn = column.filterFn ? column.filterFn : (value: any, text: string) => false;
				}
				// if (filterFn(value, subtext)) {
				//   return true;
				// }
			}
		}
		return false;
	}

	selectedRows(): SmdDataRowModel[] {
		return this.rows.filter(row => row.checked);
	}

	selectedModels(): any[] {
		return this.selectedRows().map(row => row.model);
	}

	_selectedModels(): Observable<any>[] {
		return this.selectedRows().map(row => row.model);
	}

	_onMasterCheckChange() {
		if (this.selectPage == true) {
			this.visibleRows.forEach((row: SmdDataRowModel) => {
				if (row.checked != this.checked) {
					row.checked = this.checked;
					this.selectedRowCountFn(row);
				}
			});
		}
		else {
			this.rows.forEach((row: SmdDataRowModel) => {
				if (row.checked != this.checked) {
					row.checked = this.checked;
					this.selectedRowCountFn(row);
				}
			});
		}
		this.onAllRowsSelected.emit(this.checked);
		this.onAllRowsChecked.emit({
			model: this.visibleRows,
			checked: this.checked
		});
	}

	selectedRowCountFn(row) {
		if (this.primaryKey) {
			let pK = "";
			this.primaryKey.forEach((primKey) => {
				pK = pK + "," + row.model[primKey].toString();
			});
			var idx = this.checkedPKs.indexOf(pK);
			if (idx != -1) {
				this.selectedRowCount--;
				this.checkedPKs.splice(idx, 1);
				this.checkedRows.splice(idx, 1);
				let checkedArr = {
					checkedPks: this.checkedPKs,
					checkedList: this.checkedRows
				};
				this.checkedPksNew.emit({ checkedArr: checkedArr });
			}
			if (row.checked) {
				this.selectedRowCount++;
				this.checkedRows.push(row.model);
				this.checkedPKs.push(pK);
				let checkedArr = {
					checkedPks: this.checkedPKs,
					checkedList: this.checkedRows
				};
				this.checkedPksNew.emit({ checkedArr: checkedArr });
			}
		}
	}

	_onRowCheckChange(row: SmdDataRowModel) {
		if (this.selectMultiple) {
			let isMasterChecked = this.checked;
			this.selectedRowCountFn(row);
			let checkedRows = [];
			this.rows
				.filter(row => row.checked == true)
				.forEach(row => checkedRows.push(row.model));
			this.allCheckedRows.emit(checkedRows);
			if (row.checked) {
				if (this.rows.filter(row => row.checked).length == this.rows.length) {
					this.checked = true;
				}
			} else {
				if (this.checked) {
					this.checked = false;
				}
			}
			this.onRowSelected.emit({
				model: row.model,
				checked: row.checked,
				selected: false
			});
			this.onRowChecked.emit({
				model: row.model,
				checked: row.checked
			});

			if (this.checked != isMasterChecked) {
				this.onAllRowsSelected.emit(this.checked);
			}

			if (this.checked != isMasterChecked) {
				this.onAllRowsChecked.emit({
					model: this.visibleRows,
					checked: this.checked
				});
			}
		} else {
			if (row.checked && this.lastSelected && this.lastSelected.checked) {
				this.lastSelected.checked = false;
				this.lastSelected = row;
			}
			let isMasterChecked = this.checked;
			this.selectedRowCountFn(row);
			let checkedRows = [];
			this.rows
				.filter(row => row.checked == true)
				.forEach(row => checkedRows.push(row.model));
			this.allCheckedRows.emit(checkedRows);
			if (row.checked) {
				if (this.rows.filter(row => row.checked).length == this.rows.length) {
					this.checked = true;
				}
			} else {
				if (this.checked) {
					this.checked = false;
				}
			}
			this.onRowSelected.emit({
				model: row.model,
				checked: row.checked,
				selected: false
			});
			this.onRowChecked.emit({
				model: row.model,
				checked: row.checked
			});

			if (this.checked != isMasterChecked) {
				this.onAllRowsSelected.emit(this.checked);
			}

			if (this.checked != isMasterChecked) {
				this.onAllRowsChecked.emit({
					model: this.visibleRows,
					checked: this.checked
				});
			}
			if (!this.lastSelected) {
				this.lastSelected = row;
			}
		}
	}

	_onRowSelection(event, row: SmdDataRowModel, selected: false) {
		if (this.showSelectedRow) {
			if (this.selectedRow) {
				this.selectedRow.selected = false;
			}
			row.selected = true;
			this.selectedRow = row;
		}
		if (event.ctrlKey) {
			this._onRowCheckChange(row);
		}
		this.onRowSelected.emit({
			model: row.model,
			checked: row.checked,
			selected: selected
		});
	}

	_onFilter(): void {
		this.paginatorComponent.reset();
		this._updateRows();
	}

	_sortColumn(column: SmdDataTableColumnComponent) {

		if (this.dataHeader && this.dataUrl) {
			if (column.sortable) {
				this.columns
					.filter(col => col.id != column.id)
					.forEach(col => (col.sortDir = null));
				if (!column.sortDir) {
					column.sortDir = "ASC";
				} else {
					column.sortDir = column.sortDir == "ASC" ? "DESC" : null;
				}
				this.sortDirection = column.sortDir;
				this.sortField = column.field;
				this._queryTableData().then(() => { }, () => { });
			}
		} else {
			let itrateModel = [];
			if (!this.filteredModels) {
				itrateModel = this.models;
			} else {
				itrateModel = this.filteredModels;
			}
			let sortedModel = [];
			sortedModel = CommonUtilities.sortByKey(itrateModel, column.field);
			if (!column.sortDir) {
				column.sortDir = "ASC";
				this._updateRowsFromList(sortedModel);
			} else if (column.sortDir == "ASC") {
				column.sortDir = "DESC"
				this._updateRowsFromList(sortedModel.reverse());
			} else {
				column.sortDir = null;
				this._updateRowsFromList(sortedModel);
			}


		}
	}

	_sortRows(a: any, b: any, sortDir: string = "ASC") {
		let dir = sortDir == "ASC" ? 1 : -1;
		if (a > b) {
			return 1 * dir;
		}
		if (a < b) {
			return -1 * dir;
		}
		return 0;
	}

	_onPageChange() {
		if (
			this.paginatorComponent.currentPage.page < this.lastQueryExecutedPage ||
			this.paginatorComponent.currentPage.page >=
			this.lastQueryExecutedPage + this.preFetchPages
		) {
			this._queryTableData().then(
				() => {
					this._updateVisibleRows();
					this.pageChange.emit({
						page: this.paginatorComponent.currentPage.page
					});
				},
				() => { }
			);
		} else {
			this._updateVisibleRows();
			this.pageChange.emit({ page: this.paginatorComponent.currentPage.page });
		}
	}

	_columnTemplates() {
		return this.columns.toArray().map(c => c.template);
	}

	_onCustomSearch(params: HttpParams): void {
		if (params.get("filter")) {
			if (params.get("advancedFilter") && params.get("advancedFilter") != "") {
				let filter = {
					type: "group",
					con: "and",
					items: JSON.parse(params.get("filter"))
				};
				this.customFilter = {
					type: "group",
					con: "and",
					items: [filter, params.get("advancedFilter")]
				};
			} else {
				this.customFilter = {
					type: "group",
					con: "and",
					items: JSON.parse(params.get("filter"))
				};
			}
		} else if (
			params.get("advancedFilter") &&
			params.get("advancedFilter") != ""
		) {
			this.customFilter = params.get("advancedFilter");
		} else { this.customFilter = null; }
		this.customFilters = params.get("filters")
			? JSON.parse(params.get("filters"))
			: null;
		this.params = params;
		this.paginatorComponent.reset();
		if (
			!(
				this.paginatorComponent.currentPage.page < this.lastQueryExecutedPage ||
				this.paginatorComponent.currentPage.page >=
				this.lastQueryExecutedPage + this.preFetchPages
			)
		) {
			this._queryTableData().then(
				() => {
					this._updateVisibleRows();
				},
				() => { }
			);
		}
	}

	public refresh(model: any[] = null) {
		if (model) {
			this.models = model;
			if (this.dataHeader && this.dataUrl || !this.filterEnabled || !this.showColumnFilter) {
				this.setTotalRow();
				this._updateRows();
			}
			else {
				this._queryTableData().then(() => { }, () => { });
			}
		} else {
			this._queryTableData().then(() => { }, () => { });
		}
	}

	public filterTable() {
		if (this.paginatorComponent) {
			this.paginatorComponent.currentPage.page = 1;
			this.selectedPage = 1;
		}
		this._queryTableData().then(() => { }, () => { });
	}

	private _queryTableData(): Promise<any> {
		return new Promise((resolve, reject) => {
			this.loading = true;
			const size = this.paginatorComponent.currentPage.size
				? this.paginatorComponent.currentPage.size
				: this.defaultRange;
			let page: number =
				this.paginatorComponent.currentPage.page - this.preFetchPages / 2 <= 0
					? 1
					: Math.round(
						this.paginatorComponent.currentPage.page -
						this.preFetchPages / 2
					);
			let offset = (page - 1) * size;
			let limit: number = this.preFetchPages * size;

			if (this.dataHeader && this.dataUrl) {
				this.token = Math.random();
				let filterconditions = [];
				let queryParams = '';
				if (this.apiLevel == 4) {
					let filter = this.customFilter ? [this.customFilter] : [];
					let andFilters = {};
					let filters = this.customFilters ? this.customFilters : {};
					if (this.filterEnabled) {
						let andGrp = {
							type: "group",
							con: "and",
							items: []
						};
						let orGrp = {
							type: "group",
							con: "and",
							items: []
						};
						this.columns.forEach(column => {
							if (column.filterable) {
								if (
									this.columnFilterInputs[column.id] &&
									this.columnFilterInputs[column.id].value
								) {
									andGrp.items.push({
										type: "item",
										con: "and",
										operator: "startsWith",
										attr: column.field,
										value: this.columnFilterInputs[column.id].value.toLowerCase()
									});
									andFilters[column.field] = this.columnFilterInputs[
										column.id
									].value.toLowerCase();
								}
								if (column.filterable && this.filterInput.value) {
									orGrp.items.push({
										type: "item",
										con: "or",
										operator: "startsWith",
										attr: column.field,
										value: this.filterInput.value.toLowerCase()
									});
									filters[column.field] = this.filterInput.value.toLowerCase();
								}
							}
						});
						if (andGrp.items.length > 0) {
							filter.push(andGrp);
						}
						if (orGrp.items.length > 0) {
							filter.push(orGrp);
						}
						this.filterParams.emit(andFilters);
					}
					for (let key of Object.keys(this.preFilters)) {
						andFilters[key] = this.preFilters[key] + "<?EQ>";
					}

					if (this.apiMethod == "GET") {

						this.params = this.params.set("filter", JSON.stringify(filter));
						this.params = this.params.set("filters", JSON.stringify(filters));
						this.params = this.params.set("andFilters", JSON.stringify(andFilters));

						this.params = this.params.set("offset",  offset.toString());
						this.params = this.params.set("limit", limit.toString());
						if (this.sortDirection != null) {
							this.params = this.params.set("sort",  this.sortField);
							this.params = this.params.set("direction", this.sortDirection);
						} else {
							this.params = this.params.delete("sort");
							this.params = this.params.delete("direction");
						}
					}
					else if (this.apiMethod == "POST") {
						this.postBody.filter = filter;
						this.postBody.filters = filters;
						this.postBody.andFilters = andFilters;
						this.postBody.offset = offset + 1;
						this.postBody.limit = limit;
						if (this.sortDirection != null) {
							this.postBody.sort = this.sortField;
							this.postBody.direction = this.sortDirection;
						} else {
							if (this.postBody.sort) { delete this.postBody.sort; }
							if (this.postBody.direction) { delete this.postBody.direction; }
						}
					}
				}
				else {
					if (this.preFilters)
						filterconditions = this.preFilters.split(';');
					this.columns.forEach(column => {
						if (column.filterable) {
							if (
								this.columnFilterInputs[column.id] &&
								this.columnFilterInputs[column.id].value
							) {
								let containsOp = false;
								this.operators.forEach(op => {
									if (this.columnFilterInputs[column.id].value.indexOf(op) == 0) {
										containsOp = true;
										return;
									}
								});
								filterconditions.push(column.field + (!containsOp ? ' LIKE ' : ' ') + this.columnFilterInputs[column.id].value + (!containsOp ? '%' : ''));
							}
						}
					});
					queryParams = 'limit=' + limit + '&offset=' + offset + (filterconditions.length > 0 ? '&q=' + filterconditions.join(';') : '')
						+ (this.sortDirection != null ? '&orderBy=' + this.sortField + ':' + this.sortDirection.toLowerCase() : '');
				}
				if (this.apiMethod == "GET") {
					if (this.apiLevel == 4) {
						this.apiClass
							.get('/' + this.dataUrl, this.apiLevel == 4 ? this.params : queryParams , this.token)
							.subscribe(
								data => {
									this.processGetReponse(data, page, offset, limit).then(resolve, reject);
									this.loading = false;
								},
								() => {
									this.loading = false;
									reject();
								}
							);
					}
					else {
						this.apiClass
							.get('/' + this.dataUrl + (this.dataUrl.indexOf('?') == -1 ? '?' : '&') + queryParams, this.token)
							.subscribe(
								data => {
									this.processGetReponse(data, page, offset, limit).then(resolve, reject);
									this.loading = false;
								},
								() => {
									this.loading = false;
									reject();
								}
							);
					}
				} else if (this.apiMethod == "POST") {
					this.apiClass
						.post('/' + this.dataUrl, this.postBody, this.token)
						.subscribe(
							data => {
								if (data.status && typeof data.status === "number") {
									if (data.status == 200) {
										data = data.data;
									} else {
										reject();
									}
								}
								if (this.token == data.token) {
									this.lastQueryExecutedPage = page;
									this.models = data[this.dataHeader];
									this.rowCount = data.count;
									this._updateRows();
									this.dataChange.emit({
										offset: offset,
										limit: limit,
										data: data,
										columnFilterValues: this.getColumnFilterInputValues()
									});
									resolve();
								} else {
									reject();
								}
								this.loading = false;
							},
							() => {
								this.loading = false;
								reject();
							}
						);
				}
			} else {
				if (this.models) {
					this.filteredModels = JSON.parse(JSON.stringify(this.models));
					let tempModels = [];
					this.loading = true;
					if (this.columns) {
						this.columns.forEach((column) => {
							if (column.filterable) {
								if (this.columnFilterInputs[column.id] && this.columnFilterInputs[column.id].value) {
									let value = this.columnFilterInputs[column.id].value;
									value = value.toLowerCase();
									let field = column.field;
									console.log(column.field)
									this.filteredModels.forEach((model) => {
										if (model.hasOwnProperty("unfiltered") && model.unfiltered == true) {
											tempModels.push(model);
										} else if (model.hasOwnProperty(field)) {
											if (typeof model[field] == "object" && CommonUtilities.searchInObj(model[field], value)) { tempModels.push(model); }
											else if (typeof model[field] == "string" && CommonUtilities.searchInString(model[field], value)) { tempModels.push(model); }
											else if (Array.isArray(model[field]) && CommonUtilities.searchInArray(model[field], value)) { tempModels.push(model); }
											else if (typeof model[field] == "number" && CommonUtilities.searchInString(model[field].toString(), value)) { tempModels.push(model); }
										}
									});
									this.filteredModels = JSON.parse(JSON.stringify(tempModels));
									tempModels = [];
								}
							}
						});
					}
					this.rowCount = this.filteredModels.length;
					this._updateRowsFromList(this.filteredModels);

					this.dataChange.emit({ rowCount: this.rowCount });
					this.loading = false;
					this.setTotalRow();
					resolve();
				} else {
					this.loading = false;
					reject();
				}
			}
		});
	}

	private processGetReponse(data, page, offset, limit) {
		return new Promise((resolve, reject) => {
			if (this.showTotal) {
				this.setTotalRow(data);
			}
			if (data.status != "S") {
				reject();
			}
			if (this.token == data.token) {
				this.lastQueryExecutedPage = page;
				this.models = data[this.dataHeader];
				this.paginatorComponent.hasMore = data.hasMore;
				if (data.count) {
					this.rowCount = data.count;
				} else if (data[this.dataHeader]) {
					this.dummyRowCount =
						data[this.dataHeader].length - 1 + "+";
					this.rowCount = data[this.dataHeader].length - 1;
					if (this.countUrl) {
						// count
						this.apiClass
							.get("/" + this.countUrl, this.params, this.token)
							.subscribe(
								data => {
									if (this.token == data.token) {
										if (data.count) {
											this.dataChange.emit({
												rowCount: data.count
											});
											this.rowCount = data.count;
											delete this.dummyRowCount;
										}
										resolve();
									} else {
										reject();
									}
									this.loading = false;
								},
								() => {
									this.loading = false;
									reject();
								}
							);
						// count
					}
				}
				this._updateRows();
				this.checkedPKs = this.inputCheckedPKs;
				this._updateVisibleRows();
				this.dataChange.emit({
					offset: offset,
					limit: limit,
					data: data,
					columnFilterValues: this.getColumnFilterInputValues()
				});
				resolve();
			} else {
				reject();
			}
		});
	}

	public clearAllFilters() {
		if (this.columns) {
			this.columns.forEach(column => {
				if (
					this.columnFilterInputs[column.id] &&
					this.columnFilterInputs[column.id].value
				) {
					this.columnFilterInputs[column.id].setValue("");
				}
			});
		}
	}

	public resetPage() {
		this.paginatorComponent.reset();
	}

	public setColumnFilterInputValues(columnFilterInputValues) {
		this.columnFilterInputsValues = columnFilterInputValues;
	}

	public getColumnFilterInputValues() {
		let values: any[] = [];
		if (this.columns) {
			this.columns.forEach(column => {
				if (
					this.columnFilterInputs[column.id] &&
					this.columnFilterInputs[column.id].value
				) {
					values[column.field] = this.columnFilterInputs[column.id].value;
				}
			});
		}
		return values;
	}

	private _updateVisibleRows() {
		if (this.paginated) {
			this.visibleRows = this.rows.filter(
				(value: SmdDataRowModel, index: number) =>
					this.paginatorComponent.currentPage.isInsidePage(
						index +
						(this.lastQueryExecutedPage - 1) *
						this.paginatorComponent.currentPage.size
					)
			);
		} else {
			this.visibleRows = this.rows;
		}
		this._setHeaderCheckBox();
		if (this.primaryKey) {
			this.visibleRows.forEach(row => {
				let pK = "";
				this.primaryKey.forEach((primKey, i) => {
					pK = pK + "," + row.model[this.primaryKey[i]].toString();
				});
				if (this.checkedPKs.indexOf(pK) != -1) { row.checked = true; }
			});
		}
		this.selectedRowCount = this.checkedPKs.length;
	}

	private _setSelectedRows() {
		if (this.checked) {
			this.visibleRows.forEach((row: SmdDataRowModel) => {
				row.checked = true;
			});
		}
	}
	private _setHeaderCheckBox() {
		let flag = false;
		if (this.visibleRows && this.visibleRows.length > 0) { flag = true; }
		this.visibleRows.forEach((row: SmdDataRowModel) => {
			if (!row.checked) {
				flag = false;
			}
		});
		this.checked = flag;
	}

	_shouldRenderCheckbox() {
		return this.showCheckBox;
	}

	ngAfterContentChecked() {
		if (this.primaryListing) {
			let domTable = this._viewContainer.element.nativeElement;
			let tr = domTable.querySelectorAll(
				".smd-table-body > table > tbody > tr"
			)[0];
			if (tr) {
				let rowsHeight = (this.loading ? this.dummyRows.length * 27 : this.visibleRows.length * tr.offsetHeight) + 26 + (this.showTotal ? 27 : 0);
				let viewHeight =
					domTable.offsetHeight -
					(this.paginated
						? this.paginatorComponent.nativeElement.nativeElement.offsetHeight +
						28
						: 0);
				domTable.parentElement.classList.add('primary-listing');
				this.tableHeight = viewHeight < rowsHeight ? viewHeight : rowsHeight;
				let tds = tr.querySelectorAll("td");
				this.columns.forEach((column: SmdDataTableColumnComponent, index) => {
					if (this.paginated) { index++; }
					column.headerWidth =
						tds[index].offsetWidth - (column.title == " " ? 20 : 16);
				});
			}
		}
	}

	setColumnFiltersExplicitly(columnFilters: any[]) {
		const keys: string[] = Object.keys(columnFilters);
		const filters = keys.map(key => {
			return {
				field: key,
				value: columnFilters[key]
			};
		});
		filters.forEach(filter => {
			const id: string = this.getIdOfColumns(filter.field);
			this.columnFilterInputs[id].setValue(filter.value);
		});
	}

	getIdOfColumns(field: string): string {
		return this.columns
			.toArray()
			.filter(column => {
				return field === column.field;
			})
			.map(column => {
				return column.id;
			})[0];
	}

	getParams() {
		return this.params;
	}

	setTotalRow(data?) {
		this.totalRow = [];
		if (this.columns) {
			let i = this.showCheckBox ? 1 : 0;
			this.columns.forEach(column => {
				this.totalRow[i] = '';
				if (data && column.totalField) {
					this.totalRow[i] = data[column.totalField];
				} else if (column.total) {
					this.totalRow[i] = column.total;
				} else if (column.summable) {
					if (this.models && !this.filteredModels) {
						this.filteredModels = this.models;
					}
					if (this.filteredModels) {
						let total = 0;
						this.filteredModels.forEach(model => {
							let value = model[column.field];
							if (isNaN(value)) {
								value = value.replace(',', '');
							}
							if (value && !isNaN(value)) {
								total += Number(value);
							}
						});
						this.totalRow[i] = total;
					}
				}
				if (column.round) {
					let total = this.totalRow[i];
					if (!isNaN(total) && !isNaN(column.round)) {
						total = Number(total).toFixed(column.round);
					}
					this.totalRow[i] = total;
				}

				i++;
			});
			this.totalRow[0] = 'Total';
		}
	}

	findIndexFromField(field) {
		let i = 0;
		this.columns.forEach((column, index) => {
			if (column.field == field) {
				i = index;
			}
		});
		return i + 1;
	}

	getTotal(field) {
		let i = this.findIndexFromField(field)
		return this.totalRow[i];
	}

	setTotal(field, value) {
		let i = this.findIndexFromField(field)
		this.totalRow[i] = value;
	}
}
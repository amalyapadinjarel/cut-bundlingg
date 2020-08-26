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
	HostListener,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { isNullOrUndefined } from 'util';

import { SmdPaginatorComponent } from '../smd-paginator/paginator.component';
import { CommonUtilities } from 'app/shared/utils/common.utility';
import { ApiService, LocalCacheService } from '../../../services';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';
import { TnzInputService } from 'app/shared/tnz-input/_service/tnz-input.service';

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
		if (this.childView)
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
	tempColumns: any = [];
	constructor(@Inject(forwardRef(() => SmdDataTable)) public _parent: SmdDataTable) {

	}
	ngOnInit(): void {
		this.columns.forEach(column => {
			if (column.SubColumns.length == 0)
				this.tempColumns.push(column);
			else {
				column.SubColumns.forEach(subColumns => {
					this.tempColumns.push(subColumns);
				})
			}
		});
		if (this._parent.hasSubheader)
			this.columns = this.tempColumns;
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

	//added on aug 13
	@Input() showCheckBox: boolean = false;

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
	@ContentChildren(SmdDataTableColumnComponent) SubColumns: QueryList<SmdDataTableColumnComponent>;
	@Output() onFieldChange: EventEmitter<any> = new EventEmitter<any>();

	checked = false;

	get template() {
		return this._customTemplate ? this._customTemplate : this._internalTemplate;
	}

	get hasCustomTemplate(): boolean {
		return !!this._customTemplate;
	}

	constructor(@Inject(forwardRef(() => SmdDataTable)) private _parent: SmdDataTable | any) {
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

	_onChecked(eve) {
		this._parent._checkAllInColumn(this.field, this.checked ? 'Y' : 'N');
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
	selector: "smd-datatable-icon-button",
	template: `
  <button mat-icon-button>
  <mat-icon>{{icon}}</mat-icon>
  </button>
  `
})
export class SmdDatatableIconButton {
	@Input() icon: string;
	@Input() key: string;
	@Input() tooltip: string;
	@Input() class: string;
	constructor(@Inject(forwardRef(() => SmdDataTable)) private _parent: SmdDataTable | any) {
	}

	ngOnInit(): void {
		if (!this.tooltip) {
			this.tooltip = this.key;
		}
		if (!this.icon) {
			throw new Error('Icon is mandatory on smd-datatable-icon-button');
		}
		if (!this.key) {
			throw new Error('Key is mandatory on smd-datatable-icon-button');
		}
	}


}

@Component({
	selector: "smd-datatable-menu-button",
	template: `
  <button mat-icon-button>
  <mat-icon>{{icon}}</mat-icon>
  </button>
  `
})
export class SmdDatatableMenuButton {
	@Input() icon: string;
	@Input() options = [];
	@Input() tooltip: string;
	@Input() class: string;
	constructor(@Inject(forwardRef(() => SmdDataTable)) private _parent: SmdDataTable | any) {
	}

	ngOnInit(): void {
		if (!this.icon) {
			throw new Error('Icon is mandatory on smd-datatable-menu-button');
		}
		if (!this.options || this.options.length == 0) {
			throw new Error('Options is mandatory on smd-datatable-menu-button');
		}
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
		"[class.primary-listing]": "isPrimaryListing"
	}
})
export class SmdDataTable
	implements AfterContentInit, OnDestroy {
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
	tableMargin: number;
	private token;
	private lastSelected;
	filteredModels: any[];

	filterInput: FormControl;
	columnFilterInputs: FormControl[] = [];

	@ViewChild(SmdPaginatorComponent, { static: true }) paginatorComponent: SmdPaginatorComponent;
	@ContentChildren(SmdDataTableColumnComponent) columns: QueryList<SmdDataTableColumnComponent>;
	@ContentChildren(SmdDatatableIconButton) iconButtons: QueryList<SmdDatatableIconButton>;
	@ContentChildren(SmdDatatableMenuButton) menuButtons: QueryList<SmdDatatableMenuButton>;
	@Input() tableId: string;
	@Input() inputPath: string;
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
	@Input() sortEnabled: boolean = true;
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
	@Output() onAction: EventEmitter<any> = new EventEmitter<any>();
	@Input() selectPage: boolean = false;
	@Input() loading: boolean = false;
	@Output() filterParams: EventEmitter<any> = new EventEmitter<any>();

	@Input() apiClass: any;
	@Input() apiMethod = "GET";
	@Input() postBody: any = {};
	@Input() searchDB = true;
	@Input() preFilters: any;
	customFilter: any;
	customFilters: any;
	@Output() range: EventEmitter<any> = new EventEmitter<any>();
	selectedRowCount: number = 0;
	@Input() showTotal: boolean = false;
	headerColumns: any;
	subHeaderColums: any = [];
	tempColumns: any = [];
	hasSubheader: Boolean = false;
	columnValueChanges: Boolean = false;
	private checkedRows: any = [];
	@Input() scrollType: any = 'page';
	@Input() fetchAll = false;
	private originalPreFetchPages = 1;
	isHeaderReady = false;
	@Input() primaryKey = null;
	@Input() title;
	@Input() filterToggled: boolean = false;
	
	get isPrimaryListing() {
		return this.primaryListing || (this.scrollType == 'scroll');
	}

	constructor(
		private _viewContainer: ViewContainerRef,
		public changeDetector: ChangeDetectorRef,
		private apiService: ApiService,
		private _cache: LocalCacheService,
		private _inputService: TnzInputService //shery
	) {
		this.loading = !this.loading && !this.models ? true : this.loading;
		this.filterInput = new FormControl(this.getCachedConfig('filter') || "");
	}

	private getCachedConfig(path) {
		return this.tableId ? this._cache.getCachedValue('datatables.' + this.tableId + '.' + path) : undefined;
	}

	private setCachedConfig(path, value) {
		if (this.tableId)
			this._cache.setLocalCache('datatables.' + this.tableId + '.' + path, value);
	}

	@HostListener('window:resize')
	onResize() {
		this.setTableDimentions();
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
		if (this.primaryListing) {
			this.filterToggled = true;
		}
		if (this.scrollType == 'scroll') {
			this.paginated = false;
		}
		if (!this.preFilters) {
			this.preFilters = {};
		}
		if (!this.apiClass) {
			this.apiClass = this.apiService;
		}
		if (!this.dataHeader) {
			this.dataHeader = "persons";
		}
		this.originalPreFetchPages = this.preFetchPages;
		this.selectedPage = parseInt(this.getCachedConfig('page') || 1);
		this.lastQueryExecutedPage = this.selectedPage;

		if (this.paginated) {
			this.paginatorComponent.selectedPage = this.selectedPage;
			if (!this.paginatorComponent.selectedRange) {
				this.paginatorComponent.selectedRange = this.defaultRange;
			}
		}

		this.filterInput.valueChanges.pipe(
			debounceTime(400),
			distinctUntilChanged())
			.subscribe((value) => {
				this.setCachedConfig('filter', value)
				this.resetPage();
				this._queryTableData().then(() => { }, () => { });
			});

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

		this.columns.changes.subscribe(data => {
			let temp: any = [];
			this.columnValueChanges = true;
			data.forEach(column => {
				if (column.SubColumns && column.SubColumns.length > 0) {
					column.SubColumns.forEach(subColumn => {
						temp.push(subColumn);
						this.hasSubheader = true;
					})
				} else {
					temp.push(column);
				}
			});
			if (this.hasSubheader) {
				this.tempColumns = temp;
				this.columns = this.tempColumns;
			}
		});
		if (!this.columnValueChanges) {
			this.columns.forEach(column => {
				if (column.SubColumns && column.SubColumns.length > 0) {
					column.SubColumns.forEach(subColumn => {
						this.tempColumns.push(subColumn);
						this.setSubHeaderColumns(subColumn);
						this.hasSubheader = true;
					})
				} else {
					this.tempColumns.push(column);
				}
			});
			if (this.hasSubheader) {
				this.headerColumns = this.columns;
				this.columns = this.tempColumns
			}
		}

		this.columns.forEach(column => {
			if (column.filterable) {
				this.columnFilterInputs[column.id] = new FormControl(this.getCachedConfig(column.field + '.filter') || "");
				this.columnFilterInputs[column.id].valueChanges.pipe(
					debounceTime(400),
					distinctUntilChanged())
					.subscribe((value) => {
						this.setCachedConfig(column.field + '.filter', value);
						this.resetPage();
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
					(model: any, index: number) => {
						this.rows[index] = new SmdDataRowModel(model, false)
						this.rows[index].originalOrder = index
					});
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
					(model: any, index: number) => {
						this.rows[index] = new SmdDataRowModel(model, false);
						this.rows[index].originalOrder = model._originalOrder;
					});
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
		return this.checkedRows;
	}

	_selectedModels(): Observable<any>[] {
		return this.selectedRows().map(row => row.model);
	}

	_onMasterCheckChange() {
		if (this.selectPage == true) {
			this.visibleRows.forEach((row: SmdDataRowModel) => {
				if (row.checked != this.checked) {
					row.checked = this.checked;
					this.setCheckedRows(row);
				}
			});
		}
		else {
			this.rows.forEach((row: SmdDataRowModel) => {
				if (row.checked != this.checked) {
					row.checked = this.checked;
					this.setCheckedRows(row);
				}
			});
		}
		this.onAllRowsSelected.emit(this.checked);
		this.onAllRowsChecked.emit({
			model: this.visibleRows,
			checked: this.checked
		});
	}

	setCheckedRows(row) {
		var idx = this.findIndex(this.checkedRows, row.model);
		if (idx != -1) {
			this.selectedRowCount--;
			this.checkedRows.splice(idx, 1);
		}
		else if (row.checked) {
			this.selectedRowCount++;
			this.checkedRows.push(row.model);
		}
	}

	_onRowCheckChange(row: SmdDataRowModel) {
		if (this.selectMultiple) {
			let isMasterChecked = this.checked;
			this.setCheckedRows(row);
			this.allCheckedRows.emit(this.checkedRows);
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
					model: this.checkedRows,
					checked: this.checked
				});
			}
		} else {
			if (row.checked) {
				if (this.lastSelected && !this.equals(this.lastSelected, row)) {
					this.lastSelected.checked = false;
					this.setCheckedRows(this.lastSelected)
				}
				this.lastSelected = row;
			}
			let isMasterChecked = this.checked;
			this.setCheckedRows(row);
			// let checkedRows = [];
			// this.rows
			// 	.filter(row => row.checked == true)
			// 	.forEach(row => checkedRows.push(row.model));
			this.allCheckedRows.emit(this.checkedRows);
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
					model: this.checkedRows,
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

		if (column.sortable && this.sortEnabled) {
			if (this.dataHeader && this.dataUrl) {
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
			} else {
				let itrateModel = [];
				if (!this.filteredModels) {
					itrateModel = this.models;
				} else {
					itrateModel = this.filteredModels;
				}
				let sortedModel = [];
				sortedModel = this.sortByKey(itrateModel, column.field);
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
				if (this.filteredModels) {
					this.filteredModels = sortedModel
				}
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
		this.setCachedConfig('page', this.paginatorComponent.currentPage.page);
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

	_checkAllInColumn(field, value) {

		this.models.forEach((row, index) => {
			this._inputService.updateInput(this.inputPath + '[' + index + '].' + field, value, this.primaryKey);
		})
	}

	public refresh(model: any[] = null) {
		//unchecking column checkbox
		this.columns ?.forEach(data => {
			data.checked = false;
		});

		if (model) {
			this.models = model;
			if (this.dataHeader && this.dataUrl) {
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

	public resetTable() {
		this.resetPage();
		this.clearAllFilters();
	}

	private resetPage() {
		if (this.scrollType == 'scroll') {
			this.preFetchPages = this.originalPreFetchPages;
			this._viewContainer.element.nativeElement.getElementsByClassName('smd-table-body')[0].scrollTop = 0;
		}
		else if (this.paginatorComponent) {
			this.paginatorComponent.selectedPage = 1;
			this.setCachedConfig('page', 1);
		}
	}

	private clearAllFilters() {
		this.filterInput.setValue("", { emitEvent: false });
		this.setCachedConfig('filter', null);
		if (this.columns) {
			this.columns.forEach(column => {
				if (
					this.columnFilterInputs[column.id] &&
					this.columnFilterInputs[column.id].value
				) {
					this.columnFilterInputs[column.id].setValue("", { emitEvent: false });
					this.setCachedConfig(column.field + '.filter', null);
				}
			});
		}
		this._queryTableData().then(() => { }, () => { });
	}

	public setColumnFilterInputValues(columnFilterInputValues) {
		//TODO To be removed
	}

	private getColumnFilterInputValues() {
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

	private _queryTableData(): Promise<any> {
		return new Promise((resolve, reject) => {
			this.loading = true;
			let page: number;
			let offset: number;
			let limit: number;
			if (this.paginated) {
				const size: number = this.paginatorComponent.currentPage.size
					? this.paginatorComponent.currentPage.size
					: this.defaultRange;
				page =
					this.paginatorComponent.currentPage.page - this.preFetchPages / 2 <= 0
						? 1
						: Math.round(
							this.paginatorComponent.currentPage.page -
							this.preFetchPages / 2
						);
				offset = (page - 1) * size;
				limit = this.fetchAll ? -1 : this.preFetchPages * size;
			}
			else {
				page = 1;
				offset = 0;
				limit = this.fetchAll ? -1 : (this.preFetchPages * this.defaultRange) + 3;
			}
			if (this.tempColumns && this.hasSubheader && this.columnValueChanges) {
				this.columns = this.tempColumns;
			}
			if (this.dataHeader && this.dataUrl) {
				this.token = Math.random();
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

					this.params = this.params.set("offset", offset.toString());
					this.params = this.params.set("limit", limit.toString());
					if (this.sortDirection != null) {
						this.params = this.params.set("sort", this.sortField);
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
				if (this.apiMethod == "GET") {
					this.apiClass
						.get('/' + this.dataUrl, this.params, this.token)
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
								if (!data.token || this.token == data.token) {
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
				this.models.forEach((model, index) => {
					model._originalOrder = index;
				})
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
									this.filteredModels.forEach((model, line) => {
										if (model.hasOwnProperty("unfiltered") && model.unfiltered == true) {
											tempModels.push(model);
										} else if (model.hasOwnProperty(field)) {
											let fieldValue = this._cache.getCachedValue(this.inputPath + '[' + line + '].' + field) || model[field];
											if (typeof fieldValue == "object" && CommonUtilities.searchInObj(fieldValue, value)) { tempModels.push(model); }
											else if (typeof fieldValue == "string" && CommonUtilities.searchInString(fieldValue, value)) { tempModels.push(model); }
											else if (Array.isArray(fieldValue) && CommonUtilities.searchInArray(fieldValue, value)) { tempModels.push(model); }
											else if (typeof fieldValue == "number" && CommonUtilities.searchInString(fieldValue.toString(), value)) { tempModels.push(model); }
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
					this.rowCount = data[this.dataHeader].length;
					if (limit && limit != -1) {
						this.paginatorComponent.hasMore = data.hasMore && this.rowCount == limit;
					}
					if (offset)
						this.rowCount += offset
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
		} else if (this.scrollType == 'scroll') {
			this.visibleRows = this.rows.filter(
				(value: SmdDataRowModel, index: number) => {
					return index < (this.preFetchPages * this.defaultRange) + 3;
				}
			);
		} else {
			this.visibleRows = this.rows;
		}
		this._setHeaderCheckBox();
		this.setTableDimentions();
		this.visibleRows.forEach(row => {
			if (this.checkedRows.length)
				if (this.checkIfInsideArray(this.checkedRows, row.model)) { row.checked = true; }
		});
		this.selectedRowCount = this.checkedRows.length;
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

	private setTableDimentions() {
		this.isHeaderReady = false;
		if (this.primaryListing || this.scrollType == 'scroll') {
			let domTable = this._viewContainer.element.nativeElement;
			if (this.primaryListing) {
				domTable.parentElement.style.height = '100%';
			}
			setTimeout(() => {
				let bodyRow = domTable.querySelectorAll(
					".smd-table-body > table > tbody > tr"
				)[0];
				if (bodyRow) {
					let headerHeight = (domTable.querySelectorAll(".smd-table-body > table > thead")[0].offsetHeight) + 2;
					let rowsHeight = ((this.loading ? this.dummyRows.length : (this.scrollType == 'scroll' ? (this.defaultRange < this.visibleRows.length ? this.defaultRange : this.visibleRows.length) : this.visibleRows.length)) * bodyRow.offsetHeight) + headerHeight + (this.showTotal ? 27 : 0);
					// rowsHeight -= 8 
					if (this.primaryListing) {
						let viewWidth = domTable.querySelectorAll(".smd-table-container")[0].offsetWidth
						let tableWidth = domTable.querySelectorAll(".smd-table-body > table")[0].offsetWidth
						let viewHeight =
							domTable.parentElement.offsetHeight - (this.paginated ? this.paginatorComponent.nativeElement.nativeElement.offsetHeight + 1 : 0);
						if (viewWidth < tableWidth)
							viewHeight -= 8
						this.tableHeight = viewHeight < rowsHeight ? viewHeight : rowsHeight;

					}
					else {
						this.tableHeight = rowsHeight;
					}
					this.tableMargin = 0 - (headerHeight + 3);
				}
				else {
					let headerHeight = (domTable.querySelectorAll(".smd-table-body > table > thead")[0].offsetHeight) + 4;
					this.tableHeight = headerHeight;
					this.tableMargin = 0 - headerHeight;
				}
				setTimeout(() => {
					let headerRow = domTable.querySelectorAll(
						".smd-table-body > table > thead > tr"
					)[0];
					if (headerRow) {
						let tds = headerRow.querySelectorAll("th");
						this.columns.forEach((column: SmdDataTableColumnComponent, index) => {
							if (this._shouldRenderCheckbox()) { index++; }
							column.headerWidth = tds[index].offsetWidth - 16;
						});
					}
					this.isHeaderReady = true;
				}, 0);
			}, 0);
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

	setSubHeaderColumns(column: any) {
		if (column) {
			this.subHeaderColums.push(column);
		}
	}

	equals(a, b) {
		if (this.primaryKey) {
			let flag = true;
			this.primaryKey.split(',').forEach(key => {
				if (typeof a[key] == 'undefined' || typeof b[key] == 'undefined' || a[key] !== b[key]) {
					flag = false;
					return;
				}
			});
			return flag;
		}
		else
			return JSON.stringify(a) == JSON.stringify(b)
	}

	checkIfInsideArray(array, object) {
		return this.findIndex(array, object) != -1
	}

	findIndex(array, object) {
		return array.findIndex(row => { return this.equals(row, object) })
	}

	onBodyScroll(event: any) {
		if (event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight) {
			if (this.rows.length >= (this.preFetchPages * this.defaultRange) + 3) {
				this.preFetchPages += 1;
				if (this.dataHeader && this.dataUrl)
					this._queryTableData();
				else
					this._updateVisibleRows();
			}
		}
	}

	toggleFilter() {
		this.filterToggled = !this.filterToggled;
		this.setTableDimentions()
	}

	public sortByKey(array, key) {
		let cachedValue
		if (this.inputPath) {
			cachedValue = this._cache.getCachedValue(this.inputPath)
		}
		return array.sort(function (a, b) {
			var x = a[key]; var y = b[key];
			if (cachedValue) {
				if (cachedValue[a._originalOrder] && cachedValue[a._originalOrder][key]) {
					x = cachedValue[a._originalOrder][key]
				}
				if (cachedValue[b._originalOrder] && cachedValue[b._originalOrder][key]) {
					y = cachedValue[b._originalOrder][key]
				}
			}
			// return ((x < y) ? -1 : ((x > y) ? 1 : 0));
			return (x.localeCompare(y, undefined, { numeric: true }));
		});
	}

	iconAction(key) {
		this.onAction.emit({ key: key })
	}

}
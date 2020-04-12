import { Component, ElementRef, ViewChild, Input, Output, EventEmitter, OnInit, OnChanges, OnDestroy, ɵSWITCH_CHANGE_DETECTOR_REF_FACTORY__POST_R3__ } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { LocalCacheService } from 'app/shared/services';
import { DateUtilities, AutoCompleteUtilities } from 'app/shared/utils';
import { JSONUtils } from 'app/shared/utils/json.utility';
import { TnzInputLOVComponent } from '../input-lov/input-lov.component';
import { TnzInputService } from '../_service/tnz-input.service';
import { Observable } from 'rxjs';
import { URLSearchParams } from '@angular/http';
import { HttpParams } from '@angular/common/http';


@Component({
	selector: 'tnz-input',
	templateUrl: './tnz-input.component.html',
	styleUrls: ['./tnz-input.component.scss']
})
export class TnzInputComponent implements OnChanges, OnDestroy {

	private _value: any;
	private _orgValue: any;
	private _displayValue: any;
	private _app: string;
	private _root: string;
	private _path: string;
	private _key: string;
	private _setters: any;
	private _lovConfig: any;
	private _validators: any;
	private nativeElem;
	private _checked = false;
	private checkboxValues;
	private lovPreFilter;
	private lovSetters;
	private lovUrl;
	private registered = false;

	@Input() title = 'Field';
	@Input() type = 'text';
	@Input() dataType = 'text';
	@Input() nullable = true;
	@Input() isEdit = false;
	@Input() loading = false;
	@Input()
	set value(value: any) {
		this._value = typeof value == 'undefined' ? '' : value;
		this._orgValue = this.value;
		this._displayValue = this.value;
	};
	@Input()
	set path(path: string) {
		let keys = path.split('.');
		this._app = keys[0];
		this._root = keys[1];
		this._key = keys[keys.length - 1];
		this._path = path.substring(this._app.length + this._root.length + 2);
	};
	@Input() displayKey: string;
	@Input() returnKey: string;
	@Input() primaryKey: string;
	@Input() sharedData: any = {};
	@Input() set setters(setters) {
		if (setters) {
			this._setters = setters.split(',');
		}
	};
	@Input() checkType: string = 'Y:N';
	@Input() set lovConfig(config) {
		if (config) {
			this._lovConfig = config;
			if (this.lovConfig.setters) {
				this.lovSetters = this.lovConfig.setters.split(',');
			}
			this.lovUrl = this.lovConfig.url;
		}
	};
	@Input() set validators(validators) {
		if (validators) {
			this._validators = validators.split(',');
		}
	};
	@Input() status: string = 'ok';
	@Input() alert: string;
	@Input() autoCompleteEnabled = true;
	@Input() precision;
	@Input() selectOptions: any = [];

	@Output() valueChanged: EventEmitter<any> = new EventEmitter<any>();
	@Output() valueChangedFromUI: EventEmitter<any> = new EventEmitter<any>();
	@Output() multipleSelected: EventEmitter<any> = new EventEmitter<any>();

	@ViewChild('Element') _element: ElementRef;

	autoCompleteOptions: Observable<any[]>;
	autoCompleteTimeout;

	constructor(
		private _cache: LocalCacheService,
		private _service: TnzInputService,
		private dialog: MatDialog,
		private autoCompleteUtil: AutoCompleteUtilities
	) { }

	get app(): string {
		return this._app;
	}

	get root(): string {
		return this._root;
	}
	get rootPath(): string {
		return this._app + '.' + this._root;
	}

	get path(): string {
		return this._path;
	}

	get key(): string {
		return this._key;
	}

	get value(): any {
		return this._value;
	}

	set checked(checked) {
		this._checked = checked;
	}

	get checked(): any {
		return this._checked;
	}

	get setters() {
		return this._setters;
	}

	get lovConfig() {
		return this._lovConfig;
	}

	get validators() {
		return this._validators;
	}

	get fullPath(): string {
		return this.rootPath + '.' + this.path;
	}

	set displayValue(value) {
		this._displayValue = value;
	}

	get displayValue() {
		if (this.type == 'date' && this.isValidDate(this._displayValue)) {
			return DateUtilities.formatDate(this._displayValue);
		}
		else if (this.dataType == 'number' && this.precision) {
			return Number(this._displayValue).toFixed(this.precision);
		}
		else if (this.displayKey && typeof this._displayValue == 'object') {
			return this._displayValue[this.displayKey];
		}
		else {
			return this._displayValue;
		}
	}

	ngOnDestroy(): void {
		if (this.registered) {
			this._service.registerInput(this.fullPath, null);
		}
	}

	ngOnChanges() {
		if (!this.loading) {
			if (this.lovConfig) {
				if (this.lovConfig.returnKey) this.returnKey = this.lovConfig.returnKey;
				if (this.lovConfig.displayKey) this.displayKey = this.lovConfig.displayKey;
			}
			if (this.type == 'checkbox') {
				this.checkboxValues = this.checkType.split(':');
			} else if (this.type == 'select' && this.lovConfig) {
				this.loadSelectOptions();
			}
			if (this.isEdit) {
				if (!this._service.getSharedData(this.rootPath)) {
					this._service.setSharedData(this.rootPath, this.sharedData);
				}
				if (this.type == 'lov' && this.lovConfig) {
					this.lovPreFilter = this.lovConfig.filter;
					this.setInputValue();
				}
				else if (this.type == 'lov-button' && this.lovConfig) {
					this.lovPreFilter = this.lovConfig.filter;
				}
				else {
					this.setInputValue();
				}
			}
			else {
				this.setInputValue();
			}
			if (!this.registered) {
				this.registered = true;
				this._service.registerInput(this.fullPath, this);
			}
		}
	}

	setValue(value, valueChange = false) {
		let status = 'ok';
		let inValid = false;
		let alert = '';
		if (typeof value == 'undefined') {
			value = '';
		}
		let newValue = value;
		this.displayValue = value;
		if (this.isEdit) {

			if (this.type == 'select' && this.selectOptions) {
				if (this.setters && this.lovSetters) {
					let data = this.selectOptions.filter(option => {
						return option[this.returnKey] == value[this.returnKey];
					});
					this.setters.forEach((element, idx) => {
						this._service.updateInput(this.getFullPathToKey(element), (data.length == 1 ? data[0][this.lovSetters[idx]] : undefined));
					});
				}
				if (this.selectOptions.length == 1) {
					newValue = value = this.selectOptions[0][this.returnKey];
					valueChange = true;
				}
			}
			if (value) {
				if (this.type == 'date') {
					newValue = new Date(value);
				}
				if (this.dataType == 'number' && !Number.isNaN(value)) {
					newValue = Number(value);
				}
			}
		}
		if (this.type == 'select') {
			this.displayValue = this.getLabelFromSelectOptions(value);
		}
		else if (this.type == 'checkbox') {
			this.checked = this.checkboxValues[0] == newValue;
		}
		if (this._orgValue != value) {
			status = 'changed';
		}

		// Validating and setting error message 
		if (valueChange && this.nativeElem && this.nativeElem.value) {
			if (this.dataType == 'number' && newValue != 0 && !newValue) {
				status = 'error';
				alert = 'invalid number.';
				inValid = true;
			}
			else if (this.type == 'date' && !newValue) {
				status = 'error';
				alert += 'invalid date.';
				inValid = true;
			}
		}
		
		this.status = status;
		this.alert = alert;
		this.validateInput(inValid, newValue)
		if (this._value != value) {
			this._value = newValue;
			if (valueChange) {
				if (this.path && this.primaryKey) {
					let primaryPath = this.removeLastDot(this.path, 1);
					let primary = JSONUtils.getJSONPath(this.sharedData, primaryPath + this.primaryKey);
					if (!primary) {
						primary = 0;
					}
					this._cache.setLocalCache(this.getFullPathToKey(this.primaryKey), primary);
					this._cache.setLocalCache(this.fullPath, value);
				}
				this.valueChangedFromUI.emit({ key: this._key, value: this._cache.getCachedValue(this.getFullPathToKey(this._key)), displayValue: this.displayValue, path: this.fullPath });
			}
			this.valueChanged.emit({ key: this._key, value: this._cache.getCachedValue(this.getFullPathToKey(this._key)), displayValue: this.displayValue, path: this.fullPath });
		}
	}

	validateInput(inValid, newValue) {
		if (!inValid) {
			if (this.validators) {
				this.validators.forEach(validator => {
					// console.log(newValue)
					// if(this.type == 'lov' && newValue && typeof newValue != 'object'){
					// 	this.status = 'warning';
					// 	this.alert =  'Choose from the given list of options.';
					// }
					if (validator == 'required') {
						if (typeof newValue == 'undefined' || newValue === '') {
							this.status = 'warning';
							this.alert = this.title + ' cannot be left blank.';
						}
					}
					if (validator.startsWith('min:')) {
						let min = Number(validator.split(':')[1]);
						if (!Number.isNaN(min) && newValue < min) {
							this.status = 'error';
							this.alert = this.title + ' should not go below ' + min + '.';
						}
					}
					if (validator.startsWith('max:')) {
						let max = Number(validator.split(':')[1]);
						if (!Number.isNaN(max) && newValue > max) {
							this.status = 'error';
							this.alert = this.title + ' should not go beyond ' + max + '.';
						}
					}
				});
			}
		}
		return alert;
	}

	setNativeElement() {
		if (!this.nativeElem) {
			if (this.type == 'checkbox') {
				this.nativeElem = this._element;
			}
			else {
				this.nativeElem = this._element.nativeElement;
			}
		}
	}

	setInputValue() {
		let value = this.value;
		if (this.app && this.path) {
			if (this.sharedData) {
				value = JSONUtils.getJSONPath(this.sharedData, this.path);
				if (this.type == 'date') {
					value = this.isValidDate(new Date(value)) ? new Date(value) : '';
				}
				this.value = value;
			}
			let cache, returnValue, displayLabel;
			if (this.type == 'lov') {
				if (this.returnKey) {
					returnValue = this._cache.getCachedValue(this.fullPath + '.' + this.returnKey);
				}
				if (this.displayKey) {
					displayLabel = this._cache.getCachedValue(this.fullPath + '.' + this.displayKey);
				}
				if (displayLabel || returnValue) {
					cache = {};
					if (displayLabel)
						cache[this.displayKey] = displayLabel;
					if (returnValue)
						cache[this.returnKey] = returnValue
				}
			} else {
				cache = this._cache.getCachedValue(this.fullPath);
			}
			if (cache && cache != value) {
				value = cache;
			}
		}
		this.setValue(value);
	}

	autoCompleteDisplayFn(op): string {
		return op ? op[this.displayKey] : op;
	}

	resetAutoComplete(event) {
		if (this.autoCompleteTimeout) {
			clearTimeout(this.autoCompleteTimeout);
		}
		this.validateInput(false, event.target.value)
		if (event instanceof KeyboardEvent ){
			if (event.key == 'Enter') {
				this.initLOV(event);
			}
		}
		else if (this.autoCompleteEnabled) {
			if (this.lovConfig) {
				this.autoCompleteTimeout = setTimeout(() => {
					// this.lovConfig.filter = this.lovPreFilter || '';
					// if (event.target.value) {
					// 	this.lovConfig.filter += (this.lovPreFilter ? ';' : '') + this.lovConfig.displayKey + ' LIKE ' + event.target.value + '%';
					// }
					// this.lovConfig.filter = this._service.resolveUrl(this.lovConfig.filter, this.fullPath);
					this.lovConfig.url = this._service.resolveUrl(this.lovUrl, this.fullPath);

					this.setAutoComplete(event.target.value).subscribe(res => {
						this.autoCompleteOptions = res;
					}, err => { });

				}, 400);
			}
		}
	}

	onValueChange(event) {
		this.setNativeElement();
		let value;
		if (this.type == 'checkbox') {
			value = event.checked;
		}
		else {
			value = event.target.value;
		}
		if (typeof value != 'undefined') {
			if (typeof value == 'string') {
				value = value.trim();
			}
			if (value && this.type == 'date') {
				value = DateUtilities.formatDate(new Date(value));
			}
			else if (value && this.dataType == 'number') {
				value = Number(value);
			}
			else if (this.type == 'checkbox') {
				value = this.checkboxValues[value ? 0 : 1];
			}
			else if (this.type == 'lov') {
				this.initLOV(event);
			}
		}
		if (this.type != 'lov') {
			this.onValueChanged(value);
		}
	}

	onValueChanged(data) {
		let value = '';
		let temp = '';
		let multiple;
		if (data != null && typeof data == 'object') {
			if (this.type == 'lov') {
				let model;
				if (Array.isArray(data)) {
					model = data.shift();
					multiple = data;
				}
				else {
					model = data;
				}
				if (this.setters && this.lovSetters) {
					this.setters.forEach((element, idx) => {
						temp = this.getFullPathToKey(element);
						if ((this._service.getInputValue(temp) == null || !this._service.getInputValue(temp).length)
							|| !this.lovSetters[idx] || (this._service.getInput(temp) && this._service.getInput(temp).key == this.key)) {
							this._service.updateInput(temp, model[this.lovSetters[idx]]);
						}
					});
				}
				value = model;
			}
			else if (this.type == 'select') {
				value = data;
			}
			else if (this.type == 'date') {
				value = data;
			}
			else if (this.type == 'lov-button') {
				multiple = data;
			}
		}
		else {
			value = data;
		}
		this.setValue(value, true);
		if (multiple && multiple.length) {
			this.multipleSelected.emit({ key: this._key, displayKey: this.displayKey, setters: this.setters, lovSetters: this.lovSetters, lovConfig: this.lovConfig, models: multiple, path: this.fullPath });
		}
	}

	loadSelectOptions() {
		if (this.selectOptions.length == 0 && this.lovConfig.url) {
			let url = this._service.resolveUrl(this.lovConfig.url, this.fullPath);
			this._service.getSelectOptions(this.app, url, this.lovConfig.dataHeader).then(res => {
				this.selectOptions = res;
				this.setInputValue();
			}, err => {
				this.setInputValue();
			});
		}
		else {
			this.setInputValue();
		}
	}

	resetInputLov() {
		this.setNativeElement();
		this.nativeElem.value = this.value;
	}

	initLOV(event) {
		if (this.lovConfig) {
			this.setNativeElement();
			this.setAutoComplete(event.target.value)
				.subscribe(res => {
					// if (res.count == 1 && !res.hasMore) {
					// 	this.setLovValue(res.items[0]);
					// }
					// else if (res.count == 1) {
					// 	this.openLOV(event.target.value);
					// }
					// else if (event.target.value) {
					// 	this.openLOV();
					// }
					// else {
					// 	this.onValueChanged({})
					// }
					this.autoCompleteOptions = res;
				}, err => {
					this.openLOV(event.target.value);
				});
		}
	}

	openLOV(value?) {
		// if (this.nativeElem && this.nativeElem.value != this.value) {
		// 	this.nativeElem.value = this.value;
		// }
		// this.lovConfig.filter = this.lovPreFilter || '';
		// if (value) {
		// 	this.lovConfig.filter += (this.lovPreFilter ? ';' : '') + this.lovConfig.displayKey + ' LIKE ' + value + '%';
		// }
		// this.lovConfig.filter = this._service.resolveUrl(this.lovConfig.filter, this.fullPath);
		this.lovConfig.url = this._service.resolveUrl(this.lovUrl, this.fullPath);
		const dialogRef = this.dialog.open(TnzInputLOVComponent);
		dialogRef.componentInstance.lovConfig = this.lovConfig;
		dialogRef.afterClosed().subscribe(res => {
			if (res) {
				this.setLovValue(res);
				if (this.nativeElem) {
					this.nativeElem.focus();
				}
			}
		})
	}

	private setLovValue(data) {
		if (Array.isArray(data)) {
			this.onValueChanged(data);
		}
		else if (this._service.getInputValue(this.fullPath + '.' + this.returnKey) != data[this.returnKey]) {
			this.onValueChanged(data);
		}
		else {
			this.setNativeElement();
			this.nativeElem.value = data[this.displayKey];
		}
	}

	private getFullPathToKey(key) {
		if (this.path) {
			return this.rootPath + '.' + this.removeLastDot(this.path, 1) + key;
		}
		else {
			return '';
		}
	}

	handleKeyboadEnter(event) {
		console.log(event);
	}

	setAutoComplete(value) {
		return this.autoCompleteUtil.populateAutoCompleteFromDBWithNgModel(value, this.lovConfig.url, this.getFilterAttributes(), this.lovConfig.dataHeader);
	}

	getFilterAttributes() {
		return this.lovConfig.filterAttributes ? this.lovConfig.filterAttributes : ['label'];
	}

	removeLastDot(path, count) {
		let newPath = path;
		while (count > 0) {
			newPath = newPath.substring(0, newPath.lastIndexOf('.'));
			count -= 1;
		}
		return newPath + '.';
	}

	getLabelFromSelectOptions(value) {
		if (this.selectOptions && this.returnKey && this.displayKey) {
			let option = this.selectOptions.find((op) => { return op[this.returnKey] == value })
			return option ? option[this.displayKey] : ""
		} else {
			return "";
		}
	}

	isValidDate(d) {
		return d && d instanceof Date && !isNaN(d.getTime());
	}
}

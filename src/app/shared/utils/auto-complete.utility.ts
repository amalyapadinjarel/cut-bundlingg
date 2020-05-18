
import {distinctUntilChanged, debounceTime, map, startWith} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ChoiceList, Lov, AutocompleteConfig } from '../models';
import { FormControl, AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { URLSearchParams } from '@angular/http';
import { CommonUtilities } from './common.utility';
import { ApiServiceV4, DocumentService, ApiService } from '../services';
import { AlertUtilities } from './alert.utility';
import { HttpParams } from '@angular/common/http';

@Injectable()
export class AutoCompleteUtilities {

    constructor(
        private alertUtil: AlertUtilities
        , private apiService: ApiService
        , private docService: DocumentService
    ) {
    }

    autoCompleteDisplayFn(data: any): string {
        return data ? data.label : '';
    }

    autoCompleteValidator(fc: FormControl) {
        return typeof fc.value === 'object' || fc.value == "" ? null : { invalid: true };
    }

    autoCompleteRequiredValidator(fc: FormControl) {
        return (typeof fc.value === 'object' && fc.value.value != "") ? null : fc.value != "" ? { invalid: true } : { required: true };
    }

    populateAutoComplete(options: ChoiceList[], fc: AbstractControl, allowNew?: string): Observable<any> {
        return fc.valueChanges.pipe(
            startWith(null),
            map(option => option && typeof option === 'object' ? option.label : option),
            map(option => this.filterAutoComplete(options, option, allowNew)));
    }


    populateAutoCompletewithNgModel(options: ChoiceList[], data: any, allowNew?: string): any {
        if ((data && typeof data === 'object' ? data = data.label : data) || data == '') {
            if (data) {
                return this.filterAutoComplete(options, data, allowNew)
            }
        }
    }

    populateAutoCompleteCommon(options: any[], fc: AbstractControl, whatToFilter, allowNew?: string): Observable<any> {
        return fc.valueChanges.pipe(
            startWith(null),
            map(option => option && typeof option === 'object' ? option.whatToFilter : option),
            map(option => this.filterAutoCompleteCommon(options, option, whatToFilter, allowNew)));
    }

    filterAutoComplete(options: ChoiceList[], value: string, allowNew?: string): ChoiceList[] {
        let filtered = [];
        if (value) {
            if (typeof value !== 'object') {
                value = CommonUtilities.replaceRegularExpCharacters(value);
            }
            filtered = options.filter(option => new RegExp(`^${value}`, 'gi').test(option.label) || new RegExp(`^${value}`, 'gi').test(option.value));
        } else {
            filtered = options.slice(0);
        }
        if (allowNew) {
            let option = { value: "_NEW", label: "-- new " + allowNew + " --" };
            filtered.push(option);
        }
        return filtered;
    }

    filterAutoCompleteCommon(options: any[], value: string, whatToFilter, allowNew?: string): any[] {
        let filtered = [];
        if (value) {
            if (typeof value !== 'object') {
                value = CommonUtilities.replaceRegularExpCharacters(value);
            }
            filtered = options.filter(option => new RegExp(`${value}`, 'gi').test(option[whatToFilter]));
        }
        else {
            filtered = options.slice(0);
        }
        if (allowNew) {
            let option = { value: "_NEW", label: "-- new " + allowNew + " --" };
            filtered.push(option);
        }
        return filtered;
    }

    populateAutoCompleteFromDB(
        fc: AbstractControl, url: string, filterAttributes: string[] = [], jsonKey: string = url,
        params: URLSearchParams = new URLSearchParams(), resultFilter = null, application = 'HCM', addLimit = false, filterType = 'old', filter = null): Observable<any> {
        let service: any = this.apiService;
        if (filter == null) {
            if (application == 'HCM')
                filter = 'filters'
            else
                filter = 'filter'
        }
        return fc.valueChanges.pipe(
            startWith(null),
            debounceTime(400),
            distinctUntilChanged(),
            map(data => data && typeof data === 'object' ? data.label : data),
            map(data => {

                let json;
                if (data && data.startsWith('+')) {
                    data = data.replace('+', '');
                }
                if (data) {
                    if (filterType == 'new') {
                        json = [];
                        filterAttributes.forEach(field => {
                            json.push({
                                "type": "item",
                                "con": "or",
                                "attr": field,
                                "operator": "startsWith",
                                "value": data
                            });
                        });
                    } else {
                        json = {};
                        filterAttributes.forEach(field => {
                            json[field] = data;
                        });
                    }
                }
                if (addLimit) {
                    params.set('limit', '30');
                    params.set('offset', '1');
                }
                params.set(filter, JSON.stringify(json));
                return service.get(('/lovs/' + url), params)
                    .map(res => {
                        if (resultFilter)
                            return resultFilter(res[jsonKey]);
                        else
                            return res[jsonKey];
                    });
            }));
    }

    populateAutoCompleteFromDBWithNgModel(
        data: any, url: string, filterAttributes: string[] = [], jsonKey: string = 'data',
        params: HttpParams = new HttpParams(), resultFilter = null, application = 'CBP', addLimit = true, filterType = 'new', filter: string = null): Observable<any> {
        let service: ApiService = this.apiService;
        if (filter == null) {
            if (application == 'HCM')
                filter = 'filters'
            else
                filter = 'filter'
        }
        if ((data && typeof data === 'object' ? data = data.label : data) || data == '') {
            data = data.replace('+', '');
            let json;
            if (data) {
                if (filterType == 'new') {
                    json = [];
                    filterAttributes.forEach(field => {
                        json.push({
                            "type": "item",
                            "con": "or",
                            "attr": field,
                            "operator": "startsWith",
                            "value": data
                        });
                    });
                } else {
                    json = {};
                    filterAttributes.forEach(field => {
                        json[field] = data;
                    });
                }
            }
            if (addLimit) {
                params = params.set('limit', '30');
                params = params.set('offset', '1');
            }
            if(json){
                params = params.set(filter, JSON.stringify(json));
            }
            return service.get(('/' + url), params)
                .map(res => {
                    if (resultFilter)
                        return resultFilter(res[jsonKey]);
                    else
                        return res[jsonKey];
                });
        }
    }

    populateAutoCompleteFromDBWithNgModelAndNewOptions(
        data: any, url: string, filterAttributes: string[] = [], jsonKey: string = 'data', newOption: any,
        params: HttpParams = new HttpParams(), resultFilter = null, application = 'CBP', addLimit = true, filterType = 'new', filter: string = null): Observable<any> {
        let service: ApiService = this.apiService;
        if (filter == null) {
            if (application == 'HCM')
                filter = 'filters'
            else
                filter = 'filter'
        }
        if ((data && typeof data === 'object' ? data = data.label : data) || data == '') {
            data = data.replace('+', '');
            let json;
            if (data) {
                if (filterType == 'new') {
                    json = [];
                    filterAttributes.forEach(field => {
                        json.push({
                            "type": "item",
                            "con": "or",
                            "attr": field,
                            "operator": "startsWith",
                            "value": data
                        });
                    });
                } else {
                    json = {};
                    filterAttributes.forEach(field => {
                        json[field] = data;
                    });
                }
            }
            if (addLimit) {
                params = params.set('limit', '30');
                params = params.set('offset', '1');
            }
            if(json){
                params = params.set(filter, JSON.stringify(json));
            }
            return service.get(('/' + url), params)
                .map(res => {
                    if(newOption != null)
                        res[jsonKey].push(newOption)
                    if (resultFilter)
                        return resultFilter(res[jsonKey]);
                    else
                        return res[jsonKey];
                });
        }
    }


    config = {
        URL: '',
        JSONKey: '',
        service: '',
        attributes: '',
        resultFilter: '',
        params: '',
        primaryFilters: ''
    }

    populateAutoCompleteFromDBWithNgModelAndExtraFilters(
        data: any,
        key: string,
        config: AutocompleteConfig
    ): Observable<any> {
        if (data && typeof data !== 'object' && data.startsWith('+')) {
            data = data.replace('+', '');
        }
        if (data) {
            data = !data ? '' : data && typeof data === 'object' ? data[key] : data;
            const primaryFilter = config.primaryFilters.reduce((filter, attribute) => {
                const key = Object.keys(attribute)[0];
                const value = attribute[key];
                const filterItem = {
                    type: "item",
                    con: 'and',
                    attr: key,
                    operator: 'startsWith',
                    value: value
                }
                filter.push(filterItem);
                return filter;
            }, []);

            const dataFilter = config.filterAttributes.reduce((filter) => {
                const filterItem = {
                    type: "item",
                    con: 'and',
                    attr: key,
                    operator: 'startsWith',
                    value: data
                }
                filter.push(filterItem);
                return filter;
            }, []);

            const combinedFilter = {
                type: 'group',
                con: 'and',
                items: Array.prototype.concat([...primaryFilter], dataFilter)
            }

            let params = config.params;
            params.set('filter', JSON.stringify(combinedFilter));
            params.set("offset", "1");
            params.set("limit", "30")

            return config.service.get(('/' + config.URL), params)
                .map(res => {
                    if (config.resultFilter)
                        return config.resultFilter(res[config.key]);
                    else
                        return res[config.key];
                });
        }
    }

    checkAutoCompleteSelected(options: ChoiceList[], fc: AbstractControl) {
        if (typeof fc.value !== 'object' && fc.value != "") {
            let filtered = this.filterAutoComplete(options, fc.value);
            if (filtered.length == 1) {
                fc.setValue(filtered[0]);
            }
        }
    }

    checkAutoCompleteSelectedCommon(options: any[], fc: AbstractControl, filterWhat) {
        if (typeof fc.value !== 'object' && fc.value != "") {
            let filtered = this.filterAutoCompleteCommon(options, fc.value, filterWhat);
            if (filtered.length == 1) {
                fc.setValue(filtered[0]);
            }
        }
    }

    checkAutoCompleteSelectedFromDB(
        fc: AbstractControl, url: string, filterAttributes: string[] = [], jsonKey: string = url,
        params: URLSearchParams = new URLSearchParams(), application = 'HCM', addLimit = false, filterType = 'old', filter = null) {
        let value = fc.value;
        let service: any = this.apiService;
        if (filter == null) {
            if (application == 'HCM')
                filter = 'filters'
            else
                filter = 'filter'
        }

        if (value && typeof value !== 'object' && value.startsWith("+"))
            value = value.replace("+", "");
        if (value && typeof value !== 'object') {
            let json;
            if (filterType == 'new') {
                json = [];
                filterAttributes.forEach(field => {
                    json.push({
                        "type": "item",
                        "con": "or",
                        "attr": field,
                        "operator": "startsWith",
                        "value": value
                    });
                });
            } else {
                json = {};
                filterAttributes.forEach(field => json[field] = value);
            }
            if (addLimit) {
                params.set('limit', '30');
                params.set('offset', '1');
            }
            params.set(filter, JSON.stringify(json));
            service.get(('/lovs/' + url), params)
                .debounceTime(400)
                .distinctUntilChanged()
                .map(res => res[jsonKey]).subscribe(data => {
                    if (data) {
                        if (data.length == 1) {
                            fc.setValue(data[0]);
                        }
                    }
                });
        }
    }

    checkAutoCompleteSelectedFromDBWithNgModel(model, url: string, filterAttributes: string[] = [], jsonKey: string = url,
        params: URLSearchParams = new URLSearchParams(), application = 'HCM', addLimit = false, filterType = 'old', filter = null): Observable<any> {
        let service: any = this.apiService;
        if (filter == null) {
            if (application == 'HCM')
                filter = 'filters'
            else
                filter = 'filter'
        }
        if (model && typeof model !== 'object' && model.startsWith("+"))
            model = model.replace("+", "");
        let json;
        if (model) {
            if (filterType == 'new') {
                json = [];
                filterAttributes.forEach(field => {
                    json.push({
                        "type": "item",
                        "con": "or",
                        "attr": field,
                        "operator": "startsWith",
                        "value": model
                    });
                });
            } else {
                json = {};
                filterAttributes.forEach(field => json[field] = model);
            }
        }

        if (addLimit) {
            params.set('limit', '30');
            params.set('offset', '1');
        }
        params.set(filter, JSON.stringify(json));
        return service.get(('/' + url), params)
            .debounceTime(400)
            .distinctUntilChanged()
            .map(res => res[jsonKey])
    }

    listenAutoCompleteNewVal(fc: AbstractControl, options, dialog, component, callback, dialogCallback?: any, securityApp: any = "", message = "") {
        fc.valueChanges.subscribe(value => {
            if (typeof value === 'object' && value.value == "_NEW") {
                fc.setValue("");
                if (securityApp != "") {
                    this.docService.checkAppSecurity(securityApp)
                        .subscribe(res => {
                            if (res && parseInt(res.create) === 4) {
                                let dialogRef = dialog.open(component);
                                if (dialogCallback)
                                    dialogCallback(dialogRef);
                                dialogRef.afterClosed().subscribe(data => {
                                    if (data) {
                                        if (data.status === "S") {
                                            let option: ChoiceList = callback(data);
                                            options.push(option);
                                            fc.setValue(option);
                                        }
                                    }
                                });
                            }
                            else {
                                this.alertUtil.showAlerts('Insufficient privilage to add ' + message);
                            }
                        });
                }
                else {
                    let dialogRef = dialog.open(component);
                    if (dialogCallback)
                        dialogCallback(dialogRef);
                    dialogRef.afterClosed().subscribe(data => {
                        if (data) {
                            if (data.status === "S") {
                                let option: ChoiceList = callback(data);
                                options.push(option);
                                fc.setValue(option);
                            }
                        }
                    });
                }
            }
        });
    }

}
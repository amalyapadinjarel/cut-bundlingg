import { Injectable } from '@angular/core';
import { DateUtilities } from './date.utility';
import { ChoiceList } from '../models';

@Injectable()
export class FormUtilities {

    constructor() {
    }
    
    public static checkChoiceListSelected(options: ChoiceList[], value: string): ChoiceList {
        if (options) {
            let selected: ChoiceList;
            let filtered = options.filter(function (this, option) {
                return option.value == this;
            }, value);
            if (filtered.length > 0)
                selected = filtered[0];
            else {
                selected = { value: "", label: "" };
            }
            return selected;
        }
        else {
            return { value: "", label: "" };
        }
    }

    public static resolveFormFields(formGroup: any, dirty = false, booleanAttr = [], dateAttr = [], timeAttr = []): any {
        let json = {};
        let properties = [];
        if (dirty) {
            properties = this.getChangedProperties(formGroup);
        } else {
            Object.keys(formGroup.controls).forEach((name) => {
                properties.push(name);
            });
        }
        properties.forEach(field => {
            let data = formGroup.value[field];
            if (data && dateAttr.indexOf(field) !== -1) {
                json[field] = DateUtilities.formatDate(data);
            } else if (booleanAttr.indexOf(field) !== -1) {
                json[field] = data ? 'Y' : 'N';

            } else if (data && typeof data === 'object' && !data['_isAMomentObject'] && !(data instanceof Date)) {
                json[field] = data.value ? data.value : data.value1;
            } else if (data && timeAttr.indexOf(field) != -1) {
                json[field] = DateUtilities.formatDateTime(data ? (data['_d'] ? data['_d'] : data) : null);
            } else {
                json[field] = data;
            }
        });
        return json;
    }
    
    public static getChangedProperties(formGroup: any): string[] {
        let changedProperties = [];
        Object.keys(formGroup.controls).forEach((name) => {
            let currentControl = formGroup.controls[name];
            if (currentControl.dirty)
                changedProperties.push(name);
        });
        return changedProperties;
    }
    
    public static getAllProperties(formGroup: any): string[] {
        let properties = [];
        Object.keys(formGroup.controls).forEach((name) => {
            properties.push(name);
        });
        return properties;
    }


}
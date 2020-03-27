import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { WorkflowVariableModel } from './../models/shared-models';
import { BreakpointObserver } from '@angular/cdk/layout';

@Injectable()
export class CommonUtilities {

    constructor(
        private breakpointObserver: BreakpointObserver
    ) { }

    public static replaceRegularExpCharacters(value): string {
        return value.replace(/\[/g, '\\[').replace(/\]/g, '\\]').replace(/\(/g, '\\(').replace(/\)/g, '\\)').replace('$', '\$').replace('*', '\\*');
    }

    public static abbreviateNumber(value: number): string {
        try {
            let newValue: string = value.toString();
            if (value >= 1000) {
                let suffixes = ["", "k", "m", "b", "t"];
                let suffixNum = Math.floor(("" + value).length / 3);
                let shortValue: string = '';
                for (var precision = 2; precision >= 1; precision--) {
                    shortValue = parseFloat((suffixNum != 0 ? (value / Math.pow(1000, suffixNum)) : value).toPrecision(precision)).toString();
                    var dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g, '');
                    if (dotLessShortValue.length <= 2) { break; }
                }
                newValue = shortValue + suffixes[suffixNum];
            }
            return newValue;
        }
        catch (error) {
            return '';
        }
    }

    public static getBpmJSON(workflowName: string, variables: WorkflowVariableModel[]) {
        return { processDefinitionKey: workflowName, variables: variables }
    }

    public static sortArray(array, sortBy, type = 'string', order = 'asc') {
        array.sort((a, b) => {
            let r = 0;
            switch (type) {
                case 'string':
                    r = a[sortBy].toLowerCase().localeCompare(b[sortBy].toLowerCase());
                    break;
                case 'number':
                case 'date':
                    r = a[sortBy] < b[sortBy] ? -1 : a[sortBy] > b[sortBy] ? 1 : 0;
                    break;
                default:
                    r = 0;
                    break;
            }
            if (order == 'desc') {
                r = 0 - r;
            }
            return r;
        });
    }

    /*
    *   Array Filter methods
    */
    public static filterArrayByString(mainArr, searchText, customFilter?) {
        if (!searchText) {
            if (customFilter)
                return mainArr.filter(itemObj => { return customFilter(itemObj) });
            else
                return mainArr;
        }
        searchText = searchText.toLowerCase();
        return mainArr.filter(itemObj => {
            return (!customFilter || customFilter(itemObj)) && this.searchInObj(itemObj, searchText);
        });
    }

    public static searchInObj(itemObj, searchText) {
        for (const prop in itemObj) {
            if (!itemObj.hasOwnProperty(prop)) {
                continue;
            }
            const value = itemObj[prop];

            if (typeof value === 'string') {
                if (this.searchInString(value, searchText)) {
                    return true;
                }
            }
            else if (Array.isArray(value)) {
                if (this.searchInArray(value, searchText)) {
                    return true;
                }

            }
            if (typeof value === 'object') {
                if (this.searchInObj(value, searchText)) {
                    return true;
                }
            }
        }
    }

    public static searchInArray(arr, searchText) {
        for (const value of arr) {
            if (typeof value === 'string') {
                if (this.searchInString(value, searchText)) {
                    return true;
                }
            }
            if (typeof value === 'object') {
                if (this.searchInObj(value, searchText)) {
                    return true;
                }
            }
        }
    }

    public static sortByKey(array, key) {
        return array.sort(function (a, b) {
            var x = a[key]; var y = b[key];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
    }

    public static searchInString(value, searchText) {
        return value.toLowerCase().includes(searchText);
    }

    public static toTitleCase(str) {
        return str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
    }

    public static autoCreateShortCode(toControl: AbstractControl, value, changed) {
        if (value && !changed) {
            let final = '';
            const attr = value.split(' ');
            attr.forEach(element => {
                if (element.length > 3) {
                    if (element.substring(0, 3).match(/^[A-Za-z0-9_]*$/)) {
                        final = final + (final == '' ? '' : '_') + element.substring(0, 3);
                    }
                } else {
                    if (element.match(/^[A-Za-z0-9_]*$/)) {
                        final = final + (final == '' ? '' : '_') + element;
                    }
                }
            });
            toControl.setValue(final.toUpperCase());
        } else if (!value && !changed) {
            toControl.setValue('');
        }
    }

    get isMobile() {
        return this.breakpointObserver.isMatched('(max-width: 767px)');
    }

    public static displayIn12Hr(valIn24) {
        if (valIn24 && valIn24 != 'Invalid Date') {
            let datePipe = new DatePipe("en-US");
            return datePipe.transform(valIn24, 'hh:mm aa');
        }
    }

}
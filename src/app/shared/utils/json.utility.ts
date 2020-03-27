import { Injectable } from '@angular/core';

@Injectable()
export class JSONUtils {

    constructor() {
    }

    public static getJSONPath(obj, path: string) {
        return JSONUtils.getJSONKeys(obj, path.split('.'));
    }

    public static getJSONKeys(obj, keys: any[], print = false) {
        let matchIndex;
        let index = 0;
        let key = keys.shift();
        matchIndex = key.match(/\[(\d+)\]$/);
        if (matchIndex) {
            key = key.split('[')[0];
            index = Number(matchIndex[1]);
        }
        if (keys.length && ((matchIndex && obj[key] && obj[key][index]) || (!matchIndex && obj[key]))) {
            return this.getJSONKeys(matchIndex ? obj[key][index] : obj[key], keys, print);
        }
        else if (!keys.length && obj[key]) {
            return obj[key];
        }
    }

    public static setJSONPath(obj, path: string, data: any) {
        return JSONUtils.setJSONKeys(obj, path.split('.'), data);
    }

    public static setJSONKeys(obj, keys: string[], data: any) {
        let matchIndex;
        let index = 0;
        let key = keys.shift();
        matchIndex = key.match(/\[(\d+)\]$/);
        if (matchIndex) {
            key = key.split('[')[0];
            index = Number(matchIndex[1]);
        }
        if (keys.length) {
            if (!obj[key]) {
                obj[key] = matchIndex ? [] : {};
            }
            if (matchIndex && !obj[key][index]) {
                obj[key][index] = {};
            }
            this.setJSONKeys(matchIndex ? obj[key][index] : obj[key], keys, data);
        }
        else {
            if (matchIndex){
                if(!obj[key])
                    obj[key] = [];
                obj[key][index] = data;
            }
            else
                obj[key] = data;
        }
    }

    public static deleteJSONPath(obj, path: string, data: any) {
        //TO-DO
    }
}
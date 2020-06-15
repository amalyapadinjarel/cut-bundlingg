import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';

@Injectable()
export class DateUtilities {

    public dateFormat = 'dd-MMM-yyyy';
    public timeFormat = 'HH:mm:ss';
    public dateTimeFormat = 'dd-MMM-yyyy HH:mm:ss';
    public dateMinFormat = 'dd-MMM-yyyy hh:mm a';

    constructor() {
    }

    public static formatDate(date) {
        if (date) {
            let datePipe = new DatePipe("en-US");
            return datePipe.transform(date, 'dd-MMM-yyyy');
        }
        else return "";
    }

    public static formatToCalDate(date) {
        if (date) {
            let datePipe = new DatePipe("en-US");
            return new Date(datePipe.transform(date, 'medium'));
        } else {
            return null;
        }
    }

    public static formatDateTime(date) {
        if (date && new Date(date).toString() != 'Invalid Date') {
            let datePipe = new DatePipe("en-US");
            return datePipe.transform(date, 'yyyy-MM-dd HH:mm:ss');
        }
        else return "";
    }

    public static formatToDateTime(date: string) {
        if (date && date != 'Invalid Date') {
            let datePipe = new DatePipe("en-US");
            return datePipe.transform(date, 'dd-MMM-yyyy HH:mm');
        }
        else return "";
    }

    public static toDBTimestamp(date) {
        if (date && new Date(date).toString() != 'Invalid Date') {
            let datePipe = new DatePipe("en-US");
            return datePipe.transform(date, 'yyyy-MM-dd HH:mm:ss');
        }
        return "";
    }

}
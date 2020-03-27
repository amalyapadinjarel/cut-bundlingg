import { Injectable } from '@angular/core';
import { NativeDateAdapter } from '@angular/material/core';

@Injectable()
export class TrendzDateAdapter extends NativeDateAdapter {
    parse(value: any): Date | null {
        let date = this.doParse(value);
        if (date) {
            return date;
        }
        else if (value) {
            return new Date(undefined);
        }
    }

    doParse(value: any): Date | null {
        let currentYear = this.today().getFullYear();
        let currentMonth = this.today().getMonth();
        let currentDate = this.today().getDate();
        const monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun',
            'jul', 'aug', 'sep', 'oct', 'nov', 'dec'
        ];
        const letters = /^[A-Za-z]+$/;
        if ((typeof value === 'string') && (value[0] === '+' || value[0] === '-') && value.length > 1) {
            let str;
            if (value[0] === '+')
                str = value.split('+');
            else
                str = value.split('-');
            const days = Number(str[1]);
            let day = this.today();
            if (value[0] === '+')
                day.setDate(day.getDate() + days);
            else
                day.setDate(day.getDate() - days);
            return day;
        }
        if ((typeof value === 'string') && (value === 't' || value.indexOf('t+') > -1)) {
            if (value === 't') {
                return new Date(currentYear, currentMonth, currentDate);
            } else {
                const str = value.split('+');
                const days = Number(str[1]);
                const day = this.today();
                day.setDate(day.getDate() + days);
                return day;
            }
        }
        if ((typeof value === 'string') && (value.indexOf('-') > -1)) {
            const str = value.split('-');
            if (!str[2] || !str[1] || !str[0] || str[2].match(letters) || str[0].match(letters))
                return null;
            const year = this.setYear(str[2]);
            let month;
            if (str[1] && str[1].match(letters)) {
                month = monthNames.indexOf(str[1].toLowerCase());
                if (month == -1)
                    return null;
            }
            else
                month = Number(str[1]) - 1;
            const date = Number(str[0]);
            return new Date(year, month, date);
        }
        if (value.match(letters)) {

            return null;
        }
        if ((typeof value === 'string') && (value.indexOf('.') > -1)) {
            const str = value.split('.');
            if (!str[2] || !str[1] || !str[0] || str[2].match(letters) || str[0].match(letters) || str[0].match(letters))
                return null;
            const year = this.setYear(str[2]);
            const month = Number(str[1]) - 1;
            const date = Number(str[0]);
            return new Date(year, month, date);
        }
        if ((typeof value === 'string') && (value.indexOf('/') > -1)) {
            const str = value.split('/');
            if (!str[2] || !str[1] || !str[0] || str[2].match(letters) || str[0].match(letters) || str[0].match(letters))
                return null;
            const year = this.setYear(str[2]);
            const month = Number(str[1]) - 1;
            const date = Number(str[0]);
            return new Date(year, month, date);
        }

        let str = value.toString().trim();
        if (value && value !== '') {
            let length = str.length;
            let yearString = '', monthString = '', dateString = '';
            let year, month;
            if (length == 1) {
                dateString = str[0];
            }
            else {
                dateString = str[0] + str[1];
            }
            if (length <= 2) {
                month = currentMonth;
            }
            else {
                if (length == 3)
                    return null;
                else if (length == 4 || length == 6 || length == 8) {
                    monthString = str[2] + str[3];
                    month = Number(monthString) - 1;
                }
                else if (length == 5 || length == 7 || length == 9) {
                    monthString = str[2] + str[3] + str[4];
                    if (monthString && monthString.match(letters)) {
                        month = monthNames.indexOf(monthString.toLowerCase());
                        if (month == -1) {
                            return null;
                        }
                    }
                    else {
                        return null;
                    }
                }
            }
            if (length <= 5) {
                year = currentYear;
            }
            else {
                if (length == 6) {
                    yearString = str[4] + str[5];
                }
                else if (length == 7) {
                    yearString = str[5] + str[6];
                }
                else if (length == 8) {
                    yearString = str[4] + str[5] + str[6] + str[7];
                }
                else if (length == 9) {
                    yearString = str[5] + str[6] + str[7] + str[8];
                }
                year = this.setYear(yearString);
            }
            const date = Number(dateString);
            if (year <= 0) {
                return null
            }
            if (month < 0 || month > 11) {
                return null;
            }
            if (date <= 0 || date > this.daysInMonth(month + 1, year)) {
                return null
            }
            return new Date(year, month, date);
        }
        const timestamp = typeof value === 'number' ? value : Date.parse(value);
        return isNaN(timestamp) ? null : new Date(timestamp);
    }

    private setYear(yearString: String) {
        let currentYear = this.today().getFullYear();
        let year = Number(yearString);
        if (year > 0 || yearString.length == 2) {
            if (year < 100)
                year = Math.floor(currentYear / 100) * 100 + year;
        }
        return year;
    }

    format(date: Date, displayFormat: Object): string {
        if (displayFormat === 'input') {
            let dayString: string;
            const day = date.getDate();
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
            ];
            const month = monthNames[date.getMonth()];
            const year = date.getFullYear();
            if (day < 10) {
                dayString = '0' + day;
            } else {
                dayString = day.toString();
            }
            return `${dayString}-${month}-${year}`;
        } else {
            return date.toDateString();
        }
    }
    getDayOfWeekNames(style): string[] {
        const SHORT_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return SHORT_NAMES;
    }
    daysInMonth(month, year) {
        return new Date(year, month, 0).getDate();
    }
}
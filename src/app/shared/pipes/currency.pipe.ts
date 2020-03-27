import { Pipe, PipeTransform } from '@angular/core'

@Pipe({ name: 'currency' })
export class CurrencyPipe implements PipeTransform {
    transform(value: number, currency: string, minorCode: string): any {
        let formatted: any;
        if(minorCode && Number(minorCode) != NaN)
        formatted = (value.toFixed(Number(minorCode)));
        if (currency) {
            formatted = currency + ' ' + formatted;
        }
        return formatted;
    }
}


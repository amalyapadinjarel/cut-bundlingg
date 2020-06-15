import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'LineBreakToBR'})
export class LineBreakToBR implements PipeTransform
{
    transform(value: string, args: any[] = [])
    {
        return value ? String(value).replace(/\n/g, "<br>") : '';
    }
}

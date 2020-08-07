import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'lowerCase'})
export class LowerCasePipe implements PipeTransform
{
    transform(value: string, args: any[] = [])
    {
        return value ? value.toLowerCase() : '';
    }
}

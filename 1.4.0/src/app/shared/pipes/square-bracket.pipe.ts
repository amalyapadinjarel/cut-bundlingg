import { Pipe, PipeTransform } from '@angular/core'

@Pipe({ name: 'square_bracket' })
export class SquareBracketPipe implements PipeTransform {
    transform(label: any, code: any, message?: string): any {
        let formatted: string = '';

        if (label && label !== '') {
            formatted = label.toString().trim();
        }
        if (code && code !== '') {
            formatted = formatted + ` [ ${code.toString().trim()} ]`
        }

        if (message && formatted === '') {
            formatted = message;
        }
        return formatted;
    }
}


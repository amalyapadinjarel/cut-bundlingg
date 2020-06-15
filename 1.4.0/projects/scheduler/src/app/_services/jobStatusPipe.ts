import { Pipe, PipeTransform } from '@angular/core';
import { JobStatus } from '../_models/index';

@Pipe({name: 'schedulerJobStatus'})
export class SchedulerJobStatusPipe implements PipeTransform
{
    transform(value: string, args: any[] = [])
    {
        return value ? JobStatus[value] : '';
    }
}

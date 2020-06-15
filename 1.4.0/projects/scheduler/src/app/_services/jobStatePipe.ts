import { Pipe, PipeTransform } from '@angular/core';
import { JobState } from '../_models/index';

@Pipe({ name: 'schedulerJobState'})
export class SchedulerJobStatePipe implements PipeTransform
{
    transform(value: string, args: any[] = [])
    {
        return value ? JobState[value] : '';
    }
}

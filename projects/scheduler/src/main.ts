import { enableProdMode } from '@angular/core';

import { environment } from './environments/environment';
import { SchedulerModule } from './app/scheduler.module';
import {platformBrowser} from "@angular/platform-browser";

if (environment.production) {
  enableProdMode();
}

platformBrowser().bootstrapModule(SchedulerModule)
  .catch(err => console.error(err));

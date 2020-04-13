import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { environment } from './environments/environment';
import { SchedulerModule } from './app/scheduler.module';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(SchedulerModule)
  .catch(err => console.error(err));

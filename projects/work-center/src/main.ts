import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { environment } from './environments/environment';
import { WorkCenterModule } from './app/work-center.module';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(WorkCenterModule)
  .catch(err => console.error(err));

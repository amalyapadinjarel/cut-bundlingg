import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { environment } from './environments/environment';
import { OperationGroupModule } from './app/operationGroup.module';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(OperationGroupModule)
  .catch(err => console.error(err));

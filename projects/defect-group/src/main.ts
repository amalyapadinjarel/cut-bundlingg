import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { environment } from './environments/environment';
import { DefectGroupModule } from './app/defect-group.module';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(DefectGroupModule)
  .catch(err => console.error(err));

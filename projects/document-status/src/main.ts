import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { environment } from './environments/environment';
import { DocumentStatusModule } from './app/document-status.module';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(DocumentStatusModule)
  .catch(err => console.error(err));

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


import { environment } from './environments/environment';
import { DocSequenceModule } from './app/doc-sequence.module';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(DocSequenceModule)
  .catch(err => console.error(err));

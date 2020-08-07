import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { environment } from './environments/environment';
import { ExecutableModule } from './app/executable.module';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(ExecutableModule)
  .catch(err => console.error(err));

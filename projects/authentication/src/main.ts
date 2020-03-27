import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { environment } from './environments/environment';
import { AuthModule } from './app/auth.module';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AuthModule)
  .catch(err => console.error(err));

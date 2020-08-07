import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import 'hammerjs'; //shery

if (environment.production) {
  enableProdMode();
}

var bootstrapPromise =  platformBrowserDynamic().bootstrapModule(AppModule);

//Logging bootstrap information
bootstrapPromise.then(success => null)
  .catch(err => console.error(err));

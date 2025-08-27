import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import * as Sentry from '@sentry/angular';
import { Integrations } from '@sentry/tracing';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

var envName = '';

if (environment.production) {
  enableProdMode();
  envName = 'Production';
} else {
  envName = 'Staging';
}
Sentry.init({
  dsn: 'https://aca45c5eaac2431ca251b45d331f3f66@o880275.ingest.sentry.io/5833833',
  environment: envName,
  release:"Soum@"+environment.versionNumber,
  integrations: [
    // Registers and configures the Tracing integration,
    // which automatically instruments your application to monitor its
    // performance, including custom Angular routing instrumentation
    new Integrations.BrowserTracing({
      tracingOrigins: ['localhost', environment.baseUrl],
      routingInstrumentation: Sentry.routingInstrumentation,
    }),
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate:  environment.traceRate,
});
//Please change this DefaultUser into your name in the localhost
Sentry.setTag('userName', 'defaultUser');

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));

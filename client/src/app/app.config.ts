import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http'; //enables the usage of httpclient throughout the whole application

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withFetch()), provideAnimationsAsync(), provideAnimationsAsync(), //withFetch uses the fetch api which is much modern compared to what the default http client uses. This also applies authInterceptor for all HTTP
  ],
};

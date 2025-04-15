import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { SocketIoConfig, provideSocketIo } from 'ngx-socket-io';
import { routes } from './app.routes';

const config: SocketIoConfig = {
  url: 'http://localhost:3005',
  options: {
    withCredentials: true,
  },
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(),
    provideSocketIo(config),
  ],
};

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { appRoutes } from './app.routes';
import { setAsLoggedInIfStorageTokenExistsInitializerProvider } from './core/initializers/set-as-logged-in-if-storage-token-exists/set-as-logged-in-if-storage-token-exists.initializer';
import { addAuthAuthorizationHeaderInterceptor } from './core/interceptors/add-auth-authorization-header/add-auth-authorization-header.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes, withComponentInputBinding()),
    provideHttpClient(
      withInterceptors([addAuthAuthorizationHeaderInterceptor])
    ),
    setAsLoggedInIfStorageTokenExistsInitializerProvider,
  ],
};

import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http'; // Use provideHttpClient
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { routes } from './app/app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes), // Include application routes
    provideHttpClient(),   // Provide HTTP client for API calls
    ...appConfig.providers, provideAnimationsAsync() // Include additional app-wide configurations
  ],
}).catch((err) => console.error(err));

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { addIcons } from 'ionicons';
import { enter, enterOutline } from 'ionicons/icons';

// Register the enter icons globally
addIcons({
  'enter': enter,
  'enter-outline': enterOutline
});

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));

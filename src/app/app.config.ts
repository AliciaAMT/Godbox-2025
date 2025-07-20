import { ApplicationConfig } from '@angular/core';
import { provideRouter, withPreloading, PreloadAllModules, RouteReuseStrategy } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { addIcons } from 'ionicons';
import {
  settingsOutline,
  constructOutline,
  personOutline,
  mailOutline,
  lockClosedOutline,
  eyeOutline,
  eyeOffOutline,
  chevronForwardOutline,
  homeOutline,
  calendarOutline,
  bookOutline,
  searchOutline,
  menuOutline,
  closeOutline,
  addOutline,
  trashOutline,
  createOutline,
  downloadOutline,
  cloudUploadOutline,
  checkmarkOutline,
  alertOutline,
  informationCircleOutline,
  logOutOutline
} from 'ionicons/icons';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAnalytics, getAnalytics, ScreenTrackingService, UserTrackingService } from '@angular/fire/analytics';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideFunctions, getFunctions } from '@angular/fire/functions';
import { provideMessaging, getMessaging } from '@angular/fire/messaging';
import { providePerformance, getPerformance } from '@angular/fire/performance';
import { provideRemoteConfig, getRemoteConfig } from '@angular/fire/remote-config';
import { provideStorage, getStorage } from '@angular/fire/storage';

// Register all the icons we need
addIcons({
  settingsOutline,
  constructOutline,
  personOutline,
  mailOutline,
  lockClosedOutline,
  eyeOutline,
  eyeOffOutline,
  chevronForwardOutline,
  homeOutline,
  calendarOutline,
  bookOutline,
  searchOutline,
  menuOutline,
  closeOutline,
  addOutline,
  trashOutline,
  createOutline,
  downloadOutline,
  cloudUploadOutline,
  checkmarkOutline,
  alertOutline,
  informationCircleOutline,
  logOutOutline
});

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideHttpClient(withFetch()),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAnalytics(() => getAnalytics()),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideFunctions(() => getFunctions()),
    provideMessaging(() => getMessaging()),
    providePerformance(() => getPerformance()),
    provideRemoteConfig(() => getRemoteConfig()),
    provideStorage(() => getStorage()),
    ScreenTrackingService,
    UserTrackingService
  ],
};

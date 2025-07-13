import { Routes } from '@angular/router';
import { redirectUnauthorizedTo, redirectLoggedInTo, canActivate } from '@angular/fire/auth-guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['landing']);
const redirectLoggedInToHome = () => redirectLoggedInTo(['tabs']);

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then(m => m.routes),
    ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.routes').then((m) => m.routes),
    ...canActivate(redirectLoggedInToHome)
  },
  {
    path: 'intro',
    loadChildren: () => import('./pages/intro/intro.routes').then((m) => m.routes)
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
    ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: 'landing',
    loadChildren: () => import('./pages/landing/landing.routes').then(m => m.routes),
    canLoad: [() => import('./guards/intro.guard').then(m => m.IntroGuard), () => import('./guards/auto-login.guard').then(m => m.AutoLoginGuard)]
  },
  {
    path: 'daily-readings',
    loadChildren: () => import('./pages/daily-readings/daily-readings.routes').then(m => m.routes)
  },
  {
    path: 'license',
    loadChildren: () => import('./pages/license/license.routes').then(m => m.routes)
  },
  {
    path: 'about-us',
    loadChildren: () => import('./pages/about-us/about-us.routes').then(m => m.routes)
  },
  {
    path: 'mission-statement',
    loadChildren: () => import('./pages/mission-statement/mission-statement.routes').then(m => m.routes)
  },
  {
    path: 'faith-statement',
    loadChildren: () => import('./pages/faith-statement/faith-statement.routes').then(m => m.routes)
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];

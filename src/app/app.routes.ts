import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./landing/landing.page').then(m => m.LandingPage),
    pathMatch: 'full'
  },
  {
    path: 'landing',
    loadComponent: () => import('./landing/landing.page').then(m => m.LandingPage)
  },
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./auth/login/login.page').then(m => m.LoginPage)
      },
      {
        path: 'verify-email',
        loadComponent: () => import('./auth/verify-email/verify-email.page').then(m => m.VerifyEmailPage)
      }
    ]
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then(m => m.HomePage),
    canActivate: [AuthGuard]
  },
  {
    path: 'daily-readings',
    loadComponent: () => import('./daily-readings/daily-readings.page').then(m => m.DailyReadingsPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'growth-blog',
    loadComponent: () => import('./growth-blog/growth-blog.page').then(m => m.GrowthBlogPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'view-collection/:id',
    loadComponent: () => import('./view-collection/view-collection.page').then(m => m.ViewCollectionPage),
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];

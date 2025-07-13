import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'tabs',
    loadComponent: () => import('./tabs.page').then(m => m.TabsPage),
    children: [
      {
        path: 'tab1',
        loadChildren: () => import('../tab1/tab1.routes').then(m => m.routes)
      },
      {
        path: '',
        redirectTo: '/tabs/tab1/home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/tab1/home',
    pathMatch: 'full'
  }
];

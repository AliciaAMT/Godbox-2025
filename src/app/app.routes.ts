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
    path: 'breath-meditation',
    loadComponent: () => import('./breath-meditation/breath-meditation.page').then(m => m.BreathMeditationPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'view-collection/:id',
    loadComponent: () => import('./view-collection/view-collection.page').then(m => m.ViewCollectionPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'admin-dash',
    loadComponent: () => import('./components/admin-dash/admin-dash.component').then(m => m.AdminDashComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'admin-dash/categories',
    loadComponent: () => import('./components/admin-dash/categories/categories.component').then(m => m.CategoriesComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'admin-dash/categories/edit-category/:id',
    loadComponent: () => import('./components/admin-dash/categories/edit-category/edit-category.component').then(m => m.EditCategoryComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'admin-dash/posts',
    loadComponent: () => import('./components/admin-dash/posts/posts.component').then(m => m.PostsComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'admin-dash/posts/add-post',
    loadComponent: () => import('./components/admin-dash/posts/add-post/add-post.component').then(m => m.AddPostComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'admin-dash/posts/edit-post/:id',
    loadComponent: () => import('./components/admin-dash/posts/edit-post/edit-post.component').then(m => m.EditPostComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'admin-dash/posts/view-post/:id',
    loadComponent: () => import('./components/admin-dash/posts/view-post/view-post.component').then(m => m.ViewPostComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'admin-dash/collections',
    loadComponent: () => import('./components/admin-dash/collections/collections.component').then(m => m.CollectionsComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'admin-dash/collections/edit-collection/:id',
    loadComponent: () => import('./components/admin-dash/collections/edit-collection/edit-collection.component').then(m => m.EditCollectionComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'admin-dash/notes',
    loadComponent: () => import('./components/admin-dash/notes/notes.component').then(m => m.NotesComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'admin-dash/notes/edit-note/:id',
    loadComponent: () => import('./components/admin-dash/notes/edit-note/edit-note.component').then(m => m.EditNoteComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'admin-dash/comments',
    loadComponent: () => import('./components/admin-dash/comments/comments.component').then(m => m.CommentsComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'admin-dash/archive',
    loadComponent: () => import('./components/admin-dash/archive/archive.component').then(m => m.ArchiveComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'admin-dash/users',
    loadComponent: () => import('./components/admin-dash/users/users.component').then(m => m.UsersComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'admin-dash/users/view-user/:id',
    loadComponent: () => import('./components/admin-dash/users/view-user/view-user.component').then(m => m.ViewUserComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'sabbath-test',
    loadComponent: () => import('./components/sabbath-readings-test/sabbath-readings-test.component').then(m => m.SabbathReadingsTestComponent)
  },
  {
    path: 'database-updater',
    loadComponent: () => import('./components/database-updater/database-updater.component').then(m => m.DatabaseUpdaterComponent)
  },
  {
    path: 'profile/:id',
    loadComponent: () => import('./profile/profile.page').then(m => m.ProfilePage),
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];

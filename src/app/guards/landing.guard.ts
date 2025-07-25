import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LandingGuard {
  private authService = inject(AuthService);
  private router = inject(Router);

  canActivate(route: any, state: any) {
    return this.authService.currentUser$.pipe(
      take(1),
      map(user => {
        const isVerifyEmailRoute = state && state.url && state.url.includes('verify-email');
        if (user) {
          if (!user.emailVerified && !user.isAnonymous && isVerifyEmailRoute) {
            // Allow unverified users to access /verify-email
            return true;
          }
          // User is logged in and either verified or not on verify-email page, redirect to home
          this.router.navigate(['/home']);
          return false;
        } else {
          // User is not logged in, allow access to landing page
          return true;
        }
      })
    );
  }
}

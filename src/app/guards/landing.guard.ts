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

  canActivate() {
    return this.authService.currentUser$.pipe(
      take(1),
      map(user => {
        if (user) {
          // User is already logged in, redirect to home
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

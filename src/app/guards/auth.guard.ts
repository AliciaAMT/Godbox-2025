import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  private authService = inject(AuthService);
  private router = inject(Router);

  canActivate() {
    return this.authService.currentUser$.pipe(
      take(1),
      map(user => {
        if (user) {
          if (!user.emailVerified && !user.isAnonymous) {
            this.router.navigate(['/auth/verify-email']);
            return false;
          }
          return true;
        } else {
          this.router.navigate(['/landing']);
          return false;
        }
      })
    );
  }
}

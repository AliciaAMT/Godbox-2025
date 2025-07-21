import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  sendEmailVerification,
  onAuthStateChanged,
  User,
  UserCredential
} from '@angular/fire/auth';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private router = inject(Router);

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    // Listen to auth state changes
    onAuthStateChanged(this.auth, (user) => {
      this.currentUserSubject.next(user);
    });
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  async register({ email, password }: { email: string; password: string }): Promise<UserCredential | null> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);

      // Send email verification
      if (userCredential.user) {
        await sendEmailVerification(userCredential.user);
      }

      return userCredential;
    } catch (error: any) {
      console.error('Registration error:', error);
      throw this.getErrorMessage(error.code);
    }
  }

  async login({ email, password }: { email: string; password: string }): Promise<UserCredential | null> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      return userCredential;
    } catch (error: any) {
      console.error('Login error:', error);
      throw this.getErrorMessage(error.code);
    }
  }

  async loginWithGoogle(): Promise<UserCredential | null> {
    try {
      const userCredential = await signInWithPopup(this.auth, new GoogleAuthProvider());
      return userCredential;
    } catch (error: any) {
      console.error('Google login error:', error);
      throw this.getErrorMessage(error.code);
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      this.router.navigate(['/landing']);
    } catch (error: any) {
      console.error('Logout error:', error);
      throw this.getErrorMessage(error.code);
    }
  }

  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(this.auth, email);
    } catch (error: any) {
      console.error('Password reset error:', error);
      throw this.getErrorMessage(error.code);
    }
  }

  async resendVerificationEmail(): Promise<void> {
    try {
      const user = this.auth.currentUser;
      if (user) {
        await sendEmailVerification(user);
      }
    } catch (error: any) {
      console.error('Email verification error:', error);
      throw this.getErrorMessage(error.code);
    }
  }

  isEmailVerified(): boolean {
    return this.currentUser?.emailVerified || false;
  }

  isAuthenticated(): boolean {
    return !!this.currentUser;
  }

  async getIdToken(): Promise<string | null> {
    try {
      const user = this.currentUser;
      if (user) {
        return await user.getIdToken();
      }
      return null;
    } catch (error) {
      console.error('Error getting ID token:', error);
      return null;
    }
  }

  private getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'No account found with this email address.';
      case 'auth/wrong-password':
        return 'Incorrect password.';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters long.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection.';
      case 'auth/popup-closed-by-user':
        return 'Sign-in was cancelled.';
      case 'auth/popup-blocked':
        return 'Sign-in popup was blocked. Please allow popups for this site.';
      default:
        return 'An error occurred. Please try again.';
    }
  }
}

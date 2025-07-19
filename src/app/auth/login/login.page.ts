import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { arrowBack, mailOutline, lockClosedOutline, eye, eyeOff, logoGoogle } from 'ionicons/icons';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonIcon,
  IonFab,
  IonFabButton,
  IonGrid,
  IonRow,
  IonCol,
  AlertController,
  LoadingController
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonIcon,
    IonFab,
    IonFabButton,
    IonGrid,
    IonRow,
    IonCol
  ]
})
export class LoginPage {
  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  public router = inject(Router);
  private alertController = inject(AlertController);
  private loadingController = inject(LoadingController);

  loginForm: FormGroup;
  isLoading = false;
  showPassword = false;

  constructor() {
    addIcons({ arrowBack, mailOutline, lockClosedOutline, eye, eyeOff, logoGoogle });
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async onLogin() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const loading = await this.loadingController.create({
        message: 'Signing in...'
      });
      await loading.present();

            try {
        const { email, password } = this.loginForm.value;
        const userCredential = await this.authService.login({ email, password });

        await loading.dismiss();

        // Check if email is verified
        if (userCredential?.user && !userCredential.user.emailVerified) {
          this.router.navigate(['/auth/verify-email']);
        } else {
          this.router.navigate(['/home']);
        }
      } catch (error: any) {
        await loading.dismiss();
        this.showError('Login Failed', error);
      } finally {
        this.isLoading = false;
      }
    }
  }

  async onGoogleLogin() {
    this.isLoading = true;
    const loading = await this.loadingController.create({
      message: 'Signing in with Google...'
    });
    await loading.present();

    try {
      const userCredential = await this.authService.loginWithGoogle();
      await loading.dismiss();

      // Google users are automatically verified
      this.router.navigate(['/home']);
    } catch (error: any) {
      await loading.dismiss();
      this.showError('Google Sign-in Failed', error);
    } finally {
      this.isLoading = false;
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  private async showError(title: string, message: string) {
    const alert = await this.alertController.create({
      header: title,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }
}

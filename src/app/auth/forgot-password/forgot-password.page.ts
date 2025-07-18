import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonButtons,
  IonIcon,
  IonText,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  AlertController,
  LoadingController
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
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
    IonButtons,
    IonIcon,
    IonText,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle
  ]
})
export class ForgotPasswordPage {
  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  public router = inject(Router);
  private alertController = inject(AlertController);
  private loadingController = inject(LoadingController);

  forgotPasswordForm: FormGroup;
  isLoading = false;

  constructor() {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  async onResetPassword() {
    if (this.forgotPasswordForm.valid) {
      this.isLoading = true;
      const loading = await this.loadingController.create({
        message: 'Sending reset email...'
      });
      await loading.present();

      try {
        const { email } = this.forgotPasswordForm.value;
        await this.authService.resetPassword(email);

        await loading.dismiss();
        await this.showSuccess();
      } catch (error: any) {
        await loading.dismiss();
        this.showError('Password Reset Failed', error);
      } finally {
        this.isLoading = false;
      }
    }
  }

  private async showSuccess() {
    const alert = await this.alertController.create({
      header: 'Reset Email Sent!',
      message: 'Please check your email for password reset instructions.',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.router.navigate(['/auth/login']);
          }
        }
      ]
    });
    await alert.present();
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

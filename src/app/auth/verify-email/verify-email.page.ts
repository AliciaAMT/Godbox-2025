import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
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
import { doc, setDoc, getDoc, Firestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.page.html',
  styleUrls: ['./verify-email.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
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
export class VerifyEmailPage {
  private authService = inject(AuthService);
  public router = inject(Router);
  private alertController = inject(AlertController);
  private loadingController = inject(LoadingController);
  private firestore = inject(Firestore);

  isLoading = false;

  async resendVerificationEmail() {
    this.isLoading = true;
    const loading = await this.loadingController.create({
      message: 'Sending verification email...'
    });
    await loading.present();

    try {
      await this.authService.resendVerificationEmail();
      await loading.dismiss();

      const alert = await this.alertController.create({
        header: 'Email Sent!',
        message: 'Please check your email for the verification link.',
        buttons: ['OK']
      });
      await alert.present();
    } catch (error: any) {
      await loading.dismiss();

      const alert = await this.alertController.create({
        header: 'Error',
        message: error,
        buttons: ['OK']
      });
      await alert.present();
    } finally {
      this.isLoading = false;
    }
  }

  async checkVerification() {
    this.isLoading = true;
    const loading = await this.loadingController.create({
      message: 'Checking verification status...'
    });
    await loading.present();

    try {
      // Reload the user to get updated verification status
      await this.authService.currentUser?.reload();

      if (this.authService.isEmailVerified()) {
        // Create Firestore user document if it doesn't exist
        const user = this.authService.currentUser;
        if (user) {
          const userDocRef = doc(this.firestore, `users/${user.uid}`);
          const userDocSnap = await getDoc(userDocRef);
          if (!userDocSnap.exists()) {
            try {
              await setDoc(userDocRef, {
                userRole: 'user',
                bio: '',
                imageUrl: '',
                bibleVersion: 'ESV',
                createdAt: new Date().toISOString(),
                email: user.email || '',
                userName: ''
              });
            } catch (firestoreError) {
              await loading.dismiss();
              const alert = await this.alertController.create({
                header: 'Error',
                message: 'Failed to create your user profile. Please try again or contact support.\n' +
                  (typeof firestoreError === 'object' && firestoreError && 'message' in firestoreError
                    ? (firestoreError as any).message
                    : String(firestoreError)),
                buttons: ['OK']
              });
              await alert.present();
              this.isLoading = false;
              return;
            }
          }
        }
        await loading.dismiss();
        this.router.navigate(['/home']);
      } else {
        await loading.dismiss();

        const alert = await this.alertController.create({
          header: 'Not Verified',
          message: 'Your email is not yet verified. Please check your email and click the verification link.',
          buttons: ['OK']
        });
        await alert.present();
      }
    } catch (error: any) {
      await loading.dismiss();

      const alert = await this.alertController.create({
        header: 'Error',
        message: 'An error occurred while checking verification status.',
        buttons: ['OK']
      });
      await alert.present();
    } finally {
      this.isLoading = false;
    }
  }
}

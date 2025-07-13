import { ChangeDetectorRef, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AlertController, LoadingController, IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonMenuToggle, IonItem, IonAvatar, IonImg, IonLabel, IonButton, IonIcon, IonRouterOutlet } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AvatarService } from '../services/avatar.service';
import { DataService, Serie } from '../services/data.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    IonMenu,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonMenuToggle,
    IonItem,
    IonAvatar,
    IonImg,
    IonLabel,
    IonButton,
    IonIcon,
    IonRouterOutlet
  ]
})
export class Tab1Page {
  private avatarService = inject(AvatarService);
  private dataService = inject(DataService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private alertController = inject(AlertController);
  private loadingController = inject(LoadingController);
  private cd = inject(ChangeDetectorRef);

  profile = signal<any>(null);
  series = signal<Serie[]>([]);

  constructor() {
    this.avatarService.getUserProfile().subscribe((data) => {
      this.profile.set(data);
    });

    this.dataService.getSeries().subscribe(res => {
      this.series.set(res);
      this.cd.detectChanges();
    });
  }

  async logout() {
    await this.authService.logout();
    this.router.navigateByUrl('login', { replaceUrl: true });
  }

  async changeImage() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Photos
    });

    if (image) {
      const loading = await this.loadingController.create();
      await loading.present();

      const result = await this.avatarService.uploadImage(image);
      loading.dismiss();

      if (!result) {
        const alert = await this.alertController.create({
          header: 'Upload failed',
          message: 'Please try again.',
          buttons: ['OK']
        });

        await alert.present();
      }
    }
  }
}

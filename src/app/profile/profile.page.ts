import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { LoadingController, AlertController, ToastController, ModalController } from '@ionic/angular/standalone';
import { IonContent, IonAvatar, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonIcon } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AvatarService } from '../services/avatar.service';
import { DataService, User } from '../services/data.service';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { addIcons } from 'ionicons';
import { save, person, create, mail, book, documentText, addCircleOutline } from 'ionicons/icons';
import { BackButtonComponent } from '../components/back-button/back-button.component';
import { EditProfileModalComponent } from './edit-profile-modal/edit-profile-modal.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonAvatar,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton,
    IonIcon,
    BackButtonComponent
  ]
})
export class ProfilePage implements OnInit {
  id: string = '';
  profile: User | null = null;
  user: User = {
    id: '',
    userName: '',
    email: '',
    imageUrl: '',
    userRole: '',
    bio: ''
  };

  // No editor configuration needed

  constructor(
    private avatarService: AvatarService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private dataService: DataService,
    private route: ActivatedRoute,
    private toastCtrl: ToastController,
    private auth: Auth,
    private sanitizer: DomSanitizer,
    private modalController: ModalController
  ) {
    addIcons({person,create,mail,book,documentText,addCircleOutline,save});

    // Listen for authentication state changes
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.avatarService.getUserProfile().subscribe((data) => {
          this.profile = data;
        });
      }
    });
  }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id') || '';

    if (this.id) {
      this.dataService.getUserById(this.id).subscribe(res => {
        this.user = res;
      });
    }
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

  async updateUser() {
    await this.dataService.updateUser(this.user);
    const toast = await this.toastCtrl.create({
      message: 'User updated!',
      duration: 2000
    });
    toast.present();
  }

  getSafeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  getJoinedDate(createdAt?: string): string {
    if (!createdAt) {
      return 'Since 2024';
    }
    try {
      const date = new Date(createdAt);
      return `Since ${date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`;
    } catch {
      return 'Since 2024';
    }
  }

  getBibleVersionName(version?: string): string {
    switch (version) {
      case 'ESV':
        return 'ESV (English Standard Version)';
      case 'KJV':
        return 'KJV (King James Version)';
      case 'HBSS':
        return 'Holy Bible in Simple Spanish';
      case 'RVR09':
        return 'RVR09 (Reina-Valera 1909, Spanish)';
      default:
        return 'ESV (Default)';
    }
  }

  async openEditModal() {
    const modal = await this.modalController.create({
      component: EditProfileModalComponent,
      componentProps: {
        user: this.user
      },
      breakpoints: [0, 0.5, 0.8],
      initialBreakpoint: 0.8
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      this.user = data;
      const toast = await this.toastCtrl.create({
        message: 'Profile updated successfully!',
        duration: 2000,
        color: 'success'
      });
      toast.present();
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { LoadingController, AlertController, ToastController } from '@ionic/angular/standalone';
import { IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonAvatar, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonLabel, IonInput, IonButton, IonIcon, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AvatarService } from '../services/avatar.service';
import { DataService, User } from '../services/data.service';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { addIcons } from 'ionicons';
import { save } from 'ionicons/icons';
import { FroalaEditorComponent } from '../components/froala-editor/froala-editor.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
    IonAvatar,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonIcon,
    IonSelect,
    IonSelectOption,
    FroalaEditorComponent
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
    private sanitizer: DomSanitizer
  ) {
    addIcons({ save });

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
}

import { Component, OnInit } from '@angular/core';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonLabel, IonInput, IonButton, IonIcon, IonFab, IonFabButton } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { DataService, User } from '../../../../services/data.service';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
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
    IonFab,
    IonFabButton
  ]
})
export class ViewUserComponent implements OnInit {
  user: User | null = null;
  id: string | null = null;

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.dataService.getUserById(this.id).subscribe(res => {
        this.user = res;
      });
    }
  }

  async deleteUser() {
    if (!this.user) return;

    const alert = await this.alertController.create({
      header: 'Delete User',
      message: 'Are you sure you want to delete this user?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          handler: () => {
            this.dataService.deleteUser(this.user!);
            this.router.navigateByUrl('/admin-dash/users', { replaceUrl: true });
          }
        }
      ]
    });
    await alert.present();
  }

  async updateUser() {
    if (!this.user) return;

    await this.dataService.updateUser(this.user);
    const toast = await this.toastController.create({
      message: 'User updated!',
      duration: 2000
    });
    toast.present();
    this.router.navigateByUrl('/admin-dash/users', { replaceUrl: true });
  }
}

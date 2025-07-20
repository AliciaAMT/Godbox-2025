import { Component, OnInit } from '@angular/core';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonLabel, IonInput, IonTextarea, IonSelect, IonSelectOption, IonButton, IonIcon, IonFab, IonFabButton } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { DataService, Post, Category } from '../../../../services/data.service';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.scss'],
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
    IonTextarea,
    IonSelect,
    IonSelectOption,
    IonButton,
    IonIcon,
    IonFab,
    IonFabButton
  ]
})
export class EditPostComponent implements OnInit {
  post: Post | null = null;
  categories: Category[] = [];
  id: string | null = null;

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController
  ) {
    this.dataService.getCategories().subscribe(res => {
      this.categories = res;
    });
  }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.dataService.getPostById(this.id).subscribe(res => {
        this.post = res;
      });
    }
  }

  async deletePost() {
    if (!this.post) return;

    const alert = await this.alertController.create({
      header: 'Delete Post',
      message: 'Are you sure you want to delete this post?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          handler: () => {
            this.dataService.deletePost(this.post!);
            this.router.navigateByUrl('/admin-dash/posts', { replaceUrl: true });
          }
        }
      ]
    });
    await alert.present();
  }

  async updatePost() {
    if (!this.post) return;

    await this.dataService.updatePost(this.post);
    const toast = await this.toastController.create({
      message: 'Post updated!',
      duration: 2000
    });
    toast.present();
    this.router.navigateByUrl('/admin-dash/posts', { replaceUrl: true });
  }
}

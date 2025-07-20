import { Component, OnInit } from '@angular/core';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonLabel, IonInput, IonTextarea, IonSelect, IonSelectOption, IonButton, IonIcon, IonFab, IonFabButton } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { DataService, Post, Category } from '../../../../services/data.service';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.scss'],
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
export class AddPostComponent implements OnInit {
  post: Post = {
    title: '',
    description: '',
    imageUrl: '',
    preview: '',
    category: '',
    content: '',
    keywords: '',
    author: '',
    date: '',
    likes: '',
    views: '',
    privacy: 'private',
    series: '',
    seqNo: 0,
  };
  categories: Category[] = [];

  constructor(
    private dataService: DataService,
    private router: Router,
    private toastController: ToastController,
    private auth: Auth
  ) {
    this.dataService.getCategories().subscribe(res => {
      this.categories = res;
    });
    this.post.date = new Date().toISOString();
    this.post.likes = '0';
    this.post.views = '0';
  }

  ngOnInit() {
    this.post.author = this.auth.currentUser?.uid || '';
  }

  async addPost() {
    await this.dataService.addPost(this.post);
    const toast = await this.toastController.create({
      message: 'Post added successfully',
      duration: 2000,
    });
    toast.present();
    this.router.navigateByUrl('/admin-dash/posts', { replaceUrl: true });
  }
}

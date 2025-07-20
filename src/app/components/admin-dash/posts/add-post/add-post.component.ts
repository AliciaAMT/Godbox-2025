import { Component, OnInit } from '@angular/core';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonIcon, IonInput, IonTextarea, IonSelect, IonSelectOption, IonLabel, IonItem, IonFab, IonFabButton } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { DataService, Post, Category, Serie } from '../../../../services/data.service';
import { addIcons } from 'ionicons';
import { save } from 'ionicons/icons';

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
    IonButton,
    IonIcon,
    IonInput,
    IonTextarea,
    IonSelect,
    IonSelectOption,
    IonLabel,
    IonItem,
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
    likes: '0',
    views: '0',
    privacy: 'private',
    series: '',
    seqNo: 0
  };
  categories: Category[] = [];
  series: Serie[] = [];

  constructor(
    private dataService: DataService,
    private router: Router
  ) {
    addIcons({ save });
    this.dataService.getCategories().subscribe(res => {
      this.categories = res;
    });
    this.dataService.getSeries().subscribe(res => {
      this.series = res;
    });
  }

  ngOnInit() {
  }

  async savePost() {
    if (this.post.title && this.post.description) {
      this.post.date = new Date().toISOString();
      await this.dataService.addPost(this.post);
      this.router.navigateByUrl('/admin-dash/posts');
    }
  }

  async addPost() {
    await this.savePost();
  }
}

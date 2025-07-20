import { Component, OnInit } from '@angular/core';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonIcon, IonInput, IonTextarea, IonSelect, IonSelectOption, IonLabel, IonItem, IonFab, IonFabButton } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { DataService, Post, Category, Serie } from '../../../../services/data.service';
import { addIcons } from 'ionicons';
import { save } from 'ionicons/icons';

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
export class EditPostComponent implements OnInit {
  post: Post | null = null;
  categories: Category[] = [];
  series: Serie[] = [];
  id: string | null = null;

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
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
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.dataService.getPostById(this.id).subscribe(res => {
        this.post = res;
      });
    }
  }

  async savePost() {
    if (this.post && this.post.title && this.post.description) {
      await this.dataService.updatePost(this.post);
      this.router.navigateByUrl('/admin-dash/posts');
    }
  }

  async updatePost() {
    await this.savePost();
  }

  async deletePost() {
    if (this.post) {
      await this.dataService.deletePost(this.post);
      this.router.navigateByUrl('/admin-dash/posts');
    }
  }
}

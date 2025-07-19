import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonFab, IonFabButton, IonIcon, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonImg } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { DataService, Post } from '../services/data.service';
import { FooterLandingComponent } from '../components/footer-landing/footer-landing.component';

@Component({
  selector: 'app-growth-blog',
  templateUrl: './growth-blog.page.html',
  styleUrls: ['./growth-blog.page.scss'],
  standalone: true,
  imports: [IonContent, IonFab, IonFabButton, IonIcon, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonImg, CommonModule, FormsModule, RouterModule, FooterLandingComponent]
})
export class GrowthBlogPage implements OnInit {
  posts: Post[] = [];

  private dataService = inject(DataService);

  constructor() {
    this.dataService.getPublicPosts().subscribe(res => {
      this.posts = res;
    });
  }

  ngOnInit() {
  }

}

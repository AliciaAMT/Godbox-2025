import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonImg } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { DataService, Post } from '../services/data.service';
import { FooterLandingComponent } from '../components/footer-landing/footer-landing.component';
import { BackButtonComponent } from '../components/back-button/back-button.component';
import { SkipToTopComponent } from '../components/skip-to-top/skip-to-top.component';

@Component({
  selector: 'app-growth-blog',
  templateUrl: './growth-blog.page.html',
  styleUrls: ['./growth-blog.page.scss'],
  standalone: true,
  imports: [IonContent, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonImg, CommonModule, FormsModule, RouterModule, FooterLandingComponent, BackButtonComponent, SkipToTopComponent]
})
export class GrowthBlogPage implements OnInit {
  posts: Post[] = [];

  @ViewChild(IonContent) ionContent!: IonContent;

  private dataService = inject(DataService);

  constructor() {
    this.dataService.getPublicPosts().subscribe(res => {
      this.posts = res.filter(post => {
        const allowedCategories = ['general', 'inspirations', 'meditations'];
        const cat = post.category;
        if (Array.isArray(cat)) {
          return cat.some(c => typeof c === 'string' && allowedCategories.includes(c.trim().toLowerCase()));
        }
        return typeof cat === 'string' && allowedCategories.includes(cat.trim().toLowerCase());
      });
    });
  }

  ngOnInit() {
  }

}

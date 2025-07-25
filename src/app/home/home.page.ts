import { Component, OnInit, ChangeDetectorRef, inject, ViewChild } from '@angular/core';
import { IonContent, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonImg } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DataService, Post, User } from '../services/data.service';
import { FooterLandingComponent } from '../components/footer-landing/footer-landing.component';
import { MenuHeaderComponent } from '../components/menu-header/menu-header.component';
import { SkipToTopComponent } from '../components/skip-to-top/skip-to-top.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonImg,
    FooterLandingComponent,
    MenuHeaderComponent,
    SkipToTopComponent
  ],
})
export class HomePage implements OnInit {
  private dataService = inject(DataService);
  private cd = inject(ChangeDetectorRef);

  posts: Post[] = [];
  users: User[] = [];

  @ViewChild(IonContent) ionContent!: IonContent;

  constructor() {
    this.dataService.getPostsForCollection().subscribe({
      next: (data) => {
        this.posts = data;
        this.cd.detectChanges();
      },
      error: (error) => {
        console.error('Error loading posts:', error);
      }
    });
    this.dataService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.cd.detectChanges();
      },
      error: (error) => {
        console.error('Error loading users:', error);
      }
    });
  }

  ngOnInit() {}
}

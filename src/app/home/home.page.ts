import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { IonContent, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonImg } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DataService, Post, User } from '../services/data.service';

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
    IonImg
  ],
})
export class HomePage implements OnInit {
  private dataService = inject(DataService);
  private cd = inject(ChangeDetectorRef);

  posts: Post[] = [];
  users: User[] = [];

  constructor() {
    this.dataService.getPostsForCollection().subscribe((data) => {
      this.posts = data;
      this.cd.detectChanges();
    });
    this.dataService.getUsers().subscribe((data) => {
      this.users = data;
      this.cd.detectChanges();
    });
  }

  ngOnInit() {}
}

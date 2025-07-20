import { Component, OnInit } from '@angular/core';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonGrid, IonRow, IonCol, IonList, IonItem, IonLabel, IonFab, IonFabButton, IonIcon } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DataService, Post, User } from '../../../services/data.service';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonGrid,
    IonRow,
    IonCol,
    IonList,
    IonItem,
    IonLabel,
    IonFab,
    IonFabButton,
    IonIcon
  ]
})
export class PostsComponent implements OnInit {
  posts: Post[] = [];
  users: User[] = [];

  constructor(
    private dataService: DataService,
    private router: Router
  ) {
    addIcons({ add });
    this.dataService.getPosts().subscribe(res => {
      this.posts = res;
    });
    this.dataService.getUsers().subscribe(res => {
      this.users = res;
    });
  }

  ngOnInit() {
  }

  getUserName(userId: string): string {
    const user = this.users.find(u => u.id === userId);
    return user?.userName || 'Unknown User';
  }
}

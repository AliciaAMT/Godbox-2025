import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonList, IonItem, IonLabel, IonFab, IonFabButton, IonIcon, IonSpinner } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DataService, Post, User } from '../../../services/data.service';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';
import { Subscription } from 'rxjs';

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
    IonList,
    IonItem,
    IonLabel,
    IonFab,
    IonFabButton,
    IonIcon,
    IonSpinner
  ]
})
export class PostsComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  users: User[] = [];
  loading = true;
  private postsSubscription?: Subscription;
  private usersSubscription?: Subscription;

  constructor(
    private dataService: DataService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    addIcons({ add });
  }

  ngOnInit() {
    this.loadData();
  }

  ngOnDestroy() {
    this.cleanupSubscriptions();
  }

  private cleanupSubscriptions() {
    if (this.postsSubscription) {
      this.postsSubscription.unsubscribe();
      this.postsSubscription = undefined;
    }
    if (this.usersSubscription) {
      this.usersSubscription.unsubscribe();
      this.usersSubscription = undefined;
    }
  }

  loadData() {
    console.log('Loading posts data...');
    this.loading = true;

    // Clean up any existing subscriptions first
    this.cleanupSubscriptions();

    // Load posts data with immediate UI update
    this.postsSubscription = this.dataService.getPosts().subscribe({
      next: (posts) => {
        console.log('Posts loaded:', posts);
        console.log(`Updating UI with ${posts.length} posts`);

        // Update the posts array
        this.posts = [...posts];
        this.loading = false;

        // Force change detection
        this.cdr.detectChanges();

        console.log('Posts array after update:', this.posts);
        console.log('Posts array length:', this.posts.length);
      },
      error: (error) => {
        console.error('Error loading posts:', error);
        this.loading = false;
      }
    });

    // Load users data
    this.usersSubscription = this.dataService.getUsers().subscribe({
      next: (users) => {
        console.log('Users loaded:', users);
        this.users = users;
      },
      error: (error) => {
        console.error('Error loading users:', error);
      }
    });
  }

  getUserName(userId: string): string {
    if (!userId) return 'Unknown User';
    const user = this.users.find(u => u.id === userId);
    return user?.userName || 'Unknown User';
  }
}

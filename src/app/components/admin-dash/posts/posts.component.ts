import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { IonContent, IonFab, IonFabButton, IonIcon, IonSpinner, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonImg, IonButton, IonInfiniteScroll, IonInfiniteScrollContent } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DataService, Post, User } from '../../../services/data.service';
import { BackButtonComponent } from '../../back-button/back-button.component';
import { addIcons } from 'ionicons';
import { add, arrowBack, eye, create } from 'ionicons/icons';
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
    IonFab,
    IonFabButton,
    IonIcon,
    IonSpinner,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonImg,
    IonButton,
    BackButtonComponent,
    IonInfiniteScroll,
    IonInfiniteScrollContent
  ]
})
export class PostsComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  users: User[] = [];
  loading = true;
  loadingMore = false;
  allLoaded = false;
  filterMode: 'recent' | 'private' | 'public' | 'anonymous' | 'all' = 'recent';
  private postsSubscription?: Subscription;
  private usersSubscription?: Subscription;
  private readonly PAGE_SIZE = 20;

  constructor(
    private dataService: DataService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    addIcons({arrowBack, add, eye, create});
  }

  ngOnInit() {
    this.setFilterMode('recent');
  }

  ngOnDestroy() {
    this.cleanupSubscriptions();
  }

  setFilterMode(mode: 'recent' | 'private' | 'public' | 'anonymous' | 'all') {
    this.filterMode = mode;
    this.loadFirstPage();
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

  loadFirstPage() {
    this.loading = true;
    this.allLoaded = false;
    this.posts = [];
    this.cleanupSubscriptions();
    let pageSize = this.PAGE_SIZE;
    let privacyFilter: string[] | undefined;
    if (this.filterMode === 'recent') {
      pageSize = 5;
    } else if (this.filterMode === 'private') {
      privacyFilter = ['private'];
    } else if (this.filterMode === 'public') {
      privacyFilter = ['public'];
    } else if (this.filterMode === 'anonymous') {
      privacyFilter = ['anonymous'];
    }
    this.postsSubscription = this.dataService.getPostsPaginated(pageSize, undefined, privacyFilter).subscribe({
      next: (posts) => {
        this.posts = posts;
        this.loading = false;
        this.allLoaded = posts.length < pageSize;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading posts:', error);
        this.loading = false;
      }
    });
    this.usersSubscription = this.dataService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (error) => {
        console.error('Error loading users:', error);
      }
    });
  }

  loadMorePosts() {
    if (this.loadingMore || this.allLoaded || this.posts.length === 0) return;
    this.loadingMore = true;
    const lastPost = this.posts[this.posts.length - 1];
    const lastDate = lastPost?.date;
    let pageSize = this.PAGE_SIZE;
    let privacyFilter: string[] | undefined;
    if (this.filterMode === 'recent') {
      pageSize = 5;
    } else if (this.filterMode === 'private') {
      privacyFilter = ['private'];
    } else if (this.filterMode === 'public') {
      privacyFilter = ['public'];
    } else if (this.filterMode === 'anonymous') {
      privacyFilter = ['anonymous'];
    }
    this.dataService.getPostsPaginated(pageSize, lastDate, privacyFilter).subscribe({
      next: (newPosts) => {
        if (newPosts.length < pageSize) {
          this.allLoaded = true;
        }
        // Avoid duplicates
        const uniquePosts = newPosts.filter(p => !this.posts.some(existing => existing.id === p.id));
        this.posts = [...this.posts, ...uniquePosts];
        this.loadingMore = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading more posts:', error);
        this.loadingMore = false;
      }
    });
  }

  getUserName(userId: string): string {
    if (!userId) return 'Unknown User';
    const user = this.users.find(u => u.id === userId);
    return user?.userName || 'Unknown User';
  }
}

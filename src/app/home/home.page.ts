import { Component, OnInit, ChangeDetectorRef, inject, ViewChild } from '@angular/core';
import { IonContent, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonImg, IonButton, IonIcon } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DataService, Post, User } from '../services/data.service';
import { FooterLandingComponent } from '../components/footer-landing/footer-landing.component';
import { MenuHeaderComponent } from '../components/menu-header/menu-header.component';
import { SkipToTopComponent } from '../components/skip-to-top/skip-to-top.component';
import { PwaService } from '../services/pwa.service';
import { addIcons } from 'ionicons';
import { download, expand, refresh } from 'ionicons/icons';

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
    IonButton,
    IonIcon,
    FooterLandingComponent,
    MenuHeaderComponent,
    SkipToTopComponent
  ],
})
export class HomePage implements OnInit {
  private dataService = inject(DataService);
  private cd = inject(ChangeDetectorRef);
  private pwaService = inject(PwaService);

  posts: Post[] = [];
  users: User[] = [];
  canInstall = false;
  isInstalled = false;
  updateAvailable = false;

  @ViewChild(IonContent) ionContent!: IonContent;

  constructor() {
    addIcons({download,refresh,expand});
  }

  ngOnInit() {
    console.log('HomePage: ngOnInit - initial canInstall:', this.pwaService.canInstall(), 'isInstalled:', this.isInstalled);

    // Subscribe to PWA installability changes
    this.pwaService.canInstall$.subscribe(canInstall => {
      console.log('HomePage: canInstall changed to:', canInstall);
      this.canInstall = canInstall;
      this.cd.detectChanges();
    });

    // Subscribe to PWA installation status
    this.pwaService.isInstalled$.subscribe(installed => {
      console.log('HomePage: isInstalled changed to:', installed);
      this.isInstalled = installed;
      this.cd.detectChanges();
    });

    // Subscribe to update availability
    this.pwaService.updateAvailable$.subscribe(updateAvailable => {
      console.log('HomePage: updateAvailable changed to:', updateAvailable);
      this.updateAvailable = updateAvailable;
      this.cd.detectChanges();
    });

    // Load posts
    this.dataService.getPostsForCollection().subscribe({
      next: (data) => {
        this.posts = data;
        this.cd.detectChanges();
      },
      error: (error) => {
        console.error('Error loading posts:', error);
        // Don't let Firebase errors block the UI
        this.posts = [];
        this.cd.detectChanges();
      }
    });

    // Load users
    this.dataService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.cd.detectChanges();
      },
      error: (error) => {
        console.error('Error loading users:', error);
        // Don't let Firebase errors block the UI
        this.users = [];
        this.cd.detectChanges();
      }
    });
  }

  async installApp() {
    try {
      await this.pwaService.installApp();
      this.canInstall = this.pwaService.canInstall();
    } catch (error) {
      console.error('Failed to install app:', error);
    }
  }

  updateApp() {
    this.pwaService.forceUpdate();
    setTimeout(() => {
      this.pwaService.reloadApp();
    }, 1000);
  }

  goFullscreen() {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonMenu, IonList, IonItem, IonMenuToggle, IonLabel, IonIcon, IonRouterOutlet, IonAvatar, MenuController, IonButton, IonButtons } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { Firestore, doc } from '@angular/fire/firestore';
import { DataService, Serie, User } from '../../services/data.service';
import { addIcons } from 'ionicons';
import { logOut, person, close } from 'ionicons/icons';
import { Post } from '../../services/data.service';

@Component({
  selector: 'app-dynamic-layout',
  templateUrl: './dynamic-layout.component.html',
  styleUrls: ['./dynamic-layout.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonMenu,
    IonList,
    IonItem,
    IonMenuToggle,
    IonLabel,

    IonIcon,
    IonRouterOutlet,
    IonAvatar,
    IonButton,
    IonButtons
  ]
})
export class DynamicLayoutComponent implements OnInit {
  profile: User | null = null;
  series: Serie[] = [];
  specialPages: Post[] = [];

  constructor(
    private router: Router,
    private dataService: DataService,
    private auth: Auth,
    private firestore: Firestore,
    private menu: MenuController,
  ) {
    addIcons({close,person,logOut});

    // Listen for authentication state changes
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        console.log('User authenticated, loading profile...');
        // Load user profile using the Firebase Auth UID
        this.dataService.getUserById(user.uid).subscribe(res => {
          this.profile = res;
          console.log('Profile loaded:', this.profile);
          console.log('User role:', this.profile?.userRole);
        });
      } else {
        console.log('User not authenticated, clearing profile...');
        this.profile = null;
      }
    });

    // Load series/collections
    this.dataService.getSeries().subscribe({
      next: (res) => {
        console.log('🔍 DynamicLayout - Series loaded:', res);
        this.series = res;
      },
      error: (error) => {
        console.error('🔍 DynamicLayout - Error loading series:', error);
      }
    });
  }

  ngOnInit() {
    // Load special pages (e.g., privacy policy, license, meditation, etc.)
    this.dataService.getPosts().subscribe(posts => {
      // Assume special pages have a 'slug' in keywords or a type field
      this.specialPages = posts.filter(p => {
        const slugs = ['privacy-policy', 'license', 'meditation-for-christians'];
        return p.keywords && slugs.some(slug => p.keywords.toLowerCase().includes(slug));
      });
    });
  }

  async logout() {
    await this.auth.signOut();
    this.router.navigateByUrl('/landing', { replaceUrl: true });
  }

  async closeMenu() {
    await this.menu.close('first');
  }

  navigateToProfile() {
    if (this.profile?.id) {
      this.router.navigateByUrl(`/profile/${this.profile.id}`);
    }
  }

  getPageSlug(page: Post): string {
    if (page.keywords) {
      const slug = page.keywords.split(',')[0].trim();
      if (slug) return slug.toLowerCase();
    }
    return page.title ? page.title.toLowerCase().replace(/\s+/g, '-') : '';
  }
}

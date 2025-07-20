import { Component, ChangeDetectorRef } from '@angular/core';
import { IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonMenuToggle, IonAvatar, IonImg, IonLabel, IonButton, IonIcon, IonRouterOutlet } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AvatarService } from '../../services/avatar.service';
import { DataService, Serie, User } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';

@Component({
  selector: 'app-dynamic-layout',
  templateUrl: './dynamic-layout.component.html',
  styleUrls: ['./dynamic-layout.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    IonMenu,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonMenuToggle,
    IonAvatar,
    IonImg,
    IonLabel,
    IonButton,
    IonIcon,
    IonRouterOutlet
  ]
})
export class DynamicLayoutComponent {
  profile: User | null = null;
  series: Serie[] = [];

  constructor(
    private avatarService: AvatarService,
    private dataService: DataService,
    private authService: AuthService,
    private router: Router,
    private cd: ChangeDetectorRef,
    private auth: Auth
  ) {
    // Listen for authentication state changes
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        console.log('User authenticated, loading profile...');
        // Load user profile only when authenticated
        this.avatarService.getUserProfile().subscribe((data) => {
          this.profile = data as User;
          console.log('Profile loaded:', this.profile);
          console.log('User role:', this.profile?.userRole);
          console.log('Is admin?', this.profile?.userRole === 'admin');
          console.log('Profile ID:', this.profile?.id);
          this.cd.detectChanges();
        });
      } else {
        console.log('User not authenticated, clearing profile...');
        this.profile = null;
        this.cd.detectChanges();
      }
    });

    // Load series/collections (this can be loaded regardless of auth state)
    this.dataService.getSeries().subscribe(res => {
      this.series = res;
      console.log('Series loaded:', this.series);
      this.cd.detectChanges();
    });
  }

  async logout() {
    await this.authService.logout();
    this.router.navigateByUrl('/landing', { replaceUrl: true });
  }

  // Helper method to check if user is admin
  isAdmin(): boolean {
    return this.profile?.userRole === 'admin';
  }
}

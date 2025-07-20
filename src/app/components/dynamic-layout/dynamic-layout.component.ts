import { Component, ChangeDetectorRef, inject } from '@angular/core';
import { IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonMenuToggle, IonAvatar, IonImg, IonLabel, IonButton, IonIcon, IonRouterOutlet } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AvatarService } from '../../services/avatar.service';
import { DataService, Serie, User } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dynamic-layout',
  templateUrl: './dynamic-layout.component.html',
  styleUrls: ['./dynamic-layout.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
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

  private avatarService = inject(AvatarService);
  private dataService = inject(DataService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private cd = inject(ChangeDetectorRef);

  constructor() {
    // Load user profile
    this.avatarService.getUserProfile().subscribe((data) => {
      this.profile = data as User;
      this.cd.detectChanges();
    });

    // Load series/collections
    this.dataService.getSeries().subscribe(res => {
      this.series = res;
      this.cd.detectChanges();
    });
  }

  async logout() {
    await this.authService.logout();
    this.router.navigateByUrl('/landing', { replaceUrl: true });
  }
}

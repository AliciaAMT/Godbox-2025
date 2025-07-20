import { Component, OnInit } from '@angular/core';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonMenu, IonList, IonItem, IonMenuToggle, IonLabel, IonButton, IonIcon, IonRouterOutlet } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { Firestore, doc } from '@angular/fire/firestore';
import { DataService, Serie, User } from '../../services/data.service';
import { addIcons } from 'ionicons';
import { logOut } from 'ionicons/icons';

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
    IonButton,
    IonIcon,
    IonRouterOutlet
  ]
})
export class DynamicLayoutComponent implements OnInit {
  profile: User | null = null;
  series: Serie[] = [];

  constructor(
    private router: Router,
    private dataService: DataService,
    private auth: Auth,
    private firestore: Firestore,
  ) {
    addIcons({ logOut });

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
    this.dataService.getSeries().subscribe(res => {
      this.series = res;
    });
  }

  ngOnInit() {}

  async logout() {
    await this.auth.signOut();
    this.router.navigateByUrl('/landing', { replaceUrl: true });
  }
}

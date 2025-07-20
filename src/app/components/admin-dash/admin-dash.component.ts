import { Component, OnInit } from '@angular/core';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { Firestore, doc } from '@angular/fire/firestore';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-admin-dash',
  templateUrl: './admin-dash.component.html',
  styleUrls: ['./admin-dash.component.scss'],
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
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton
  ]
})
export class AdminDashComponent implements OnInit {
  profile = null;
  user: any = null;

  constructor(
    private router: Router,
    private dataService: DataService,
    private auth: Auth,
    private firestore: Firestore,
  ) {
    // Check if user is admin
    const user1 = this.auth.currentUser;
    if (user1) {
      const userDocRef = doc(this.firestore, `users/${user1.uid}`);
      this.dataService.getUserById(userDocRef.id).subscribe(res => {
        this.user = res;
        if (this.user?.userRole !== 'admin') {
          this.router.navigateByUrl('/home', { replaceUrl: true });
        }
      });
    }
  }

  ngOnInit() {}

  async uploadData() {
    // Database upload functionality
    console.log('Uploading database data...');
  }
}

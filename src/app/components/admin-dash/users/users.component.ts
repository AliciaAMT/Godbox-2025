import { Component, OnInit } from '@angular/core';
import { IonContent, IonGrid, IonRow, IonCol, IonList, IonItem, IonLabel } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DataService, User } from '../../../services/data.service';
import { BackButtonComponent } from '../../back-button/back-button.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonList,
    IonItem,
    IonLabel,
    BackButtonComponent
  ]
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  isLoading = true;

  constructor(
    private dataService: DataService,
    private router: Router
  ) {
    this.dataService.getUsers().subscribe(res => {
      console.log('🔍 UsersComponent - Retrieved users:', res);
      this.users = res;
      this.isLoading = false;
    }, error => {
      console.error('❌ UsersComponent - Error fetching users:', error);
      this.isLoading = false;
    });
  }

  ngOnInit() {
  }

  getRoleDisplayName(role: string | undefined): string {
    if (!role) return 'No Role';
    switch (role) {
      case 'admin':
        return 'Administrator';
      case 'user':
        return 'User';
      default:
        return role;
    }
  }
}

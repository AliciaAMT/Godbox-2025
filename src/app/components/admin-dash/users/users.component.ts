import { Component, OnInit } from '@angular/core';
import { IonContent, IonGrid, IonRow, IonCol, IonList, IonItem, IonLabel, IonSearchbar, IonButton } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DataService, User } from '../../../services/data.service';
import { BackButtonComponent } from '../../back-button/back-button.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonList,
    IonItem,
    IonLabel,
    IonSearchbar,
    IonButton,
    BackButtonComponent
  ]
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  isLoading = true;
  searchTerm: string = '';

  constructor(
    private dataService: DataService,
    private router: Router
  ) {
    this.dataService.getUsers().subscribe(res => {
      console.log('🔍 UsersComponent - Retrieved users:', res);
      this.users = res;
      this.filteredUsers = res;
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

  onSearchChange(event: any) {
    this.searchTerm = event.detail.value || '';
    this.filterUsers();
  }

  filterUsers() {
    if (!this.searchTerm.trim()) {
      this.filteredUsers = this.users;
      return;
    }

    const searchLower = this.searchTerm.toLowerCase().trim();
    this.filteredUsers = this.users.filter(user => {
      const email = user.email || '';
      return email.toLowerCase().includes(searchLower);
    });
  }

  clearSearch() {
    this.searchTerm = '';
    this.filteredUsers = this.users;
  }
}

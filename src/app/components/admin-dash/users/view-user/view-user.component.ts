import { Component, OnInit } from '@angular/core';
import { IonContent, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonIcon, IonInput, IonLabel, IonItem, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { DataService, User } from '../../../../services/data.service';
import { addIcons } from 'ionicons';
import { save, trash } from 'ionicons/icons';
import { BackButtonComponent } from '../../../back-button/back-button.component';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton,
    IonIcon,
    IonInput,
    IonLabel,
    IonItem,
    IonSelect,
    IonSelectOption,
    BackButtonComponent
  ]
})
export class ViewUserComponent implements OnInit {
  user: User | null = null;
  id: string | null = null;
  availableRoles = [
    { value: 'user', display: 'User' },
    { value: 'admin', display: 'Administrator' }
  ];

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    addIcons({save,trash});
  }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.dataService.getUserById(this.id).subscribe(res => {
        this.user = res;
      });
    }
  }

  async saveUser() {
    if (this.user && this.user.userName && this.user.userRole) {
      try {
        await this.dataService.updateUser(this.user);
        console.log('✅ User updated successfully');
        this.router.navigateByUrl('/admin-dash/users');
      } catch (error) {
        console.error('❌ Error updating user:', error);
        // You could add a toast notification here
      }
    } else {
      console.warn('⚠️ User data incomplete - cannot save');
    }
  }

  async updateUser() {
    await this.saveUser();
  }

  async deleteUser() {
    if (this.user) {
      try {
        await this.dataService.deleteUser(this.user);
        console.log('✅ User deleted successfully');
        this.router.navigateByUrl('/admin-dash/users');
      } catch (error) {
        console.error('❌ Error deleting user:', error);
      }
    }
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

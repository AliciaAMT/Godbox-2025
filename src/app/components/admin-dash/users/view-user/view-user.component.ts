import { Component, OnInit } from '@angular/core';
import { IonContent, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonIcon, IonInput, IonLabel, IonItem } from '@ionic/angular/standalone';
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
    BackButtonComponent
  ]
})
export class ViewUserComponent implements OnInit {
  user: User | null = null;
  id: string | null = null;

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
    if (this.user && this.user.userName) {
      await this.dataService.updateUser(this.user);
      this.router.navigateByUrl('/admin-dash/users');
    }
  }

  async updateUser() {
    await this.saveUser();
  }

  async deleteUser() {
    if (this.user) {
      await this.dataService.deleteUser(this.user);
      this.router.navigateByUrl('/admin-dash/users');
    }
  }
}

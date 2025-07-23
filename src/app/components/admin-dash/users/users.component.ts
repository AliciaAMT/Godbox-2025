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

  constructor(
    private dataService: DataService,
    private router: Router
  ) {
    this.dataService.getUsers().subscribe(res => {
      this.users = res;
    });
  }

  ngOnInit() {
  }

}

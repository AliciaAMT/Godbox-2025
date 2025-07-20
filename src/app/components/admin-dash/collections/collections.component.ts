import { Component, OnInit } from '@angular/core';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonGrid, IonRow, IonCol, IonList, IonItem, IonLabel, IonFab, IonFabButton, IonIcon, AlertController } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DataService, Serie, User } from '../../../services/data.service';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';

@Component({
  selector: 'app-collections',
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.scss'],
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
    IonList,
    IonItem,
    IonLabel,
    IonFab,
    IonFabButton,
    IonIcon
  ]
})
export class CollectionsComponent implements OnInit {
  series: Serie[] = [];
  users: User[] = [];

  constructor(
    private dataService: DataService,
    private router: Router,
    private alertController: AlertController
  ) {
    addIcons({ add });
    this.dataService.getSeries().subscribe(res => {
      this.series = res;
    });
    this.dataService.getUsers().subscribe(res => {
      this.users = res;
    });
  }

  ngOnInit() {
  }

  getUserName(userId: string): string {
    const user = this.users.find(u => u.id === userId);
    return user?.userName || 'Unknown User';
  }

  async addSeries() {
    const alert = await this.alertController.create({
      header: 'Add Collection',
      inputs: [
        {
          name: 'serieName',
          placeholder: 'Collection',
          type: 'text'
        },
        {
          name: 'privacy',
          placeholder: 'Privacy',
          type: 'radio',
          label: 'Private',
          value: 'private',
          checked: true
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        }, {
          text: 'Add',
          handler: res => {
            this.dataService.addSerie({ serieName: res.serieName, privacy: res.privacy });
          }
        }
      ]
    });
    await alert.present();
  }
}

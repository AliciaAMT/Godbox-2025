import { Component, OnInit } from '@angular/core';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonGrid, IonRow, IonCol, IonList, IonItem, IonLabel, IonFab, IonFabButton, IonIcon, AlertController } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DataService, Note, User } from '../../../services/data.service';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss'],
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
export class NotesComponent implements OnInit {
  notes: Note[] = [];
  users: User[] = [];

  constructor(
    private dataService: DataService,
    private router: Router,
    private alertController: AlertController
  ) {
    addIcons({ add });
    this.dataService.getNotes().subscribe(res => {
      this.notes = res;
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

  async addNote() {
    const alert = await this.alertController.create({
      header: 'Add Note',
      message: 'Enter a title and description for your note.',
      inputs: [
        {
          name: 'title',
          placeholder: 'My cool note',
          type: 'text'
        },
        {
          name: 'text',
          placeholder: 'Learn Ionic',
          type: 'textarea'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        }, {
          text: 'Add',
          handler: res => {
            this.dataService.addNote({ text: res.text, title: res.title });
          }
        }
      ]
    });
    await alert.present();
  }
}

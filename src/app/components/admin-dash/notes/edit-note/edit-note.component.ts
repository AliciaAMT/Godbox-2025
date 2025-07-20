import { Component, OnInit } from '@angular/core';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonLabel, IonInput, IonTextarea, IonButton, IonIcon, IonFab, IonFabButton } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { DataService, Note } from '../../../../services/data.service';

@Component({
  selector: 'app-edit-note',
  templateUrl: './edit-note.component.html',
  styleUrls: ['./edit-note.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
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
    IonItem,
    IonLabel,
    IonInput,
    IonTextarea,
    IonButton,
    IonIcon,
    IonFab,
    IonFabButton
  ]
})
export class EditNoteComponent implements OnInit {
  note: Note | null = null;
  id: string | null = null;

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.dataService.getNoteById(this.id).subscribe(res => {
        this.note = res;
      });
    }
  }

  async deleteNote() {
    if (!this.note) return;

    const alert = await this.alertController.create({
      header: 'Delete Note',
      message: 'Are you sure you want to delete this note?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          handler: () => {
            this.dataService.deleteNote(this.note!);
            this.router.navigateByUrl('/admin-dash/notes', { replaceUrl: true });
          }
        }
      ]
    });
    await alert.present();
  }

  async updateNote() {
    if (!this.note) return;

    await this.dataService.updateNote(this.note);
    const toast = await this.toastController.create({
      message: 'Note updated!',
      duration: 2000
    });
    toast.present();
    this.router.navigateByUrl('/admin-dash/notes', { replaceUrl: true });
  }
}

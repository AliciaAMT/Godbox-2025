import { Component, OnInit } from '@angular/core';
import { IonContent, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonIcon, IonInput, IonTextarea, IonLabel, IonItem } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { DataService, Note } from '../../../../services/data.service';
import { addIcons } from 'ionicons';
import { save, trash } from 'ionicons/icons';
import { BackButtonComponent } from '../../../back-button/back-button.component';

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
    IonTextarea,
    IonLabel,
    IonItem,
    BackButtonComponent
  ]
})
export class EditNoteComponent implements OnInit {
  note: Note | null = null;
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
      this.dataService.getNoteById(this.id).subscribe(res => {
        this.note = res;
      });
    }
  }

  async saveNote() {
    if (this.note && this.note.title && this.note.text) {
      await this.dataService.updateNote(this.note);
      this.router.navigateByUrl('/admin-dash/notes');
    }
  }

  async updateNote() {
    await this.saveNote();
  }

  async deleteNote() {
    if (this.note) {
      await this.dataService.deleteNote(this.note);
      this.router.navigateByUrl('/admin-dash/notes');
    }
  }
}

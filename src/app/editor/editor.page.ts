import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/angular/standalone';
import { FroalaEditorComponent } from '../components/froala-editor/froala-editor.component';

@Component({
  selector: 'app-editor-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    FroalaEditorComponent
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/home"></ion-back-button>
        </ion-buttons>
        <ion-title>Rich Text Editor</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-card>
        <ion-card-header>
          <ion-card-title>Froala Rich Text Editor</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <app-froala-editor [(content)]="content"></app-froala-editor>
        </ion-card-content>
      </ion-card>

      <ion-card>
        <ion-card-header>
          <ion-card-title>Preview</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <div [innerHTML]="content" class="preview-content"></div>
        </ion-card-content>
      </ion-card>
    </ion-content>
  `,
  styles: [`
    .preview-content {
      border: 1px solid #404040;
      padding: 1rem;
      border-radius: 8px;
      background-color: #1a1a1a;
      min-height: 100px;
    }

    ion-card {
      margin: 1rem;
    }
  `]
})
export class EditorPage {
  content = '<p>Start writing your rich text here...</p>';
}

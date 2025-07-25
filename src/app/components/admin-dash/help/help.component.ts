import { Component, ViewChild } from '@angular/core';
import { IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonGrid, IonRow, IonCol, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBack, informationCircle, people, documentText, folderOpen, archive, chatbubbles, library, settings, eye, eyeOff, person, list } from 'ionicons/icons';
import { BackButtonComponent } from '../../back-button/back-button.component';
import { SkipToTopComponent } from '../../skip-to-top/skip-to-top.component';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonGrid,
    IonRow,
    IonCol,
    IonIcon,
    BackButtonComponent,
    SkipToTopComponent
  ]
})
export class HelpComponent {
  @ViewChild(IonContent) ionContent!: IonContent;

  constructor() {
    addIcons({
      arrowBack,
      informationCircle,
      people,
      documentText,
      folderOpen,
      archive,
      chatbubbles,
      library,
      settings,
      eye,
      eyeOff,
      person,
      list
    });
  }
}

import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonButtons, IonButton, IonIcon, IonTitle } from '@ionic/angular/standalone';
import { Location } from '@angular/common';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { arrowBack } from 'ionicons/icons';

@Component({
  selector: 'app-back-button',
  templateUrl: './back-button.component.html',
  styleUrls: ['./back-button.component.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonTitle,
    CommonModule
  ]
})
export class BackButtonComponent {
  constructor(public location: Location) {
    addIcons({ arrowBack });
  }

  goBack() {
    this.location.back();
  }

  canGoBack(): boolean {
    return window.history.length > 1;
  }
}

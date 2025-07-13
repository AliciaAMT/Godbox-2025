import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonButton, IonIcon, IonContent, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonButton, IonIcon, IonContent, IonGrid, IonRow, IonCol, RouterLink
  ]
})
export class LandingPage {
  public readonly currentYear = new Date().getFullYear();
}

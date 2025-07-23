import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonButton, IonIcon, IonContent, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { FooterLandingComponent } from '../components/footer-landing/footer-landing.component';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonButton, IonIcon, IonContent, IonGrid, IonRow, IonCol, RouterLink, FooterLandingComponent
  ]
})
export class LandingPage {
  public readonly currentYear = new Date().getFullYear();

  openDevModal() {
    const modal = document.getElementById('dev-modal');
    if (modal) {
      modal.classList.add('show');
      modal.setAttribute('aria-hidden', 'false');
      modal.focus();
    }
  }
  closeDevModal() {
    const modal = document.getElementById('dev-modal');
    if (modal) {
      modal.classList.remove('show');
      modal.setAttribute('aria-hidden', 'true');
    }
  }
}

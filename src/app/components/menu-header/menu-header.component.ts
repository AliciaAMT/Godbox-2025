import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonBackButton, IonButton, IonIcon } from '@ionic/angular/standalone';
import { Location } from '@angular/common';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu-header',
  templateUrl: './menu-header.component.html',
  styleUrls: ['./menu-header.component.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonTitle,
    IonBackButton,
    IonButton,
    IonIcon,
    CommonModule
  ]
})
export class MenuHeaderComponent {
  isFullscreen = false;

  constructor(public location: Location) {
    // Listen for fullscreen changes
    document.addEventListener('fullscreenchange', () => {
      this.isFullscreen = !!document.fullscreenElement;
    });
  }

  goBack() {
    this.location.back();
  }

  canGoBack(): boolean {
    return window.history.length > 1;
  }

  goFullscreen() {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    }
  }
}

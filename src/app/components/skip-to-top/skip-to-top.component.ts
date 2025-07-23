import { Component } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowUp } from 'ionicons/icons';
import { CommonModule } from '@angular/common';

// Register the icon
addIcons({ arrowUp });

@Component({
  selector: 'app-skip-to-top',
  templateUrl: './skip-to-top.component.html',
  styleUrls: ['./skip-to-top.component.scss'],
  standalone: true,
  imports: [
    IonIcon,
    CommonModule
  ]
})
export class SkipToTopComponent {

  skipToTop(event?: Event) {
    if (event) {
      event.preventDefault();
    }

    // Find the ion-content element
    const ionContent = document.querySelector('ion-content');
    if (ionContent) {
      // Scroll the ion-content to top
      ionContent.scrollToTop(500);

      // After scrolling, focus the top element
      setTimeout(() => {
        const topElement = document.getElementById('top');
        if (topElement) {
          topElement.focus();
          return;
        }

        // Fallback to menu button
        const menuButton = document.querySelector('ion-menu-button') as HTMLElement;
        if (menuButton) {
          menuButton.focus();
          return;
        }
      }, 600);
    } else {
      // Fallback for non-Ionic scrolling
      window.scrollTo({ top: 0, behavior: 'smooth' });

      setTimeout(() => {
        const topElement = document.getElementById('top');
        if (topElement) {
          topElement.focus();
        }
      }, 600);
    }
  }
}

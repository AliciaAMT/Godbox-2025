import { Component, Input } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowUp } from 'ionicons/icons';
import { CommonModule } from '@angular/common';
import type { IonContent as IonContentRef } from '@ionic/angular/standalone';

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
  @Input() ionContentRef?: IonContentRef;

  skipToTop(event?: Event) {
    if (event) {
      event.preventDefault();
    }

    const ionContent = this.ionContentRef || document.querySelector('ion-content');
    if (ionContent) {
      // Scroll the ion-content to top
      (ionContent as any).scrollToTop(500);

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

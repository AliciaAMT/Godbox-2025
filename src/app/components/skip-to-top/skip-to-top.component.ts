import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skip-to-top',
  templateUrl: './skip-to-top.component.html',
  styleUrls: ['./skip-to-top.component.scss'],
  standalone: true,
  imports: [
    CommonModule
  ]
})
export class SkipToTopComponent {

  skipToTop(event?: Event) {
    if (event) {
      event.preventDefault();
    }

    const menuButton = document.querySelector('ion-menu-button') as HTMLElement;
    if (menuButton) {
      menuButton.focus();
      return;
    }

    const firstFocusable = document.querySelector('ion-header, ion-button, ion-item, a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])') as HTMLElement;
    if (firstFocusable) {
      firstFocusable.focus();
      return;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

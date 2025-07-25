import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent } from '@ionic/angular/standalone';
import { BackButtonComponent } from '../components/back-button/back-button.component';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [CommonModule, IonContent, BackButtonComponent],
  templateUrl: './privacy.page.html',
  styleUrls: ['./privacy.page.scss']
})
export class PrivacyPage {}

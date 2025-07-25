import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent } from '@ionic/angular/standalone';
import { BackButtonComponent } from '../components/back-button/back-button.component';

@Component({
  selector: 'app-hebrew-calendar-education',
  standalone: true,
  imports: [CommonModule, IonContent, BackButtonComponent],
  templateUrl: './hebrew-calendar-education.page.html',
  styleUrls: ['./hebrew-calendar-education.page.scss']
})
export class HebrewCalendarEducationPage {}

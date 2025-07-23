import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackButtonComponent } from '../../components/back-button/back-button.component';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [CommonModule, BackButtonComponent],
  templateUrl: './privacy.page.html',
  styleUrls: ['./privacy.page.scss']
})
export class PrivacyPage {}

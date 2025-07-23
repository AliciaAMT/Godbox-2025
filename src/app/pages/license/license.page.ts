import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackButtonComponent } from '../../components/back-button/back-button.component';

@Component({
  selector: 'app-license',
  standalone: true,
  imports: [CommonModule, BackButtonComponent],
  templateUrl: './license.page.html',
  styleUrls: ['./license.page.scss']
})
export class LicensePage {}

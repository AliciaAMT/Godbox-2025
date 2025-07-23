import { Component, OnInit } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BackButtonComponent } from '../../back-button/back-button.component';

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IonContent,

    BackButtonComponent
  ]
})
export class ArchiveComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

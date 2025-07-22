import { Component, OnInit } from '@angular/core';
import { IonContent, IonFab, IonFabButton, IonIcon } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BackButtonComponent } from '../../back-button/back-button.component';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IonContent,
    IonFab,
    IonFabButton,
    IonIcon,
    BackButtonComponent
  ]
})
export class CommentsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

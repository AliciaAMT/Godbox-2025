import { Component, OnInit } from '@angular/core';
import { IonContent, IonGrid, IonRow, IonCol, IonItem } from '@ionic/angular/standalone';
import { MenuHeaderComponent } from '../components/menu-header/menu-header.component';
import { DataService } from '../services/data.service';
import { Post } from '../services/data.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-breath-meditation',
  templateUrl: './breath-meditation.page.html',
  styleUrls: ['./breath-meditation.page.scss'],
  standalone: true,
  imports: [
    IonContent,

    IonGrid,
    IonRow,
    IonCol,
    IonItem,
    MenuHeaderComponent,
    CommonModule,
    RouterModule
  ]
})
export class BreathMeditationPage implements OnInit {
  container: string = '';
  text: string = '';

  totalTime = 7500;
  breatheTime = (this.totalTime / 5) * 2;
  holdTime = this.totalTime / 5;

  posts: Post[] = [];
  collectionOverview: Post | null = null;

  constructor(private dataService: DataService) {
    // Get posts from "Meditation for Christians" collection
    this.dataService.getPostsBySerieId('Meditation for Christians').subscribe(res => {
      this.posts = res.filter(post => post.seqNo >= 1 && post.privacy !== 'private');
      this.collectionOverview = res.find(post => post.seqNo === 1) || null;
    });
  }

  breatheAnimation() {
    this.text = 'Breathe In!';
    this.container = 'container grow';

    setTimeout(() => {
      this.text = 'Hold';

      setTimeout(() => {
        this.text = 'Breathe Out!';
        this.container = 'container shrink';
      }, this.holdTime);
    }, this.breatheTime);
  }

  ngOnInit() {
    this.breatheAnimation();
    setInterval(() => {
      this.breatheAnimation();
    }, this.totalTime);
  }
}

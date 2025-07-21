import { Component, OnInit } from '@angular/core';
import { IonContent, IonFab, IonFabButton, IonIcon } from '@ionic/angular/standalone';
import { MenuHeaderComponent } from '../components/menu-header/menu-header.component';
import { DataService } from '../services/data.service';
import { Post } from '../services/data.service';

@Component({
  selector: 'app-breath-meditation',
  templateUrl: './breath-meditation.page.html',
  styleUrls: ['./breath-meditation.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonFab,
    IonFabButton,
    IonIcon,
    MenuHeaderComponent
  ]
})
export class BreathMeditationPage implements OnInit {
  container: string = '';
  text: string = '';

  totalTime = 7500;
  breatheTime = (this.totalTime / 5) * 2;
  holdTime = this.totalTime / 5;

  posts: Post[] = [];

  constructor(private dataService: DataService) {
    this.dataService.getPublicPosts().subscribe(res => {
      this.posts = res.filter(post => {
        if (!post.category) return false;
        if (Array.isArray(post.category)) {
          return post.category.some(cat => typeof cat === 'string' && cat.toLowerCase().includes('meditation for christians'));
        }
        return typeof post.category === 'string' && post.category.toLowerCase().includes('meditation for christians');
      });
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

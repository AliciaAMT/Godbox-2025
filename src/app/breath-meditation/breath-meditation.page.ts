import { Component, OnInit } from '@angular/core';
import { IonContent, IonFab, IonFabButton, IonIcon } from '@ionic/angular/standalone';
import { MenuHeaderComponent } from '../components/menu-header/menu-header.component';

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

  constructor() {}

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

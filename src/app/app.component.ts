import { Component } from '@angular/core';
import { IonApp } from '@ionic/angular/standalone';
import { DynamicLayoutComponent } from './components/dynamic-layout/dynamic-layout.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [
    IonApp,
    DynamicLayoutComponent
  ],
})
export class AppComponent {
  constructor() {}
}

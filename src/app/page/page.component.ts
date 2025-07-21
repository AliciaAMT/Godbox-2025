import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DataService, Post } from '../services/data.service';
import { IonContent, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonImg } from '@ionic/angular/standalone';
import { FooterLandingComponent } from '../components/footer-landing/footer-landing.component';
import { MenuHeaderComponent } from '../components/menu-header/menu-header.component';

@Component({
  selector: 'app-page',
  template: `
    <app-menu-header></app-menu-header>
    <ion-content>
      <ion-grid>
        <ion-row>
          <ion-col class="ion-text-center">
            <ng-container *ngIf="post; else notFound">
              <ion-card style="margin-top: 32px;">
                <ion-card-header>
                  <ion-img *ngIf="post.imageUrl" [src]="post.imageUrl"></ion-img>
                  <ion-card-title><h2>{{ post.title }}</h2></ion-card-title>
                </ion-card-header>
                <ion-card-content>
                  <div [innerHTML]="post.content"></div>
                </ion-card-content>
              </ion-card>
            </ng-container>
            <ng-template #notFound>
              <h2>Page Not Found</h2>
              <p>The requested page does not exist.</p>
            </ng-template>
          </ion-col>
        </ion-row>
      </ion-grid>
      <app-footer-landing></app-footer-landing>
    </ion-content>
  `,
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonImg,
    FooterLandingComponent,
    MenuHeaderComponent
  ]
})
export class PageComponent implements OnInit {
  post: Post | null = null;
  private dataService = inject(DataService);
  private route = inject(ActivatedRoute);

  ngOnInit() {
    this.route.params.subscribe(params => {
      const slug = params['slug'];
      if (slug) {
        this.dataService.getPosts().subscribe(posts => {
          this.post = posts.find(p => p.keywords?.split(',').map(s => s.trim().toLowerCase()).includes(slug.toLowerCase()) || p.title?.toLowerCase().replace(/\s+/g, '-') === slug.toLowerCase()) || null;
        });
      }
    });
  }
}

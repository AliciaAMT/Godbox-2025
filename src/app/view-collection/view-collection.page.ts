import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonFab, IonFabButton, IonIcon, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonImg } from '@ionic/angular/standalone';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DataService, Post } from '../services/data.service';
import { FooterLandingComponent } from '../components/footer-landing/footer-landing.component';

@Component({
  selector: 'app-view-collection',
  templateUrl: './view-collection.page.html',
  styleUrls: ['./view-collection.page.scss'],
  standalone: true,
  imports: [IonContent, IonFab, IonFabButton, IonIcon, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonImg, CommonModule, FormsModule, RouterModule, FooterLandingComponent]
})
export class ViewCollectionPage implements OnInit {
  collectionId: string = '';
  posts: Post[] = [];

  private dataService = inject(DataService);
  private route = inject(ActivatedRoute);

  constructor() {
    this.route.params.subscribe(params => {
      this.collectionId = params['id'];
      if (this.collectionId) {
        this.dataService.getPostsBySerieId(this.collectionId).subscribe(res => {
          this.posts = res;
        });
      }
    });
  }

  ngOnInit() {
  }

}

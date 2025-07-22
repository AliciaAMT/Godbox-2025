import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DataService, Post, Serie } from '../services/data.service';
import { FooterLandingComponent } from '../components/footer-landing/footer-landing.component';
import { BackButtonComponent } from '../components/back-button/back-button.component';

@Component({
  selector: 'app-view-collection',
  templateUrl: './view-collection.page.html',
  styleUrls: ['./view-collection.page.scss'],
  standalone: true,
  imports: [IonContent, IonGrid, IonRow, IonCol, CommonModule, FormsModule, RouterModule, FooterLandingComponent, BackButtonComponent]
})
export class ViewCollectionPage implements OnInit {
  collectionId: string = '';
  posts: Post[] = [];
  serie: Serie | null = null;

  private dataService = inject(DataService);
  private route = inject(ActivatedRoute);

  constructor() {
    this.route.params.subscribe(params => {
      this.collectionId = params['id'];
      console.log('🔍 ViewCollectionPage - Collection ID:', this.collectionId);

      if (this.collectionId) {
        // First get the series object (like the old project)
        this.dataService.getSerieById(this.collectionId).subscribe({
          next: (res) => {
            console.log('🔍 ViewCollectionPage - Series found:', res);
            this.serie = res;
          },
          error: (error) => {
            console.error('🔍 ViewCollectionPage - Error fetching series:', error);
          }
        });

        // Then get the posts for this series
        this.dataService.getPostsBySerieId(this.collectionId).subscribe({
          next: (res) => {
            console.log('🔍 ViewCollectionPage - Posts found for collection:', res);
            this.posts = res;
          },
          error: (error) => {
            console.error('🔍 ViewCollectionPage - Error fetching posts:', error);
          }
        });
      }
    });
  }

  ngOnInit() {
  }

}

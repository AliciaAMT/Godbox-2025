import { Component, OnInit } from '@angular/core';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonIcon, IonInput, IonSelect, IonSelectOption, IonLabel, IonItem, IonFab, IonFabButton } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { DataService, Serie } from '../../../../services/data.service';
import { addIcons } from 'ionicons';
import { save } from 'ionicons/icons';

@Component({
  selector: 'app-edit-collection',
  templateUrl: './edit-collection.component.html',
  styleUrls: ['./edit-collection.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton,
    IonIcon,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonLabel,
    IonItem,
    IonFab,
    IonFabButton
  ]
})
export class EditCollectionComponent implements OnInit {
  serie: Serie | null = null;
  id: string | null = null;

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    addIcons({ save });
  }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.dataService.getSerieById(this.id).subscribe(res => {
        this.serie = res;
      });
    }
  }

  async saveSerie() {
    if (this.serie && this.serie.serieName) {
      await this.dataService.updateSerie(this.serie);
      this.router.navigateByUrl('/admin-dash/collections');
    }
  }

  async updateSerie() {
    await this.saveSerie();
  }

  async deleteSerie() {
    if (this.serie) {
      await this.dataService.deleteSerie(this.serie);
      this.router.navigateByUrl('/admin-dash/collections');
    }
  }
}

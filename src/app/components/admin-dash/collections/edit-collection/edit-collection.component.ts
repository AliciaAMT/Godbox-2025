import { Component, OnInit } from '@angular/core';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonLabel, IonInput, IonSelect, IonSelectOption, IonButton, IonIcon, IonFab, IonFabButton } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { DataService, Serie } from '../../../../services/data.service';

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
    IonItem,
    IonLabel,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonButton,
    IonIcon,
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
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.dataService.getSerieById(this.id).subscribe(res => {
        this.serie = res;
      });
    }
  }

  async deleteSerie() {
    if (!this.serie) return;

    const alert = await this.alertController.create({
      header: 'Delete Collection',
      message: 'Are you sure you want to delete this collection?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          handler: () => {
            this.dataService.deleteSerie(this.serie!);
            this.router.navigateByUrl('/admin-dash/collections', { replaceUrl: true });
          }
        }
      ]
    });
    await alert.present();
  }

  async updateSerie() {
    if (!this.serie) return;

    await this.dataService.updateSerie(this.serie);
    const toast = await this.toastController.create({
      message: 'Collection updated!',
      duration: 2000
    });
    toast.present();
    this.router.navigateByUrl('/admin-dash/collections', { replaceUrl: true });
  }
}

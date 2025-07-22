import { Component, OnInit } from '@angular/core';
import { IonContent, IonGrid, IonRow, IonCol, IonList, IonItem, IonLabel, IonFab, IonFabButton, IonIcon, AlertController } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DataService, Category } from '../../../services/data.service';
import { BackButtonComponent } from '../../back-button/back-button.component';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonList,
    IonItem,
    IonLabel,
    IonFab,
    IonFabButton,
    IonIcon,
    BackButtonComponent
  ]
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];

  constructor(
    private dataService: DataService,
    private router: Router,
    private alertController: AlertController
  ) {
    addIcons({ add });
    this.dataService.getCategories().subscribe(res => {
      this.categories = res;
    });
  }

  ngOnInit() {
  }

  async addCategory() {
    const alert = await this.alertController.create({
      header: 'Add Category',
      inputs: [
        {
          name: 'categoryName',
          placeholder: 'Category',
          type: 'text'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        }, {
          text: 'Add',
          handler: res => {
            this.dataService.addCategory({ categoryName: res.categoryName });
          }
        }
      ]
    });
    await alert.present();
  }
}

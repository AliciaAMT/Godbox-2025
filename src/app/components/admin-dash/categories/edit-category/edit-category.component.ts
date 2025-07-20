import { Component, OnInit } from '@angular/core';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonLabel, IonInput, IonButton, IonIcon, IonFab, IonFabButton } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { DataService, Category } from '../../../../services/data.service';

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.scss'],
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
    IonButton,
    IonIcon,
    IonFab,
    IonFabButton
  ]
})
export class EditCategoryComponent implements OnInit {
  category: Category | null = null;
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
      this.dataService.getCategoryById(this.id).subscribe(res => {
        this.category = res;
      });
    }
  }

  async deleteCategory() {
    if (!this.category) return;

    const alert = await this.alertController.create({
      header: 'Delete Category',
      message: 'Are you sure you want to delete this category?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          handler: () => {
            this.dataService.deleteCategory(this.category!);
            this.router.navigateByUrl('/admin-dash/categories', { replaceUrl: true });
          }
        }
      ]
    });
    await alert.present();
  }

  async updateCategory() {
    if (!this.category) return;

    await this.dataService.updateCategory(this.category);
    const toast = await this.toastController.create({
      message: 'Category updated!',
      duration: 2000
    });
    toast.present();
    this.router.navigateByUrl('/admin-dash/categories', { replaceUrl: true });
  }
}

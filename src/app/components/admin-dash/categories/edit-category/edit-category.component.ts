import { Component, OnInit } from '@angular/core';
import { IonContent, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonIcon, IonInput, IonLabel, IonItem } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { DataService, Category } from '../../../../services/data.service';
import { addIcons } from 'ionicons';
import { save, trash } from 'ionicons/icons';
import { BackButtonComponent } from '../../../back-button/back-button.component';

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
    IonLabel,
    IonItem,
    BackButtonComponent
  ]
})
export class EditCategoryComponent implements OnInit {
  category: Category | null = null;
  id: string | null = null;

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    addIcons({save,trash});
  }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.dataService.getCategoryById(this.id).subscribe(res => {
        this.category = res;
      });
    }
  }

  async saveCategory() {
    if (this.category && this.category.categoryName) {
      await this.dataService.updateCategory(this.category);
      this.router.navigateByUrl('/admin-dash/categories');
    }
  }

  async updateCategory() {
    await this.saveCategory();
  }

  async deleteCategory() {
    if (this.category) {
      await this.dataService.deleteCategory(this.category);
      this.router.navigateByUrl('/admin-dash/categories');
    }
  }
}

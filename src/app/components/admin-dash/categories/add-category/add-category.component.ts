import { Component } from '@angular/core';
import { IonContent, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonIcon, IonInput, IonLabel, IonItem } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { DataService, Category } from '../../../../services/data.service';
import { BackButtonComponent } from '../../../back-button/back-button.component';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
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
export class AddCategoryComponent {
  categoryForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private router: Router
  ) {
    addIcons({ add });
    this.categoryForm = this.formBuilder.group({
      categoryName: ['', Validators.required]
    });
  }

  async addCategory() {
    if (this.categoryForm.valid) {
      const formValue = this.categoryForm.value;
      await this.dataService.addCategory({
        categoryName: formValue.categoryName
      });
      this.router.navigateByUrl('/admin-dash/categories');
    }
  }
}

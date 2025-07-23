import { Component } from '@angular/core';
import { IonContent, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonIcon, IonInput, IonSelect, IonSelectOption, IonLabel, IonItem } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { DataService, Serie } from '../../../../services/data.service';
import { BackButtonComponent } from '../../../back-button/back-button.component';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';

@Component({
  selector: 'app-add-collection',
  templateUrl: './add-collection.component.html',
  styleUrls: ['./add-collection.component.scss'],
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
    IonSelect,
    IonSelectOption,
    IonLabel,
    IonItem,
    BackButtonComponent
  ]
})
export class AddCollectionComponent {
  collectionForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private router: Router
  ) {
    addIcons({ add });
    this.collectionForm = this.formBuilder.group({
      serieName: ['', Validators.required],
      privacy: ['private', Validators.required]
    });
  }

  async addCollection() {
    if (this.collectionForm.valid) {
      const formValue = this.collectionForm.value;
      await this.dataService.addSerie({
        serieName: formValue.serieName,
        privacy: formValue.privacy
      });
      this.router.navigateByUrl('/admin-dash/collections');
    }
  }
}

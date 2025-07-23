import { Component, Input } from '@angular/core';
import { IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonIcon, IonInput, IonSelect, IonSelectOption, IonLabel, IonItem, IonTextarea, IonButtons, IonHeader, IonToolbar, IonTitle } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular/standalone';
import { DataService, User } from '../../services/data.service';
import { addIcons } from 'ionicons';
import { save, close } from 'ionicons/icons';

@Component({
  selector: 'app-edit-profile-modal',
  templateUrl: './edit-profile-modal.component.html',
  styleUrls: ['./edit-profile-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonContent,
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
    IonTextarea,
    IonButtons,
    IonHeader,
    IonToolbar,
    IonTitle
  ]
})
export class EditProfileModalComponent {
  @Input() user!: User;

  profileForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private modalController: ModalController
  ) {
    addIcons({ save, close });

    this.profileForm = this.formBuilder.group({
      userName: ['', Validators.required],
      bio: [''],
      bibleVersion: ['ESV', Validators.required]
    });
  }

  ngOnInit() {
    if (this.user) {
      this.profileForm.patchValue({
        userName: this.user.userName || '',
        bio: this.user.bio || '',
        bibleVersion: this.user.bibleVersion || 'ESV'
      });
    }
  }

  async saveProfile() {
    if (this.profileForm.valid) {
      const formValue = this.profileForm.value;

      const updatedUser: User = {
        ...this.user,
        userName: formValue.userName,
        bio: formValue.bio,
        bibleVersion: formValue.bibleVersion
      };

      await this.dataService.updateUser(updatedUser);
      this.modalController.dismiss(updatedUser);
    }
  }

  cancel() {
    this.modalController.dismiss();
  }
}

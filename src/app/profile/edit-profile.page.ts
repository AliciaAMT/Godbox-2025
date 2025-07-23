import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonIcon, IonLabel, IonItem, IonSelect, IonSelectOption, IonInput, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';
import { DataService, User } from '../services/data.service';
import { FroalaEditorComponent } from '../components/froala-editor/froala-editor.component';
import { BackButtonComponent } from '../components/back-button/back-button.component';
import { addIcons } from 'ionicons';
import { save, arrowBack } from 'ionicons/icons';

@Component({
  selector: 'app-edit-profile-page',
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
    IonLabel,
    IonItem,
    IonSelect,
    IonSelectOption,
    IonInput,
    FroalaEditorComponent,
    BackButtonComponent,
    IonGrid,
    IonRow,
    IonCol
  ],
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss']
})
export class EditProfilePage implements OnInit {
  profileForm!: FormGroup;
  userId: string = '';
  loading = true;

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    addIcons({ save, arrowBack });
  }

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id') || '';
    this.profileForm = this.fb.group({
      userName: ['', Validators.required],
      bio: [''],
      bibleVersion: ['ESV', Validators.required]
    });
    if (this.userId) {
      this.dataService.getUserById(this.userId).subscribe(user => {
        this.profileForm.patchValue({
          userName: user.userName || '',
          bibleVersion: user.bibleVersion || 'ESV'
        });
        // Patch bio after a short delay to ensure Froala is ready
        setTimeout(() => {
          this.profileForm.patchValue({
            bio: user.bio || ''
          });
        }, 0);
        this.loading = false;
      });
    }
  }

  async saveProfile() {
    if (this.profileForm.valid) {
      const formValue = this.profileForm.value;
      const updatedUser: User = {
        id: this.userId,
        userName: formValue.userName,
        bio: formValue.bio,
        bibleVersion: formValue.bibleVersion
      };
      await this.dataService.updateUser(updatedUser);
      this.router.navigate(['/profile', this.userId]);
    }
  }

  cancel() {
    this.router.navigate(['/profile', this.userId]);
  }

  focusFroalaToolbar() {
    // Try to focus the first visible Froala toolbar button
    setTimeout(() => {
      const toolbarBtn =
        document.querySelector('.fr-toolbar .fr-btn, .fr-toolbar button, .fr-toolbar [tabindex="0"]');
      if (toolbarBtn) {
        (toolbarBtn as HTMLElement).focus();
      } else {
        // Fallback: focus the toolbar container itself
        const toolbar = document.querySelector('.fr-toolbar');
        if (toolbar) {
          (toolbar as HTMLElement).focus();
        }
      }
    }, 100);
  }
}

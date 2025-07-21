import { Component, OnInit } from '@angular/core';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonIcon, IonInput, IonSelect, IonSelectOption, IonLabel, IonItem, IonFab, IonFabButton } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { DataService, Post, Category, Serie } from '../../../../services/data.service';
import { addIcons } from 'ionicons';
import { save, arrowBack, create } from 'ionicons/icons';
import { FroalaEditorComponent } from '../../../froala-editor/froala-editor.component';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
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
    IonFabButton,
    FroalaEditorComponent
  ]
})
export class AddPostComponent implements OnInit {
  postForm!: FormGroup;
  categories: Category[] = [];
  series: Serie[] = [];

  constructor(
    private dataService: DataService,
    private router: Router,
    private fb: FormBuilder,
    private auth: Auth
  ) {
    addIcons({arrowBack,save,create});
    this.dataService.getCategories().subscribe(res => {
      this.categories = res;
    });
    this.dataService.getSeries().subscribe(res => {
      this.series = res;
    });
  }

  ngOnInit() {
    const userId = this.auth.currentUser?.uid || 'anonymous';
    this.postForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(10000)]],
      imageUrl: [''],
      preview: ['', [Validators.required, Validators.maxLength(1000)]],
      category: ['', Validators.required],
      content: ['', [Validators.required, Validators.maxLength(10000)]],
      keywords: [''],
      author: [userId],
      date: [new Date().toISOString()],
      likes: ['0'],
      views: ['0'],
      privacy: ['private', Validators.required],
      series: [''],
      seqNo: [0]
    });
  }

  async savePost() {
    if (this.postForm.valid) {
      const post: Post = this.postForm.value;
      await this.dataService.addPost(post);
      this.router.navigateByUrl('/admin-dash/posts');
    } else {
      this.postForm.markAllAsTouched();
    }
  }

  async addPost() {
    await this.savePost();
  }

  async onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const storage = getStorage();
    const userId = this.postForm.get('author')?.value || 'anonymous';
    const filePath = `public/uploads/${userId}/${Date.now()}_${file.name}`;
    const storageRef = ref(storage, filePath);
    await uploadBytes(storageRef, file);
    const imageUrl = await getDownloadURL(storageRef);
    this.postForm.patchValue({ imageUrl });
  }

  onImageSelectedClick() {
    const fileInput = document.getElementById('hiddenImageInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }
}

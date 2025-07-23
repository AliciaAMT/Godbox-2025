import { Component, OnInit } from '@angular/core';
import { IonContent, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonIcon, IonInput, IonSelect, IonSelectOption, IonLabel, IonItem } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { DataService, Post, Category, Serie } from '../../../../services/data.service';
import { addIcons } from 'ionicons';
import { save, arrowBack, create } from 'ionicons/icons';
import { BackButtonComponent } from '../../../back-button/back-button.component';
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
    BackButtonComponent,
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
      content: ['', [Validators.required, Validators.maxLength(200000)]],
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
      const userId = this.auth.currentUser?.uid || 'anonymous';
      let post: Post = this.postForm.value;
      post.author = userId;
      post.date = new Date().toISOString();
      // Auto-generate description if blank
      if (!post.description || post.description.trim() === '') {
        // Prefer preview, fallback to content
        const html = post.preview || post.content || '';
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        const text = tmp.textContent || tmp.innerText || '';
        post.description = text.substring(0, 150) + (text.length > 150 ? '...' : '');
      }
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

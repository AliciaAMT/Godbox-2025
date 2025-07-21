import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonIcon, IonInput, IonSelect, IonSelectOption, IonLabel, IonItem, IonFab, IonFabButton } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { DataService, Post, Category, Serie } from '../../../../services/data.service';
import { addIcons } from 'ionicons';
import { save, arrowBack, trash, create } from 'ionicons/icons';
import { FroalaEditorComponent } from '../../../froala-editor/froala-editor.component';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.scss'],
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
export class EditPostComponent implements OnInit {
  postForm!: FormGroup;
  categories: Category[] = [];
  series: Serie[] = [];
  id: string | null = null;

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private auth: Auth
  ) {
    addIcons({arrowBack,save,trash,create});
    this.dataService.getCategories().subscribe(res => {
      this.categories = res;
    });
    this.dataService.getSeries().subscribe(res => {
      this.series = res;
    });
  }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.postForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(10000)]],
      imageUrl: [''],
      preview: ['', [Validators.required, Validators.maxLength(1000)]],
      category: ['', Validators.required],
      content: ['', [Validators.required, Validators.maxLength(10000)]],
      keywords: [''],
      author: [''],
      date: [''],
      likes: ['0'],
      views: ['0'],
      privacy: ['private', Validators.required],
      series: [''],
      seqNo: [0]
    });
    if (this.id) {
      this.dataService.getPostById(this.id).subscribe(res => {
        if (res) {
          this.postForm.patchValue(res);
          this.cd.detectChanges();
        }
      });
    }
  }

  async savePost() {
    if (this.postForm.valid) {
      let post: Post = { ...this.postForm.value, id: this.id };
      // Preserve author and date if not changed
      if (!post.author) {
        post.author = this.auth.currentUser?.uid || 'anonymous';
      }
      if (!post.date) {
        post.date = new Date().toISOString();
      }
      // Auto-generate description if blank
      if (!post.description || post.description.trim() === '') {
        const html = post.preview || post.content || '';
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        const text = tmp.textContent || tmp.innerText || '';
        post.description = text.substring(0, 150) + (text.length > 150 ? '...' : '');
      }
      await this.dataService.updatePost(post);
      this.router.navigateByUrl('/admin-dash/posts');
    } else {
      this.postForm.markAllAsTouched();
    }
  }

  async updatePost() {
    await this.savePost();
  }

  async deletePost() {
    if (this.id) {
      await this.dataService.deletePost({ id: this.id } as Post);
      this.router.navigateByUrl('/admin-dash/posts');
    }
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

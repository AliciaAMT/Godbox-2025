import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { IonicModule } from '@ionic/angular';
import { QuillUploadService } from '../../services/quill-upload.service';
import { QuillConfig } from '../../utils/quill-config';

@Component({
  selector: 'app-quill-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, QuillModule, IonicModule],
  template: `
    <div class="quill-container">
      <quill-editor
        [(ngModel)]="content"
        [modules]="modules"
        [placeholder]="placeholder"
        [theme]="theme"
        [readOnly]="readOnly"
        [formats]="formats"
        (onEditorCreated)="onEditorCreated($event)"
        (onContentChanged)="onContentChanged($event)"
        (onSelectionChanged)="onSelectionChanged($event)"
        (onTextChange)="onTextChange($event)"
        (onEditorBlur)="onEditorBlur($event)"
        (onEditorFocus)="onEditorFocus($event)">
      </quill-editor>
    </div>
  `,
  styles: [`
    .quill-container {
      margin: 16px 0;
    }

    /* Custom Quill styling for dark theme compatibility */
    ::ng-deep .ql-editor {
      background: var(--ion-color-light);
      color: var(--ion-color-dark);
      min-height: 200px;
      border-radius: 8px;
      padding: 16px;
    }

    ::ng-deep .ql-toolbar {
      background: var(--ion-color-light-shade);
      border: 1px solid var(--ion-color-medium);
      border-radius: 8px 8px 0 0;
    }

    ::ng-deep .ql-container {
      border: 1px solid var(--ion-color-medium);
      border-top: none;
      border-radius: 0 0 8px 8px;
    }

    /* Dark theme adjustments */
    @media (prefers-color-scheme: dark) {
      ::ng-deep .ql-editor {
        background: var(--ion-color-dark);
        color: var(--ion-color-light);
      }

      ::ng-deep .ql-toolbar {
        background: var(--ion-color-dark-shade);
        border-color: var(--ion-color-medium);
      }

      ::ng-deep .ql-container {
        border-color: var(--ion-color-medium);
      }
    }
  `]
})
export class QuillEditorComponent implements OnInit, OnDestroy {
  @Input() content: string = '';
  @Input() placeholder: string = 'Write something great...';
  @Input() theme: 'snow' | 'bubble' = 'snow';
  @Input() readOnly: boolean = false;
  @Input() enableImageUpload: boolean = true;
  @Input() enableImageCompression: boolean = true;
  @Input() formats: string[] = [
    'bold', 'italic', 'underline', 'strike',
    'blockquote', 'code-block', 'list', 'bullet',
    'link', 'image', 'video', 'clean'
  ];
  @Input() toolbarOptions: any[] = [
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'script': 'sub'}, { 'script': 'super' }],
    [{ 'indent': '-1'}, { 'indent': '+1' }],
    [{ 'direction': 'rtl' }],
    [{ 'size': ['small', false, 'large', 'huge'] }],
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'font': [] }],
    [{ 'align': [] }],
    ['clean'],
    ['link', 'image', 'video']
  ];

  @Output() contentChange = new EventEmitter<string>();
  @Output() editorCreated = new EventEmitter<any>();
  @Output() contentChanged = new EventEmitter<any>();
  @Output() selectionChanged = new EventEmitter<any>();
  @Output() textChange = new EventEmitter<any>();
  @Output() editorBlur = new EventEmitter<any>();
  @Output() editorFocus = new EventEmitter<any>();

  modules: any = {};

  constructor(
    private ngZone: NgZone,
    private uploadService?: QuillUploadService
  ) {}

    ngOnInit() {
    // Get base modules from config
    const baseModules = QuillConfig.getModules(this.ngZone);

    this.modules = {
      ...baseModules,
      toolbar: this.toolbarOptions
    };

    // Only add image upload modules if enabled and service is available
    if (this.enableImageUpload && this.uploadService) {
      this.modules.imageUploader = {
        upload: (file: File) => {
          return this.uploadImage(file);
        }
      };

      this.modules.imageDrop = {
        upload: (file: File) => {
          return this.uploadImage(file);
        }
      };
    }
  }

  ngOnDestroy() {
    // Cleanup if needed
  }

  onEditorCreated(editor: any) {
    // Handle Zone.js issues
    QuillConfig.handleZoneJSIssues(editor, this.ngZone);
    this.editorCreated.emit(editor);
  }

  onContentChanged(delta: any) {
    this.contentChanged.emit(delta);
  }

  onSelectionChanged(range: any) {
    this.selectionChanged.emit(range);
  }

  onTextChange(delta: any) {
    this.textChange.emit(delta);
    this.contentChange.emit(this.content);
  }

  onEditorBlur(editor: any) {
    this.editorBlur.emit(editor);
  }

  onEditorFocus(editor: any) {
    this.editorFocus.emit(editor);
  }

      private async uploadImage(file: File): Promise<string> {
    try {
      // If upload service is not available, return a placeholder
      if (!this.uploadService) {
        console.warn('Upload service not available, returning placeholder URL');
        return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
      }

      // Validate file
      this.uploadService.validateImageFile(file);

      // Compress image if enabled
      let processedFile = file;
      if (this.enableImageCompression) {
        processedFile = await this.uploadService.compressImage(file);
      }

      // Upload to Firebase Storage
      return await this.uploadService.uploadImage(processedFile);
    } catch (error) {
      console.error('Image upload failed:', error);
      throw error;
    }
  }
}

# Quill WYSIWYG Editor Integration

This document provides comprehensive instructions for integrating Quill v1.3.7 with Angular 20 standalone components and Ionic 8.

## 📦 Installation

### Step 1: Install Dependencies

```bash
# Install Quill v1.3.7 (compatible with Angular 20)
npm install quill@1.3.7 ngx-quill@25.0.0 --legacy-peer-deps

# Install optional image upload modules
npm install quill-image-uploader quill-image-drop-module --legacy-peer-deps
```

### Step 2: Configure Angular

Add CommonJS dependencies to `angular.json`:

```json
{
  "architect": {
    "build": {
      "options": {
        "allowedCommonJsDependencies": [
          "quill-image-uploader",
          "quill-image-drop-module"
        ]
      }
    }
  }
}
```

### Step 3: Add CSS Imports

Add to `src/global.scss`:

```scss
/* Quill Editor Styles */
@import "~quill/dist/quill.snow.css";
@import "~quill/dist/quill.core.css";
@import "~quill/dist/quill.bubble.css";
```

## 🧩 Usage

### Basic Standalone Component

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-my-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, QuillModule, IonicModule],
  template: `
    <quill-editor
      [(ngModel)]="content"
      [modules]="modules"
      [placeholder]="'Write something great...'"
      [theme]="'snow'">
    </quill-editor>
  `,
  styles: []
})
export class MyEditorComponent {
  content = '';
  modules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      ['image', 'code-block']
    ]
  };
}
```

### Using the Custom QuillEditorComponent

```typescript
import { Component } from '@angular/core';
import { QuillEditorComponent } from '../components/quill-editor/quill-editor.component';

@Component({
  selector: 'app-editor-page',
  standalone: true,
  imports: [QuillEditorComponent],
  template: `
    <app-quill-editor
      [(content)]="editorContent"
      [placeholder]="'Start writing...'"
      [enableImageUpload]="true"
      [enableImageCompression]="true"
      (contentChange)="onContentChange($event)">
    </app-quill-editor>
  `
})
export class EditorPageComponent {
  editorContent = '';
  
  onContentChange(content: string) {
    console.log('Content changed:', content);
  }
}
```

## 🔧 Configuration

### Zone.js Compatibility

The integration handles Zone.js issues automatically through the `QuillConfig` utility:

```typescript
import { QuillConfig } from '../utils/quill-config';

// Get Zone.js compatible modules
const modules = QuillConfig.getModules(ngZone);

// Handle Zone.js issues for an editor instance
QuillConfig.handleZoneJSIssues(editor, ngZone);
```

### Image Upload Configuration

The `QuillUploadService` provides Firebase Storage integration:

```typescript
import { QuillUploadService } from '../services/quill-upload.service';

// Upload with validation and compression
const url = await uploadService.uploadImage(file, 'custom-path');

// Validate file before upload
uploadService.validateImageFile(file);

// Compress image
const compressedFile = await uploadService.compressImage(file, 0.8);
```

### Mobile/Capacitor Optimization

```typescript
// Get mobile-optimized configuration
const mobileConfig = QuillConfig.getMobileConfig();
```

## 🎨 Theming

### Dark Theme Compatibility

The Quill editor component includes dark theme support:

```scss
/* Custom Quill styling for dark theme compatibility */
::ng-deep .ql-editor {
  background: var(--ion-color-light);
  color: var(--ion-color-dark);
}

/* Dark theme adjustments */
@media (prefers-color-scheme: dark) {
  ::ng-deep .ql-editor {
    background: var(--ion-color-dark);
    color: var(--ion-color-light);
  }
}
```

### Custom Styling

Override Quill styles in your component:

```scss
::ng-deep .ql-toolbar {
  background: var(--ion-color-light-shade);
  border: 1px solid var(--ion-color-medium);
}

::ng-deep .ql-container {
  border: 1px solid var(--ion-color-medium);
}
```

## 🚀 Advanced Features

### Custom Toolbar Configuration

```typescript
toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],
  ['blockquote', 'code-block'],
  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  [{ 'color': [] }, { 'background': [] }],
  ['link', 'image', 'video'],
  ['clean']
];
```

### Event Handling

```typescript
<quill-editor
  (onEditorCreated)="onEditorCreated($event)"
  (onContentChanged)="onContentChanged($event)"
  (onSelectionChanged)="onSelectionChanged($event)"
  (onTextChange)="onTextChange($event)"
  (onEditorBlur)="onEditorBlur($event)"
  (onEditorFocus)="onEditorFocus($event)">
</quill-editor>
```

### Read-only Mode

```typescript
<quill-editor
  [readOnly]="true"
  [content]="readOnlyContent">
</quill-editor>
```

## 🔒 Security Considerations

### XSS Protection

Quill automatically sanitizes HTML content, but you can add additional protection:

```typescript
import { DomSanitizer } from '@angular/platform-browser';

// Sanitize content before displaying
const sanitizedContent = this.sanitizer.bypassSecurityTrustHtml(content);
```

### File Upload Security

The upload service includes validation:

- File type validation (JPEG, PNG, GIF, WebP)
- File size limits (5MB default)
- Image compression for performance

## 📱 Capacitor/Mobile Considerations

### Touch Optimization

```typescript
// Mobile-optimized toolbar
const mobileToolbar = [
  ['bold', 'italic', 'underline'],
  ['blockquote', 'code-block'],
  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
  ['link', 'image'],
  ['clean']
];
```

### Performance Optimization

- Image compression before upload
- Lazy loading of editor modules
- Touch-friendly toolbar layout

## 🐛 Troubleshooting

### Common Issues

1. **Zone.js Warnings**: Handled automatically by `QuillConfig`
2. **CommonJS Warnings**: Add modules to `allowedCommonJsDependencies`
3. **SSR Issues**: Use `QuillConfig.getSSRConfig()` for server-side rendering
4. **Mobile Issues**: Use `QuillConfig.getMobileConfig()` for mobile optimization

### Debug Mode

Enable debug logging:

```typescript
// In your component
onEditorCreated(editor: any) {
  console.log('Editor instance:', editor);
  console.log('Editor modules:', editor.getModules());
}
```

## 📚 API Reference

### QuillEditorComponent Inputs

- `content: string` - Editor content (two-way binding)
- `placeholder: string` - Placeholder text
- `theme: 'snow' | 'bubble'` - Editor theme
- `readOnly: boolean` - Read-only mode
- `enableImageUpload: boolean` - Enable image upload
- `enableImageCompression: boolean` - Enable image compression
- `formats: string[]` - Allowed formats
- `toolbarOptions: any[]` - Custom toolbar configuration

### QuillEditorComponent Outputs

- `contentChange: EventEmitter<string>` - Content change events
- `editorCreated: EventEmitter<any>` - Editor creation events
- `contentChanged: EventEmitter<any>` - Content change events
- `selectionChanged: EventEmitter<any>` - Selection change events
- `textChange: EventEmitter<any>` - Text change events
- `editorBlur: EventEmitter<any>` - Editor blur events
- `editorFocus: EventEmitter<any>` - Editor focus events

### QuillUploadService Methods

- `uploadImage(file: File, path?: string): Promise<string>`
- `uploadImageObservable(file: File): Observable<string>`
- `validateImageFile(file: File): boolean`
- `compressImage(file: File, quality?: number): Promise<File>`

## 🎯 Best Practices

1. **Always use `--legacy-peer-deps`** when installing Quill packages
2. **Handle Zone.js issues** using the provided configuration
3. **Validate file uploads** before processing
4. **Compress images** for better performance
5. **Use dark theme compatibility** for better UX
6. **Test on mobile devices** for touch interactions
7. **Monitor bundle size** and optimize if needed

## 📝 Migration Notes

### From ngx-quill v24 to v25

- No breaking changes for basic usage
- Improved Angular 20 compatibility
- Better Zone.js handling

### From Quill v2 to v1.3.7

- Reverted to stable version for Angular compatibility
- Maintained all core functionality
- Improved performance and stability 

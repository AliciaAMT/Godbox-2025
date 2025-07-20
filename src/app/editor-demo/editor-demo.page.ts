import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { QuillEditorComponent } from '../components/quill-editor/quill-editor.component';

@Component({
  selector: 'app-editor-demo',
  standalone: true,
  imports: [CommonModule, IonicModule, QuillEditorComponent],
  template: `
    <ion-header [translucent]="true">
      <ion-toolbar>
        <ion-title>Quill Editor Demo</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content [fullscreen]="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Quill Editor Demo</ion-title>
        </ion-toolbar>
      </ion-header>

      <div class="container">
        <ion-card>
          <ion-card-header>
            <ion-card-title>Rich Text Editor</ion-card-title>
            <ion-card-subtitle>Powered by Quill v1.3.7</ion-card-subtitle>
          </ion-card-header>

          <ion-card-content>
            <app-quill-editor
              [(content)]="editorContent"
              [placeholder]="'Start writing your content here...'"
              [theme]="'snow'"
              (contentChange)="onContentChange($event)"
              (editorCreated)="onEditorCreated($event)">
            </app-quill-editor>
          </ion-card-content>
        </ion-card>

        <ion-card>
          <ion-card-header>
            <ion-card-title>HTML Output</ion-card-title>
          </ion-card-header>

          <ion-card-content>
            <div class="html-output" [innerHTML]="editorContent"></div>
          </ion-card-content>
        </ion-card>

        <ion-card>
          <ion-card-header>
            <ion-card-title>Raw Content</ion-card-title>
          </ion-card-header>

          <ion-card-content>
            <pre>{{ editorContent }}</pre>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  `,
  styles: [`
    .container {
      padding: 16px;
    }

    .html-output {
      background: var(--ion-color-light);
      padding: 16px;
      border-radius: 8px;
      min-height: 100px;
      border: 1px solid var(--ion-color-medium);
    }

    pre {
      background: var(--ion-color-light-shade);
      padding: 16px;
      border-radius: 8px;
      overflow-x: auto;
      white-space: pre-wrap;
      word-wrap: break-word;
      font-size: 12px;
      border: 1px solid var(--ion-color-medium);
    }

    /* Dark theme adjustments */
    @media (prefers-color-scheme: dark) {
      .html-output {
        background: var(--ion-color-dark);
        border-color: var(--ion-color-medium);
      }

      pre {
        background: var(--ion-color-dark-shade);
        border-color: var(--ion-color-medium);
      }
    }
  `]
})
export class EditorDemoPage {
  editorContent: string = '<h2>Welcome to Quill Editor!</h2><p>This is a <strong>rich text editor</strong> integrated with your Ionic Angular app.</p><p>You can:</p><ul><li>Format text</li><li>Add images</li><li>Create lists</li><li>And much more!</li></ul>';

  onContentChange(content: string) {
    console.log('Content changed:', content);
  }

  onEditorCreated(editor: any) {
    console.log('Editor created:', editor);
  }
}

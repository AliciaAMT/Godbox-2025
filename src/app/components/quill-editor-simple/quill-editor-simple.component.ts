import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-quill-editor-simple',
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
        (onEditorCreated)="onEditorCreated($event)"
        (onTextChange)="onTextChange($event)">
      </quill-editor>
    </div>
  `,
  styles: [`
    .quill-container {
      margin: 16px 0;
    }

    /* Custom Quill styling for dark theme compatibility */
    ::ng-deep .ql-editor {
      background: var(--ion-color-dark);
      color: var(--ion-color-light);
      min-height: 150px;
      border-radius: 8px;
      padding: 16px;
      border: 1px solid var(--ion-color-medium);
    }

    ::ng-deep .ql-toolbar {
      background: var(--ion-color-dark-shade);
      border: 1px solid var(--ion-color-medium);
      border-radius: 8px 8px 0 0;
    }

    ::ng-deep .ql-container {
      border: 1px solid var(--ion-color-medium);
      border-top: none;
      border-radius: 0 0 8px 8px;
    }

    ::ng-deep .ql-editor.ql-blank::before {
      color: var(--ion-color-medium);
      font-style: italic;
    }
  `]
})
export class QuillEditorSimpleComponent implements OnInit, OnDestroy {
  @Input() content: string = '';
  @Input() placeholder: string = 'Write something great...';
  @Input() theme: 'snow' | 'bubble' = 'snow';
  @Input() readOnly: boolean = false;

  @Output() contentChange = new EventEmitter<string>();
  @Output() editorCreated = new EventEmitter<any>();
  @Output() textChange = new EventEmitter<any>();

  modules: any = {};

  constructor(private ngZone: NgZone) {}

  ngOnInit() {
    // Simple modules configuration without complex handlers
    this.modules = {
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'header': [1, 2, 3, false] }],
        ['link'],
        ['clean']
      ]
    };
  }

  ngOnDestroy() {
    // Cleanup if needed
  }

  onEditorCreated(editor: any) {
    // Handle Zone.js issues
    if (editor && editor.emit) {
      const originalEmit = editor.emit;
      editor.emit = (eventName: string, ...args: any[]) => {
        this.ngZone.run(() => {
          originalEmit.call(editor, eventName, ...args);
        });
      };
    }
    this.editorCreated.emit(editor);
  }

  onTextChange(delta: any) {
    this.textChange.emit(delta);
    this.contentChange.emit(this.content);
  }
}

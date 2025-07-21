import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit, NgZone, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

declare var FroalaEditor: any;

@Component({
  selector: 'app-froala-editor',
  standalone: true,
  imports: [CommonModule],
  template: `<div #froalaContainer></div>`,
  styleUrls: ['./froala-editor.component.scss']
})
export class FroalaEditorComponent implements AfterViewInit, OnDestroy {
  @ViewChild('froalaContainer', { static: true }) froalaContainer!: ElementRef;
  @Input() content: string = '';
  @Output() contentChange = new EventEmitter<string>();

  private editorInstance: any;

  constructor(private zone: NgZone) {}

  ngAfterViewInit() {
    // Wait for FroalaEditor to be available
    if (typeof FroalaEditor !== 'undefined') {
      this.initializeEditor();
    } else {
      // Wait for the script to load
      const checkFroala = setInterval(() => {
        if (typeof FroalaEditor !== 'undefined') {
          clearInterval(checkFroala);
          this.initializeEditor();
        }
      }, 100);
    }
  }

  private initializeEditor() {
    this.zone.runOutsideAngular(() => {
      this.editorInstance = new FroalaEditor(this.froalaContainer.nativeElement, {
        events: {
          'contentChanged': () => {
            this.zone.run(() => {
              this.content = this.editorInstance.html.get();
              this.contentChange.emit(this.content);
            });
          }
        },
        imageUpload: false, // Disabled for now - can be enabled when backend is ready
        // imageUploadURL: 'https://us-central1-the-way-417.cloudfunctions.net/uploadImage', // Firebase Cloud Function
        toolbarButtons: [
          'bold', 'italic', 'underline', '|',
          'insertImage', 'insertLink', 'undo', 'redo'
        ],
        theme: 'gray',
        // Dark theme configuration
        colorsBackground: ['#000000', '#1a1a1a', '#333333'],
        colorsText: ['#ffffff', '#cccccc', '#999999'],
        height: 300,
        placeholderText: 'Start writing your rich text here...'
      }, () => {
        // Set initial content
        this.editorInstance.html.set(this.content);
      });
    });
  }

  ngOnDestroy() {
    if (this.editorInstance) {
      this.editorInstance.destroy();
    }
  }
}

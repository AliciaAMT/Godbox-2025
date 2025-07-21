import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit, NgZone, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

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

  constructor(private zone: NgZone, private authService: AuthService) {}

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

  private async initializeEditor() {
    this.zone.runOutsideAngular(async () => {
      // Get auth token
      const authToken = await this.authService.getIdToken();

      this.editorInstance = new FroalaEditor(this.froalaContainer.nativeElement, {
        events: {
          'contentChanged': () => {
            this.zone.run(() => {
              this.content = this.editorInstance.html.get();
              this.contentChange.emit(this.content);
            });
          },
          'image.beforeUpload': (images: any) => {
            console.log('Image upload starting:', images);
          },
          'image.uploaded': (response: any) => {
            console.log('Image upload successful:', response);
          },
          'image.error': (error: any, response: any) => {
            console.error('Image upload error:', error, response);
          }
        },
        imageUpload: true,
        imageUploadURL: 'https://us-central1-the-way-417.cloudfunctions.net/uploadImage',
        imageUploadToS3: false,
        imageUploadMethod: 'POST',
        imageUploadParam: 'file',
        toolbarButtons: [
          'undo', 'redo', '|',
          'bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'clearFormatting', '|',
          'fontFamily', 'fontSize', 'textColor', 'backgroundColor', 'inlineStyle', '|',
          'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'paragraphFormat', 'paragraphStyle', 'lineHeight', 'quote', '|',
          'insertImage', 'insertVideo', 'insertTable', 'insertLink', 'emoticons', 'specialCharacters', 'insertHR', 'insertFile', 'embedly', 'insertCode', '|',
          'fullscreen', 'print', 'selectAll', 'html', 'help'
        ],
        toolbarButtonsXS: [
          'undo', 'redo', '|',
          'bold', 'italic', 'underline', 'strikeThrough', '|',
          'fontFamily', 'fontSize', 'textColor', 'backgroundColor', '|',
          'align', 'formatOL', 'formatUL', '|',
          'insertImage', 'insertLink', 'fullscreen', 'html'
        ],
        // Image upload configuration with auth
        imageUploadParams: authToken ? {
          authToken: authToken
        } : {},
        imageMaxSize: 25 * 1024 * 1024, // 25MB max for larger files
        imageAllowedTypes: ['jpeg', 'jpg', 'png', 'gif', 'webp'],
        // Image display options
        imageDisplay: 'inline',
        imageDefaultWidth: 300,
        imageDefaultHeight: 200,
        // Image editing options
        imageEditButtons: ['imageReplace', 'imageAlign', 'imageCaption', 'imageRemove'],
        // Sample images for users to choose from
        imagePaste: true,
        imageInsertButtons: ['imageBack', '|', 'imageUpload', 'imageByURL'],
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

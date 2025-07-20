import { NgZone } from '@angular/core';

/**
 * Quill configuration for Angular 20 standalone components
 * Handles Zone.js compatibility issues
 */
export class QuillConfig {

  /**
   * Configure Quill modules with Zone.js compatibility
   * @param ngZone - Angular's NgZone instance
   * @returns Quill modules configuration
   */
  static getModules(ngZone?: NgZone) {
    return {
      toolbar: [
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
      ],
      // Handle Zone.js issues with Quill events
      clipboard: {
        matchVisual: false
      },
      // Custom handlers for Zone.js compatibility
      handlers: {
        // Ensure toolbar events run in Angular zone
        toolbar: function(value: any) {
          if (ngZone) {
            ngZone.run(() => {
              // Handle toolbar actions
            });
          }
        }
      }
    };
  }

  /**
   * Get Quill formats configuration
   * @returns Array of allowed formats
   */
  static getFormats(): string[] {
    return [
      'bold', 'italic', 'underline', 'strike',
      'blockquote', 'code-block', 'list', 'bullet',
      'link', 'image', 'video', 'clean',
      'header', 'script', 'indent', 'direction',
      'size', 'color', 'background', 'font', 'align'
    ];
  }

  /**
   * Configure Quill for SSR compatibility
   * @returns SSR-safe configuration
   */
  static getSSRConfig() {
    return {
      // Disable features that don't work well with SSR
      modules: {
        toolbar: false,
        clipboard: {
          matchVisual: false
        }
      },
      placeholder: 'Loading...',
      readOnly: true
    };
  }

  /**
   * Configure Quill for Capacitor/mobile
   * @returns Mobile-optimized configuration
   */
  static getMobileConfig() {
    return {
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline'],
          ['blockquote', 'code-block'],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          ['link', 'image'],
          ['clean']
        ]
      },
      // Optimize for mobile touch
      bounds: document.body,
      scrollingContainer: document.body
    };
  }

  /**
   * Handle Quill Zone.js issues
   * @param editor - Quill editor instance
   * @param ngZone - Angular's NgZone instance
   */
  static handleZoneJSIssues(editor: any, ngZone?: NgZone) {
    if (!ngZone) return;

    // Wrap Quill events in NgZone
    const originalEmit = editor.emit;
    editor.emit = function(eventName: string, ...args: any[]) {
      ngZone.run(() => {
        originalEmit.call(editor, eventName, ...args);
      });
    };

    // Handle toolbar events
    if (editor.getModule && editor.getModule('toolbar')) {
      const toolbar = editor.getModule('toolbar');
      const originalHandler = toolbar.handlers;

      // Wrap toolbar handlers in NgZone
      Object.keys(originalHandler).forEach(key => {
        const original = originalHandler[key];
        originalHandler[key] = function(value: any) {
          ngZone.run(() => {
            original.call(toolbar, value);
          });
        };
      });
    }
  }
}

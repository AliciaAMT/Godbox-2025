import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable, from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class QuillUploadService {

  constructor(private storage: AngularFireStorage) {}

  /**
   * Upload image to Firebase Storage
   * @param file - The file to upload
   * @param path - The storage path (optional)
   * @returns Promise<string> - The download URL
   */
  uploadImage(file: File, path?: string): Promise<string> {
    const timestamp = new Date().getTime();
    const fileName = `${timestamp}_${file.name}`;
    const storagePath = path ? `${path}/${fileName}` : `quill-images/${fileName}`;

    const fileRef = this.storage.ref(storagePath);

    return new Promise((resolve, reject) => {
      const uploadTask = fileRef.put(file);

      uploadTask.snapshotChanges().subscribe(
        (snapshot) => {
          // Upload progress can be tracked here if needed
          if (snapshot) {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Upload progress: ${progress}%`);
          }
        },
        (error) => {
          console.error('Upload error:', error);
          reject(error);
        },
        () => {
          // Upload completed
          fileRef.getDownloadURL().subscribe(
            (url) => {
              console.log('Upload successful:', url);
              resolve(url);
            },
            (error) => {
              console.error('Error getting download URL:', error);
              reject(error);
            }
          );
        }
      );
    });
  }

  /**
   * Upload image with custom error handling
   * @param file - The file to upload
   * @returns Observable<string> - The download URL
   */
  uploadImageObservable(file: File): Observable<string> {
    return from(this.uploadImage(file)).pipe(
      map(url => url),
      catchError(error => {
        console.error('Image upload failed:', error);
        throw error;
      })
    );
  }

  /**
   * Validate file before upload
   * @param file - The file to validate
   * @returns boolean - Whether the file is valid
   */
  validateImageFile(file: File): boolean {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      throw new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.');
    }

    if (file.size > maxSize) {
      throw new Error('File size too large. Maximum size is 5MB.');
    }

    return true;
  }

  /**
   * Compress image before upload (optional)
   * @param file - The file to compress
   * @param quality - Compression quality (0-1)
   * @returns Promise<File> - The compressed file
   */
  async compressImage(file: File, quality: number = 0.8): Promise<File> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions (max 1200px width/height)
        const maxSize = 1200;
        let { width, height } = img;

        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;

        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now()
              });
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          },
          file.type,
          quality
        );
      };

      img.src = URL.createObjectURL(file);
    });
  }
}

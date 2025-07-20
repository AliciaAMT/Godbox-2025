import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { doc, docData, Firestore, setDoc, updateDoc } from '@angular/fire/firestore';
import { getDownloadURL, ref, Storage, uploadString } from '@angular/fire/storage';
import { Photo } from '@capacitor/camera';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AvatarService {
  constructor(private auth: Auth, private firestore: Firestore, private storage: Storage) {}

  getUserProfile(): Observable<any> {
    const user = this.auth.currentUser;
    if (!user) {
      return of(null);
    }
    const userDocRef = doc(this.firestore, `users/${user.uid}`);
    return docData(userDocRef, { idField: 'id' });
  }

  async addUser() {
    const user = this.auth.currentUser;
    if (!user) return;
    const userDocRef = doc(this.firestore, `users/${user.uid}`);
    const imageUrl = '';
    const email = user.email;
    const userRole = 'user';
    const userName = 'User Name';

    await setDoc(userDocRef, {
      imageUrl, email, userRole, userName
    });
    return true;
  }

  async uploadImage(cameraFile: Photo) {
    const user = this.auth.currentUser;
    if (!user) return;
    const path = `uploads/${user.uid}/profile.webp`;
    const storageRef = ref(this.storage, path);

    try {
      await uploadString(storageRef, cameraFile.base64String!, 'base64');

      const imageUrl = await getDownloadURL(storageRef);
      // update doc vs set doc - set doc will overwrite the entire document, update will error if no doc exists
      const userDocRef = doc(this.firestore, `users/${user.uid}`);
      await updateDoc(userDocRef, {
        imageUrl
      });
      return true;
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}

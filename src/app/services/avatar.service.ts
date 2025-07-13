import { Injectable, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { doc, docData, Firestore, setDoc, updateDoc } from '@angular/fire/firestore';
import { getDownloadURL, ref, Storage, uploadString } from '@angular/fire/storage';
import { Photo } from '@capacitor/camera';

@Injectable({
  providedIn: 'root'
})
export class AvatarService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private storage = inject(Storage);

  getUserProfile() {
    const user = this.auth.currentUser;
    const userDocRef = doc(this.firestore, `users/${user?.uid}`);
    return docData(userDocRef, { idField: 'id' });
  }

  async addUser() {
    const user = this.auth.currentUser;
    const userDocRef = doc(this.firestore, `users/${user?.uid}`);
    const imageUrl = '';
    const email = user?.email;
    const userRole = 'user';
    const userName = 'User Name';

    await setDoc(userDocRef, {
      imageUrl, email, userRole, userName
    });
    return true;
  }

  async uploadImage(cameraFile: Photo) {
    const user = this.auth.currentUser;
    const path = `uploads/${user?.uid}/profile.webp`;
    const storageRef = ref(this.storage, path);

    try {
      await uploadString(storageRef, cameraFile.base64String!, 'base64');

      const imageUrl = await getDownloadURL(storageRef);
      // update doc vs set doc - set doc will overwrite the entire document, update will error if no doc exists
      const userDocRef = doc(this.firestore, `users/${user?.uid}`);
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

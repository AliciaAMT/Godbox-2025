import { formatDate } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  docData,
  addDoc,
  deleteDoc,
  updateDoc,
  orderBy,
  query,
  where,
  documentId
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Note {
  id?: string;
  title: string;
  text: string;
}

export interface Category {
  id?: string;
  categoryName: string;
}

export interface Serie {
  id?: string;
  serieName: string;
  privacy: string;
}

export interface User {
  id?: string;
  userName?: string;
  imageUrl?: string;
  userRole?: string;
  email?: string;
  bio?: string;
}

export interface Readings {
  id?: string;
  idNo?: number;
  parashat?: string;
  parashatHeb?: string;
  parashatEng?: string;
  date?: string;
  holiday?: string;
  holidayReadings?: string;
  holidayDate: string;
  kriyah: number;
  kriyahHeb: string;
  kriyahEng: string;
  kriyahDate: string;
  torah: string;
  prophets: string;
  writings: string;
  britChadashah: string;
  haftarah: string;
}

export interface Post {
  id?: string;
  title: string;
  description: string;
  imageUrl: string;
  preview: string;
  category: string;
  content: string;
  keywords: string;
  author: string;
  date: string;
  likes: string;
  views: string;
  privacy: string;
  series: string;
  seqNo: number;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(
    private firestore: Firestore,
    private auth: Auth
  ) {}

  getUsers(): Observable<User[]> {
    const userRef = collection(this.firestore, 'users');
    return collectionData(userRef, { idField: 'id' }) as Observable<User[]>;
  }

  getReadings(): Observable<Readings[]> {
    const readingsRef = collection(this.firestore, 'readings');
    return collectionData(readingsRef, { idField: 'id' }) as Observable<Readings[]>;
  }

  getAllPosts(): Observable<Post[]> {
    const postsRef = collection(this.firestore, 'posts');
    const q = query(postsRef, orderBy('date', 'desc'));
    return collectionData(q, { idField: 'id' }) as Observable<Post[]>;
  }

  getReadingById(id: string): Observable<Readings> {
    const readingDocRef = doc(this.firestore, `readings/${id}`);
    return docData(readingDocRef, { idField: 'id' }) as Observable<Readings>;
  }

  getPostsBySerieId(id: string): Observable<Post[]> {
    const postsRef = collection(this.firestore, 'posts');
    const q = query(postsRef, where('serie', '==', id), orderBy('seqNo', 'asc'));
    return collectionData(q, { idField: 'id' }) as Observable<Post[]>;
  }

  getPosts(): Observable<Post[]> {
    const postRef = collection(this.firestore, 'posts');
    return collectionData(postRef, { idField: 'id' }) as Observable<Post[]>;
  }

  getUserById(id: string): Observable<User> {
    const userDocRef = doc(this.firestore, `users/${id}`);
    return docData(userDocRef, { idField: 'id' }) as Observable<User>;
  }

  getPostById(id: string): Observable<Post> {
    const postDocRef = doc(this.firestore, `posts/${id}`);
    return docData(postDocRef, { idField: 'id' }) as Observable<Post>;
  }

  getNotes(): Observable<Note[]> {
    const notesRef = collection(this.firestore, 'notes');
    return collectionData(notesRef, { idField: 'id' }) as Observable<Note[]>;
  }

  getCategories(): Observable<Category[]> {
    const categoriesRef = collection(this.firestore, 'categories');
    return collectionData(categoriesRef, { idField: 'id' }) as Observable<Category[]>;
  }

  getSeries(): Observable<Serie[]> {
    const seriesRef = collection(this.firestore, 'series');
    return collectionData(seriesRef, { idField: 'id' }) as Observable<Serie[]>;
  }

  getSerieById(id: string): Observable<Serie> {
    const serieDocRef = doc(this.firestore, `series/${id}`);
    return docData(serieDocRef, { idField: 'id' }) as Observable<Serie>;
  }

  getPostsForCollection(): Observable<Post[]> {
    const postsRef = collection(this.firestore, 'posts');
    const q = query(postsRef, orderBy('date', 'asc'), where('seqNo', '==', 1), where('privacy', 'in', ['public', 'anonymous']));
    return collectionData(q, { idField: 'id' }) as Observable<Post[]>;
  }

  getPostBySeriesAndSeqNo(series: string, seqNo: number) {
    const postsRef = collection(this.firestore, 'posts');
    const q = query(postsRef, where('serie', '==', series), where('seqNo', '==', seqNo));
    return collectionData(q, { idField: 'id' }) as Observable<Post[]>;
  }

  getNextPostById(serie: string, seqNo: number): Observable<Post[]> {
    const postsRef = collection(this.firestore, 'posts');
    const q = query(postsRef, where('seqNo', '==', seqNo + 1), where('serie', '==', serie));
    return collectionData(q, { idField: 'id' }) as Observable<Post[]>;
  }

  getPublicPosts(): Observable<Post[]> {
    const postsRef = collection(this.firestore, 'posts');
    const q = query(postsRef, orderBy('date', 'desc'), where('privacy', 'in', ['public', 'anonymous']));
    return collectionData(q, { idField: 'id' }) as Observable<Post[]>;
  }

  getReadingByThisDate(): Observable<Readings[]> {
    const dateS = new Date();
    const d = formatDate(dateS, 'yyyy-MM-dd', 'en');
    const readingsRef = collection(this.firestore, 'readings');
    const q = query(readingsRef, where('date', '==', d));
    return collectionData(q, { idField: 'id' }) as Observable<Readings[]>;
  }

  getCategoryById(id: string): Observable<Category> {
    const categoryDocRef = doc(this.firestore, `categories/${id}`);
    return docData(categoryDocRef, { idField: 'id' }) as Observable<Category>;
  }

  getNoteById(id: string): Observable<Note> {
    const noteDocRef = doc(this.firestore, `notes/${id}`);
    return docData(noteDocRef, { idField: 'id' }) as Observable<Note>;
  }

  addNote(note: Note) {
    const notesRef = collection(this.firestore, 'notes');
    return addDoc(notesRef, note);
  }

  addCategory(category: Category) {
    const categoriesRef = collection(this.firestore, 'categories');
    return addDoc(categoriesRef, category);
  }

  addSerie(serie: Serie) {
    const seriesRef = collection(this.firestore, 'series');
    return addDoc(seriesRef, serie);
  }

  addPost(post: Post) {
    const postsRef = collection(this.firestore, 'posts');
    return addDoc(postsRef, post);
  }

  deleteNote(note: Note) {
    const noteDocRef = doc(this.firestore, `notes/${note.id}`);
    return deleteDoc(noteDocRef);
  }

  deleteCategory(category: Category) {
    const categoryDocRef = doc(this.firestore, `categories/${category.id}`);
    return deleteDoc(categoryDocRef);
  }

  deleteSerie(serie: Serie) {
    const serieDocRef = doc(this.firestore, `series/${serie.id}`);
    return deleteDoc(serieDocRef);
  }

  deleteUser(user: User) {
    const userDocRef = doc(this.firestore, `users/${user.id}`);
    return deleteDoc(userDocRef);
  }

  deletePost(post: Post) {
    const postDocRef = doc(this.firestore, `posts/${post.id}`);
    return deleteDoc(postDocRef);
  }

  updateNote(note: Note) {
    const noteDocRef = doc(this.firestore, `notes/${note.id}`);
    return updateDoc(noteDocRef, { ...note });
  }

  updateUser(user: User) {
    const userDocRef = doc(this.firestore, `users/${user.id}`);
    return updateDoc(userDocRef, { ...user });
  }

  updateCategory(category: Category) {
    const categoryDocRef = doc(this.firestore, `categories/${category.id}`);
    return updateDoc(categoryDocRef, { ...category });
  }

  updateSerie(serie: Serie) {
    const serieDocRef = doc(this.firestore, `series/${serie.id}`);
    return updateDoc(serieDocRef, { ...serie });
  }

  updatePost(post: Post) {
    const postDocRef = doc(this.firestore, `posts/${post.id}`);
    return updateDoc(postDocRef, { ...post });
  }

  addReading(reading: Readings) {
    const readingsRef = collection(this.firestore, 'readings');
    return addDoc(readingsRef, reading);
  }

  addReadings(readings: Readings[]) {
    const readingsRef = collection(this.firestore, 'readings');
    const promises = readings.map(reading => addDoc(readingsRef, reading));
    return Promise.all(promises);
  }

  clearReadingsCollection() {
    // Note: This would require a Cloud Function or admin SDK
    // For now, we'll just return a promise that resolves
    return Promise.resolve();
  }
}

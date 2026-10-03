import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
  writeBatch
} from 'firebase/firestore';
import { db } from './firebase';
import { Dog, KennelConfig, ReservationOrder, NoticePost, GalleryPhoto } from '../types';

let isListening = false;
let cloudSyncStatus: 'connected' | 'syncing' | 'offline' | 'error' = 'syncing';

export const cloudSyncService = {
  getStatus() {
    return cloudSyncStatus;
  },

  initRealtimeSync(callbacks: {
    onDogsUpdate?: (dogs: Dog[]) => void;
    onConfigUpdate?: (config: KennelConfig) => void;
    onOrdersUpdate?: (orders: ReservationOrder[]) => void;
    onNoticesUpdate?: (notices: NoticePost[]) => void;
    onGalleryUpdate?: (photos: GalleryPhoto[]) => void;
  }) {
    if (isListening) return;
    isListening = true;

    try {
      // 1. Listen to Puppies in Firestore
      const puppiesCol = collection(db, 'puppies');
      onSnapshot(
        puppiesCol,
        (snapshot) => {
          cloudSyncStatus = 'connected';
          if (!snapshot.empty) {
            const cloudDogs: Dog[] = [];
            snapshot.forEach((docSnap) => {
              cloudDogs.push(docSnap.data() as Dog);
            });
            callbacks.onDogsUpdate?.(cloudDogs);
          }
        },
        (err) => {
          console.warn('Firestore puppies listener notice:', err);
          cloudSyncStatus = 'offline';
        }
      );

      // 2. Listen to Settings in Firestore
      const settingsDoc = doc(db, 'settings', 'general');
      onSnapshot(
        settingsDoc,
        (docSnap) => {
          if (docSnap.exists()) {
            callbacks.onConfigUpdate?.(docSnap.data() as KennelConfig);
          }
        },
        (err) => {
          console.warn('Firestore settings listener notice:', err);
        }
      );

      // 3. Listen to Orders in Firestore
      const ordersCol = collection(db, 'orders');
      onSnapshot(
        ordersCol,
        (snapshot) => {
          if (!snapshot.empty) {
            const cloudOrders: ReservationOrder[] = [];
            snapshot.forEach((docSnap) => {
              cloudOrders.push(docSnap.data() as ReservationOrder);
            });
            callbacks.onOrdersUpdate?.(cloudOrders);
          }
        },
        (err) => {
          console.warn('Firestore orders listener notice:', err);
        }
      );

      // 4. Listen to Notices
      const noticesCol = collection(db, 'notices');
      onSnapshot(
        noticesCol,
        (snapshot) => {
          if (!snapshot.empty) {
            const cloudNotices: NoticePost[] = [];
            snapshot.forEach((docSnap) => {
              cloudNotices.push(docSnap.data() as NoticePost);
            });
            callbacks.onNoticesUpdate?.(cloudNotices);
          }
        },
        (err) => {
          console.warn('Firestore notices listener notice:', err);
        }
      );

      // 5. Listen to Gallery
      const galleryCol = collection(db, 'gallery');
      onSnapshot(
        galleryCol,
        (snapshot) => {
          if (!snapshot.empty) {
            const cloudGallery: GalleryPhoto[] = [];
            snapshot.forEach((docSnap) => {
              cloudGallery.push(docSnap.data() as GalleryPhoto);
            });
            callbacks.onGalleryUpdate?.(cloudGallery);
          }
        },
        (err) => {
          console.warn('Firestore gallery listener notice:', err);
        }
      );
    } catch (e) {
      console.warn('Failed to start Firestore realtime listeners:', e);
      cloudSyncStatus = 'offline';
    }
  },

  async syncDog(dog: Dog): Promise<void> {
    try {
      await setDoc(doc(db, 'puppies', dog.id), dog, { merge: true });
    } catch (e) {
      console.error('Error syncing puppy to Firestore:', e);
    }
  },

  async deleteDog(dogId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'puppies', dogId));
    } catch (e) {
      console.error('Error deleting puppy from Firestore:', e);
    }
  },

  async syncConfig(config: KennelConfig): Promise<void> {
    try {
      await setDoc(doc(db, 'settings', 'general'), config, { merge: true });
    } catch (e) {
      console.error('Error syncing settings to Firestore:', e);
    }
  },

  async syncOrder(order: ReservationOrder): Promise<void> {
    try {
      await setDoc(doc(db, 'orders', order.id), order, { merge: true });
    } catch (e) {
      console.error('Error syncing order to Firestore:', e);
    }
  },

  async syncNotice(notice: NoticePost): Promise<void> {
    try {
      await setDoc(doc(db, 'notices', notice.id), notice, { merge: true });
    } catch (e) {
      console.error('Error syncing notice to Firestore:', e);
    }
  },

  async deleteNotice(noticeId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'notices', noticeId));
    } catch (e) {
      console.error('Error deleting notice from Firestore:', e);
    }
  },

  async syncPhoto(photo: GalleryPhoto): Promise<void> {
    try {
      await setDoc(doc(db, 'gallery', photo.id), photo, { merge: true });
    } catch (e) {
      console.error('Error syncing photo to Firestore:', e);
    }
  },

  async deletePhoto(photoId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'gallery', photoId));
    } catch (e) {
      console.error('Error deleting photo from Firestore:', e);
    }
  },

  // Initial push of all local data to cloud if cloud is empty
  async seedCloudIfEmpty(initialData: {
    dogs: Dog[];
    config: KennelConfig;
    orders: ReservationOrder[];
    notices: NoticePost[];
    gallery: GalleryPhoto[];
  }): Promise<void> {
    try {
      const puppiesSnap = await getDocs(collection(db, 'puppies'));
      if (puppiesSnap.empty && initialData.dogs.length > 0) {
        console.log('Seeding initial puppies to Firestore Cloud...');
        const batch = writeBatch(db);
        for (const dog of initialData.dogs) {
          batch.set(doc(db, 'puppies', dog.id), dog);
        }
        await batch.commit();
      }

      const settingsSnap = await getDocs(collection(db, 'settings'));
      if (settingsSnap.empty) {
        await setDoc(doc(db, 'settings', 'general'), initialData.config);
      }

      const noticesSnap = await getDocs(collection(db, 'notices'));
      if (noticesSnap.empty && initialData.notices.length > 0) {
        const batch = writeBatch(db);
        for (const n of initialData.notices) {
          batch.set(doc(db, 'notices', n.id), n);
        }
        await batch.commit();
      }

      const gallerySnap = await getDocs(collection(db, 'gallery'));
      if (gallerySnap.empty && initialData.gallery.length > 0) {
        const batch = writeBatch(db);
        for (const p of initialData.gallery) {
          batch.set(doc(db, 'gallery', p.id), p);
        }
        await batch.commit();
      }
    } catch (e) {
      console.warn('Notice while checking/seeding Firestore:', e);
    }
  }
};

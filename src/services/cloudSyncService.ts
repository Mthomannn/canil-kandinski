import {
  collection,
  doc,
  setDoc,
   getDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
  writeBatch
} from 'firebase/firestore';
import { db } from './firebase';
import {
  Dog,
  KennelConfig,
  ReservationOrder,
  NoticePost,
  GalleryPhoto,
  Testimonial,
  BreedInfo
} from '../types';

let isListening = false;
let cloudSyncStatus: 'connected' | 'syncing' | 'offline' | 'error' = 'syncing';

// Cache for split image documents so settings/general never exceeds 1MB
let cachedGeneralConfig: Partial<KennelConfig> | null = null;
let cachedHeroImage: string | null = null;
let cachedAboutImage: string | null = null;

interface SyncCallbacks {
  onDogsUpdate?: (dogs: Dog[]) => void;
  onConfigUpdate?: (config: Partial<KennelConfig>) => void;
  onOrdersUpdate?: (orders: ReservationOrder[]) => void;
  onNoticesUpdate?: (notices: NoticePost[]) => void;
  onGalleryUpdate?: (photos: GalleryPhoto[]) => void;
  onTestimonialsUpdate?: (testimonials: Testimonial[]) => void;
  onBreedsUpdate?: (breeds: BreedInfo[]) => void;
}

let registeredCallbacks: SyncCallbacks = {};

function buildMergedConfig(): Partial<KennelConfig> | null {
  if (!cachedGeneralConfig) return null;
  const merged: Partial<KennelConfig> = { ...cachedGeneralConfig };

  if (merged.heroImage === '__SPLIT_HERO__') {
    if (cachedHeroImage) {
      merged.heroImage = cachedHeroImage;
    } else {
      delete merged.heroImage;
    }
  } else if (cachedHeroImage) {
    merged.heroImage = cachedHeroImage;
  }

  if (merged.aboutImage === '__SPLIT_ABOUT__') {
    if (cachedAboutImage) {
      merged.aboutImage = cachedAboutImage;
    } else {
      delete merged.aboutImage;
    }
  } else if (cachedAboutImage) {
    merged.aboutImage = cachedAboutImage;
  }

  return merged;
}

export const cloudSyncService = {
  getStatus() {
    return cloudSyncStatus;
  },

  initRealtimeSync(callbacks: SyncCallbacks) {
    registeredCallbacks = callbacks;
    if (isListening) return;
    isListening = true;

    const emitMergedConfig = () => {
      const merged = buildMergedConfig();
      if (merged) {
        registeredCallbacks.onConfigUpdate?.(merged);
      }
    };

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
            registeredCallbacks.onDogsUpdate?.(cloudDogs);
          }
        },
        (err) => {
          console.warn('Firestore puppies listener notice:', err);
          cloudSyncStatus = 'offline';
        }
      );

      // 2. Listen to Settings in Firestore (general + split image docs)
      onSnapshot(
        doc(db, 'settings', 'general'),
        (docSnap) => {
          cloudSyncStatus = 'connected';
          if (docSnap.exists()) {
            cachedGeneralConfig = docSnap.data() as Partial<KennelConfig>;
            emitMergedConfig();
          }
        },
        (err) => {
          console.warn('Firestore settings listener notice:', err);
        }
      );

      onSnapshot(
        doc(db, 'settings', 'hero_image'),
        (docSnap) => {
          if (docSnap.exists() && docSnap.data()?.imageUrl) {
            cachedHeroImage = docSnap.data().imageUrl;
            emitMergedConfig();
          }
        },
        () => {}
      );

      onSnapshot(
        doc(db, 'settings', 'about_image'),
        (docSnap) => {
          if (docSnap.exists() && docSnap.data()?.imageUrl) {
            cachedAboutImage = docSnap.data().imageUrl;
            emitMergedConfig();
          }
        },
        () => {}
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
            registeredCallbacks.onOrdersUpdate?.(cloudOrders);
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
            registeredCallbacks.onNoticesUpdate?.(cloudNotices);
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
            cloudGallery.sort((a, b) => (b.id > a.id ? 1 : -1));
            registeredCallbacks.onGalleryUpdate?.(cloudGallery);
          }
        },
        (err) => {
          console.warn('Firestore gallery listener notice:', err);
        }
      );

      // 6. Listen to Testimonials
      const testimonialsCol = collection(db, 'testimonials');
      onSnapshot(
        testimonialsCol,
        (snapshot) => {
          if (!snapshot.empty) {
            const cloudTestimonials: Testimonial[] = [];
            snapshot.forEach((docSnap) => {
              cloudTestimonials.push(docSnap.data() as Testimonial);
            });
            registeredCallbacks.onTestimonialsUpdate?.(cloudTestimonials);
          }
        },
        () => {}
      );

      // 7. Listen to Breeds
      const breedsCol = collection(db, 'breeds');
      onSnapshot(
        breedsCol,
        (snapshot) => {
          if (!snapshot.empty) {
            const cloudBreeds: BreedInfo[] = [];
            snapshot.forEach((docSnap) => {
              cloudBreeds.push(docSnap.data() as BreedInfo);
            });
            registeredCallbacks.onBreedsUpdate?.(cloudBreeds);
          }
        },
        () => {}
      );

      // Re-pull immediately when user unlocks phone/tablet or switches back to tab
      if (typeof window !== 'undefined') {
        const handleWakeUp = () => {
          if (document.visibilityState === 'visible') {
            this.forcePullFromCloud();
          }
        };
        window.addEventListener('focus', handleWakeUp);
        document.addEventListener('visibilitychange', handleWakeUp);
      }
    } catch (e) {
      console.warn('Failed to start Firestore realtime listeners:', e);
      cloudSyncStatus = 'offline';
    }
  },

  async forcePullFromCloud(): Promise<void> {
    try {
      const [
        puppiesSnap,
        generalSnap,
        heroSnap,
        aboutSnap,
        gallerySnap,
        ordersSnap,
        noticesSnap,
        testimonialsSnap,
        breedsSnap
      ] = await Promise.all([
        getDocs(collection(db, 'puppies')),
        getDoc(doc(db, 'settings', 'general')),
        getDoc(doc(db, 'settings', 'hero_image')),
        getDoc(doc(db, 'settings', 'about_image')),
        getDocs(collection(db, 'gallery')),
        getDocs(collection(db, 'orders')),
        getDocs(collection(db, 'notices')),
        getDocs(collection(db, 'testimonials')),
        getDocs(collection(db, 'breeds'))
      ]);

      cloudSyncStatus = 'connected';

      if (!puppiesSnap.empty) {
        const cloudDogs: Dog[] = [];
        puppiesSnap.forEach((d) => cloudDogs.push(d.data() as Dog));
        registeredCallbacks.onDogsUpdate?.(cloudDogs);
      }

      if (heroSnap.exists() && heroSnap.data()?.imageUrl) {
        cachedHeroImage = heroSnap.data().imageUrl;
      }
      if (aboutSnap.exists() && aboutSnap.data()?.imageUrl) {
        cachedAboutImage = aboutSnap.data().imageUrl;
      }
      if (generalSnap.exists()) {
        cachedGeneralConfig = generalSnap.data() as Partial<KennelConfig>;
        const merged = buildMergedConfig();
        if (merged) registeredCallbacks.onConfigUpdate?.(merged);
      }

      if (!gallerySnap.empty) {
        const cloudGallery: GalleryPhoto[] = [];
        gallerySnap.forEach((d) => cloudGallery.push(d.data() as GalleryPhoto));
        cloudGallery.sort((a, b) => (b.id > a.id ? 1 : -1));
        registeredCallbacks.onGalleryUpdate?.(cloudGallery);
      }

      if (!ordersSnap.empty) {
        const cloudOrders: ReservationOrder[] = [];
        ordersSnap.forEach((d) => cloudOrders.push(d.data() as ReservationOrder));
        registeredCallbacks.onOrdersUpdate?.(cloudOrders);
      }

      if (!noticesSnap.empty) {
        const cloudNotices: NoticePost[] = [];
        noticesSnap.forEach((d) => cloudNotices.push(d.data() as NoticePost));
        registeredCallbacks.onNoticesUpdate?.(cloudNotices);
      }

      if (!testimonialsSnap.empty) {
        const cloudTestimonials: Testimonial[] = [];
        testimonialsSnap.forEach((d) => cloudTestimonials.push(d.data() as Testimonial));
        registeredCallbacks.onTestimonialsUpdate?.(cloudTestimonials);
      }

      if (!breedsSnap.empty) {
        const cloudBreeds: BreedInfo[] = [];
        breedsSnap.forEach((d) => cloudBreeds.push(d.data() as BreedInfo));
        registeredCallbacks.onBreedsUpdate?.(cloudBreeds);
      }
    } catch (e) {
      console.warn('Error pulling latest data from cloud:', e);
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
      const configCopy: Partial<KennelConfig> = { ...config };

      // Store large base64 images in dedicated documents so settings/general never exceeds 1MB
      if (configCopy.heroImage && configCopy.heroImage.startsWith('data:image')) {
        cachedHeroImage = configCopy.heroImage;
        await setDoc(doc(db, 'settings', 'hero_image'), {
          imageUrl: configCopy.heroImage,
          updatedAt: new Date().toISOString()
        });
        configCopy.heroImage = '__SPLIT_HERO__';
      } else if (configCopy.heroImage && configCopy.heroImage !== '__SPLIT_HERO__') {
        cachedHeroImage = configCopy.heroImage;
        await setDoc(doc(db, 'settings', 'hero_image'), {
          imageUrl: configCopy.heroImage,
          updatedAt: new Date().toISOString()
        });
      }

      if (configCopy.aboutImage && configCopy.aboutImage.startsWith('data:image')) {
        cachedAboutImage = configCopy.aboutImage;
        await setDoc(doc(db, 'settings', 'about_image'), {
          imageUrl: configCopy.aboutImage,
          updatedAt: new Date().toISOString()
        });
        configCopy.aboutImage = '__SPLIT_ABOUT__';
      } else if (configCopy.aboutImage && configCopy.aboutImage !== '__SPLIT_ABOUT__') {
        cachedAboutImage = configCopy.aboutImage;
        await setDoc(doc(db, 'settings', 'about_image'), {
          imageUrl: configCopy.aboutImage,
          updatedAt: new Date().toISOString()
        });
      }

      cachedGeneralConfig = configCopy;
      await setDoc(doc(db, 'settings', 'general'), configCopy, { merge: true });
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

  async deleteOrder(orderId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'orders', orderId));
    } catch (e) {
      console.error('Error deleting order from Firestore:', e);
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

  async syncTestimonial(testimonial: Testimonial): Promise<void> {
    try {
      await setDoc(doc(db, 'testimonials', testimonial.id), testimonial, { merge: true });
    } catch (e) {
      console.error('Error syncing testimonial to Firestore:', e);
    }
  },

  async deleteTestimonial(testimonialId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'testimonials', testimonialId));
    } catch (e) {
      console.error('Error deleting testimonial from Firestore:', e);
    }
  },

  async syncBreed(breed: BreedInfo): Promise<void> {
    try {
      await setDoc(doc(db, 'breeds', breed.id), breed, { merge: true });
    } catch (e) {
      console.error('Error syncing breed to Firestore:', e);
    }
  },

  async deleteBreed(breedId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'breeds', breedId));
    } catch (e) {
      console.error('Error deleting breed from Firestore:', e);
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
        const batch = writeBatch(db);
        for (const dog of initialData.dogs) {
          batch.set(doc(db, 'puppies', dog.id), dog);
        }
        await batch.commit();
      }

      const settingsSnap = await getDocs(collection(db, 'settings'));
      if (settingsSnap.empty) {
        await this.syncConfig(initialData.config);
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

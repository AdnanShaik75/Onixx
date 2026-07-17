import { initializeApp, getApps } from "firebase/app";
import { getDatabase, ref, onValue, set } from "firebase/database";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const isConfigured =
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.databaseURL &&
  firebaseConfig.projectId &&
  firebaseConfig.storageBucket &&
  firebaseConfig.messagingSenderId &&
  firebaseConfig.appId &&
  firebaseConfig.apiKey !== "your_api_key_here";

let app: ReturnType<typeof initializeApp> | null = null;
let db: ReturnType<typeof getDatabase> | null = null;
let storage: ReturnType<typeof getStorage> | null = null;

if (isConfigured && typeof window !== "undefined") {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  db = getDatabase(app);
  storage = getStorage(app);
}

export { db, storage, isConfigured };

export function subscribeToPath<T>(
  path: string,
  callback: (data: T | null) => void
): () => void {
  if (!db) return () => {};
  const dbRef = ref(db, path);
  const unsubscribe = onValue(dbRef, (snapshot) => {
    callback(snapshot.val() as T | null);
  });
  return () => unsubscribe();
}

export function saveToPath<T>(path: string, data: T): Promise<void> {
  if (!db) return Promise.resolve();
  return set(ref(db, path), data);
}

export async function fetchFromPath<T>(path: string): Promise<T | null> {
  const databaseURL = firebaseConfig.databaseURL;
  if (!databaseURL || !isConfigured) return null;
  try {
    const res = await fetch(`${databaseURL}/${path}.json`);
    if (!res.ok) return null;
    const data = await res.json();
    return data as T | null;
  } catch {
    return null;
  }
}

export async function fetchProductFromFirebase(id: string) {
  const all = await fetchFromPath<Array<{ id: string } & Record<string, unknown>>>("products");
  if (!Array.isArray(all)) return null;
  return all.find((p) => p?.id === id) ?? null;
}

// ─── Image Upload ────────────────────────────────────────

export async function uploadImage(
  path: string,
  file: File,
  maxWidth = 1200,
  quality = 0.85
): Promise<string> {
  if (!storage) return URL.createObjectURL(file);

  const compressed = await compressImage(file, maxWidth, quality);
  const fileRef = storageRef(storage, path);
  const snapshot = await uploadBytes(fileRef, compressed, {
    contentType: compressed.type,
  });
  return getDownloadURL(snapshot.ref);
}

export async function uploadImages(
  basePath: string,
  files: File[],
  maxWidth = 1200,
  quality = 0.85
): Promise<string[]> {
  const results = await Promise.all(
    files.map((file, i) => {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${basePath}/${Date.now()}-${i}.${ext}`;
      return uploadImage(path, file, maxWidth, quality);
    })
  );
  return results;
}

export async function deleteImage(url: string): Promise<void> {
  if (!storage || !url.includes("firebasestorage")) return;
  try {
    const fileRef = storageRef(storage, url);
    await deleteObject(fileRef);
  } catch {
    // image may already be deleted or URL is external
  }
}

function compressImage(
  file: File,
  maxWidth: number,
  quality: number
): Promise<Blob> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => resolve(blob || new Blob()),
          "image/jpeg",
          quality
        );
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

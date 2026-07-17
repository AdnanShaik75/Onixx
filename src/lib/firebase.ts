import { initializeApp, getApps } from "firebase/app";
import { getDatabase, ref, onValue, set } from "firebase/database";

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

if (isConfigured && typeof window !== "undefined") {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  db = getDatabase(app);
}

export { db, isConfigured };

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

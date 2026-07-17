import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getDatabase, type Database } from "firebase-admin/database";

let app: App;
let auth: Auth;
let db: Database;

function getFirebaseAdmin(): { app: App; auth: Auth; db: Database } {
  if (getApps().length > 0) {
    return { app: getApps()[0], auth: getAuth(getApps()[0]), db: getDatabase(getApps()[0]) };
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Missing Firebase Admin credentials. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY environment variables."
    );
  }

  app = initializeApp({
    credential: cert({ projectId, clientEmail, privateKey: privateKey.replace(/\\n/g, "\n") }),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });

  auth = getAuth(app);
  db = getDatabase(app);

  return { app, auth, db };
}

export function getAdminAuth(): Auth {
  if (!auth) getFirebaseAdmin();
  return auth;
}

export function getAdminDb(): Database {
  if (!db) getFirebaseAdmin();
  return db;
}

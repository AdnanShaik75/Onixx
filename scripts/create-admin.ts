#!/usr/bin/env npx tsx
/**
 * Admin Promotion Script
 *
 * Usage:
 *   npx tsx scripts/create-admin.ts <email-or-uid>
 *
 * Examples:
 *   npx tsx scripts/create-admin.ts admin@onixx.com
 *   npx tsx scripts/create-admin.ts abc123def456
 *
 * Requires environment variables:
 *   FIREBASE_PROJECT_ID
 *   FIREBASE_CLIENT_EMAIL
 *   FIREBASE_PRIVATE_KEY
 */

import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

function initFirebaseAdmin() {
  if (getApps().length > 0) return getApps()[0];

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    console.error("ERROR: Missing Firebase Admin credentials.");
    console.error("Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY.");
    process.exit(1);
  }

  return initializeApp({
    credential: cert({ projectId, clientEmail, privateKey: privateKey.replace(/\\n/g, "\n") }),
  });
}

async function main() {
  const identifier = process.argv[2];

  if (!identifier) {
    console.error("Usage: npx tsx scripts/create-admin.ts <email-or-uid>");
    process.exit(1);
  }

  console.log(`\n  ONIXX Admin Promotion Tool\n  ==========================\n`);
  console.log(`  Input: ${identifier}\n`);

  const app = initFirebaseAdmin();
  const auth = getAuth(app);

  let uid: string;
  let email: string | null;

  const isEmail = identifier.includes("@");

  try {
    console.log("  Looking up user...");
    const userRecord = isEmail
      ? await auth.getUserByEmail(identifier)
      : await auth.getUser(identifier);

    uid = userRecord.uid;
    email = userRecord.email ?? null;

    console.log(`  Found: ${email ?? "no email"} (UID: ${uid})\n`);
  } catch (error: unknown) {
    const code = (error as { code?: string }).code;
    if (code === "auth/user-not-found") {
      console.error(`  ERROR: No user found with ${isEmail ? "email" : "UID"} "${identifier}"\n`);
    } else {
      console.error(`  ERROR: Failed to look up user: ${(error as Error).message}\n`);
    }
    process.exit(1);
  }

  try {
    console.log("  Setting admin custom claim...");
    await auth.setCustomUserClaims(uid, { admin: true });
    console.log("  Claim set successfully.\n");
  } catch (error) {
    console.error(`  ERROR: Failed to set custom claim: ${(error as Error).message}\n`);
    process.exit(1);
  }

  try {
    console.log("  Verifying claim...");
    const user = await auth.getUser(uid);
    const adminClaim = user.customClaims?.admin;

    if (adminClaim === true) {
      console.log("  VERIFIED: admin claim is active.\n");
    } else {
      console.error("  WARNING: Claim was set but verification returned unexpected value.");
      console.error(`  Expected: true, Got: ${JSON.stringify(adminClaim)}\n`);
    }
  } catch (error) {
    console.error(`  WARNING: Could not verify claim: ${(error as Error).message}\n`);
  }

  console.log("  DONE. User is now an admin.");
  console.log(`  UID:   ${uid}`);
  console.log(`  Email: ${email ?? "(none)"}`);
  console.log(`  Claim: admin = true\n`);
  console.log("  Note: The user must sign out and sign back in for the claim to take effect.\n");
}

main();

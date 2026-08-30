import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { ENV } from "./env";

type ServiceAccountData = { project_id: string; client_email: string; private_key: string };

export function normalizeFirebasePrivateKey(privateKey: string) {
  return privateKey
    .replace(/-----BEGIN\s*PRIVATE\s*KEY-----/, "-----BEGIN PRIVATE KEY-----")
    .replace(/-----END\s*PRIVATE\s*KEY-----/, "-----END PRIVATE KEY-----")
    .replace(/\\n/g, "\n");
}

function getServiceAccount(): ServiceAccountData {
  if (!ENV.firebaseAdminServiceAccountJson) throw new Error("FIREBASE_ADMIN_SERVICE_ACCOUNT_JSON não configurado.");
  const parsed = JSON.parse(ENV.firebaseAdminServiceAccountJson) as ServiceAccountData;
  return { ...parsed, private_key: normalizeFirebasePrivateKey(parsed.private_key) };
}

export function getFirebaseAdminApp() {
  if (getApps().length) return getApps()[0]!;
  const credentials = getServiceAccount();
  return initializeApp({ credential: cert({ projectId: credentials.project_id, clientEmail: credentials.client_email, privateKey: credentials.private_key }) });
}

export async function verifyFirebaseIdToken(token: string) {
  return getAuth(getFirebaseAdminApp()).verifyIdToken(token);
}

export function getFirebaseFirestore() {
  return getFirestore(getFirebaseAdminApp());
}

import { getApp, getApps, initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  getAuth,
  onIdTokenChanged,
  setPersistence,
  signInWithPopup,
  signOut,
  browserLocalPersistence,
  type User,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
};

const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);

type FirebaseSession = { user: User | null; token: string | null; ready: boolean };
let session: FirebaseSession = { user: null, token: null, ready: false };
const listeners = new Set<() => void>();

function notifyListeners() {
  listeners.forEach(listener => listener());
}

void setPersistence(firebaseAuth, browserLocalPersistence);
onIdTokenChanged(firebaseAuth, async user => {
  const token = user ? await user.getIdToken() : null;
  session = { user, token, ready: true };
  notifyListeners();
});

export function getFirebaseSession() {
  return session;
}

export function subscribeFirebaseSession(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getFirebaseIdToken() {
  return session.token;
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  return signInWithPopup(firebaseAuth, provider);
}

export async function signOutFromFirebase() {
  return signOut(firebaseAuth);
}

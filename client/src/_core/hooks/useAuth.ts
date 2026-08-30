import { getFirebaseSession, signInWithGoogle, signOutFromFirebase, subscribeFirebaseSession } from "@/lib/firebase";
import { useCallback, useSyncExternalStore } from "react";

export function useAuth() {
  const session = useSyncExternalStore(subscribeFirebaseSession, getFirebaseSession, getFirebaseSession);
  const login = useCallback(async () => signInWithGoogle(), []);
  const logout = useCallback(async () => signOutFromFirebase(), []);
  const user = session.user ? { openId: `firebase:${session.user.uid}`, name: session.user.displayName, email: session.user.email } : null;
  return { user, loading: !session.ready, error: null, isAuthenticated: Boolean(user), login, logout, refresh: async () => session.user?.getIdToken(true) };
}

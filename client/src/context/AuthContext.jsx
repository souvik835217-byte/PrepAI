import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase/firebase";
import { AuthContext } from "./authContextStore";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] =
    useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        const usesPasswordProvider =
          firebaseUser?.providerData.some(
            ({ providerId }) => providerId === "password"
          );

        if (
          firebaseUser &&
          usesPasswordProvider &&
          !firebaseUser.emailVerified
        ) {
          setUser(null);
          setAuthLoading(false);
          await signOut(auth);
          return;
        }

        setUser(firebaseUser);
        setAuthLoading(false);
      },
      (error) => {
        console.error(
          "Firebase authentication error:",
          error
        );

        setUser(null);
        setAuthLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  const value = useMemo(
    () => ({
      user,
      setUser,
      authLoading,
      isAuthenticated: Boolean(user),
    }),
    [user, authLoading]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

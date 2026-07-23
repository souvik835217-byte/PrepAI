import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCiS2m6RkmmR_SzS-pOVNxc0zZ5HO3vfNs",
  authDomain: "ai-interview-platform-1f302.firebaseapp.com",
  projectId: "ai-interview-platform-1f302",
  storageBucket: "ai-interview-platform-1f302.firebasestorage.app",
  messagingSenderId: "501203498820",
  appId: "1:501203498820:web:f7bcf795a5249f3d674911"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
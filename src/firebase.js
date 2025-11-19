import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBUcXhHo6kgtVKVi89RE2xBg5I_fnk3foQ",
  authDomain: "baby-diaper-and-general-care.firebaseapp.com",
  projectId: "baby-diaper-and-general-care",
  storageBucket: "baby-diaper-and-general-care.firebasestorage.app",
  messagingSenderId: "2367725218",
  appId: "1:2367725218:web:55f8f2232b0e8a1fc7c1fb",
  measurementId: "G-FL0BYQC8Z8"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;

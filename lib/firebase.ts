// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAnalytics, Analytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, Auth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase only if it hasn't been initialized and we're in browser
let app: FirebaseApp | undefined;
if (typeof window !== 'undefined') {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
}

// Initialize Firebase Authentication and get a reference to the service (only on client)
let auth: Auth | undefined;
let googleProvider: GoogleAuthProvider | undefined;
let analytics: Analytics | undefined;

if (typeof window !== 'undefined' && app) {
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
  analytics = getAnalytics(app);
}

export { auth, googleProvider, analytics };

// Export app only if available
export const firebaseApp = typeof window !== 'undefined' && getApps().length > 0 ? getApp() : null;
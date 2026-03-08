// import { initializeApp, getApps, getApp } from "firebase/app";
// import {
//   getAuth,
//   GoogleAuthProvider,
//   signInWithPopup,
//   signOut,
//   User,
//   RecaptchaVerifier,
//   signInWithPhoneNumber,
//   onIdTokenChanged, // It's good practice to export this for hooks
// } from "firebase/auth";

// /**
//  * @file app/firebaseConfig.client.ts
//  * @description
//  * Client-side Firebase configuration and initialization.
//  *
//  * SECURITY BEST PRACTICE:
//  * This file uses environment variables (prefixed with `VITE_`) to store
//  * Firebase credentials. This prevents sensitive keys from being hardcoded
//  * and exposed in the public source code. You must create a `.env` file
// * in your project's root directory to store these values.
//  */

// // Access client-safe environment variables using Vite's `import.meta.env`.
// // Your build tool (like Vite) will replace these with the actual values at build time.
// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
//   authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
//   projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
//   storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
//   appId: import.meta.env.VITE_FIREBASE_APP_ID,
// };

// // Initialize Firebase only if it hasn't been initialized yet to avoid errors.
// const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// // Get Firebase Authentication instance.
// const auth = getAuth(app);

// // Export the User type and all necessary Firebase Auth functions and classes.
// // Your components can then import what they need directly from this file.
// export type { User };
// export {
//   auth,
//   GoogleAuthProvider, // Export the class, not an instance
//   signInWithPopup,
//   signOut,
//   RecaptchaVerifier,
//   signInWithPhoneNumber,
//   onIdTokenChanged,
// };



import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  User,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  onIdTokenChanged,
} from "firebase/auth";

/**
 * @file app/firebaseConfig.client.ts
 * @description
 * Client-side Firebase initialization using runtime environment variables.
 *
 * NOTE:
 * - We no longer use `import.meta.env` here because those are replaced at build-time.
 * - Instead, the values come from `window.__ENV__`, which is populated
 *   dynamically at runtime in `app/root.tsx` using Remix SSR.
 */

// ✅ Safely read Firebase config from runtime window.__ENV__
const firebaseConfig = {
  apiKey: (window as any).__ENV__?.FIREBASE_API_KEY,
  authDomain: (window as any).__ENV__?.FIREBASE_AUTH_DOMAIN,
  projectId: (window as any).__ENV__?.FIREBASE_PROJECT_ID,
  storageBucket: (window as any).__ENV__?.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: (window as any).__ENV__?.FIREBASE_MESSAGING_SENDER_ID,
  appId: (window as any).__ENV__?.FIREBASE_APP_ID,
};

// ✅ Initialize Firebase only once
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// ✅ Get Firebase Authentication instance
const auth = getAuth(app);

// ✅ Export everything you need
export type { User };
export {
  auth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  onIdTokenChanged,
};

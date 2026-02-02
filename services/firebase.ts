
<<<<<<< HEAD
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

=======
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

/**
 * FIREBASE SETUP INSTRUCTIONS:
 * 1. Go to https://console.firebase.google.com/
 * 2. Create a project and a Web App.
 * 3. Copy the 'firebaseConfig' object provided by Firebase.
 * 4. Paste those values below.
 */
>>>>>>> 0b6886b30f42ba84b6a79e344ab28656f0d46a20
const firebaseConfig = {
  apiKey: "AIzaSyAGTfpFkImja67DJJb5SOYdEL3J_lG_M94",
  authDomain: "academy-guild-model.firebaseapp.com",
  projectId: "academy-guild-model",
  storageBucket: "academy-guild-model.firebasestorage.app",
  messagingSenderId: "376466097359",
  appId: "1:376466097359:web:7bab72e5d6501eefdf23ba",
  measurementId: "G-S4ENYD4KWR"
};

<<<<<<< HEAD
// Initialize Firebase only once
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
=======
const app = initializeApp(firebaseConfig);
>>>>>>> 0b6886b30f42ba84b6a79e344ab28656f0d46a20

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);

<<<<<<< HEAD
export default app;

console.log("Academy Model: Firebase initialized for project:", firebaseConfig.projectId);
=======
// Helper for debugging connectivity
console.log("Academy Model: Firebase initialized for project:", firebaseConfig.projectId);
>>>>>>> 0b6886b30f42ba84b6a79e344ab28656f0d46a20

// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAghwzoGP6WlzIhEughX2Eb78O1DVbIHEg",
  authDomain: "journey-to-the-best.firebaseapp.com",
  projectId: "journey-to-the-best",
  storageBucket: "journey-to-the-best.firebasestorage.app",
  messagingSenderId: "330265201186",
  appId: "1:330265201186:web:3ff7dc67b10e42d7a5987b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize and export Firebase Auth
export const auth = getAuth(app);
export const db = getFirestore(app); // <-- Initialize and export Firestore

// Initialize and export Firebase Firestore
// export const firestore = getFirestore(app);  

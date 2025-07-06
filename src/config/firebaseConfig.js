// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// Import the new auth functions
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';
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

// Initialize Firebase Auth with persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
// Initialize and export other Firebase services
export const db = getFirestore(app);
// Export the new auth instance
export { auth };
// This code initializes Firebase with the provided configuration and sets up Firebase Auth with React Native AsyncStorage for persistence.
// It exports the Firestore database instance and the auth instance for use in other parts of the

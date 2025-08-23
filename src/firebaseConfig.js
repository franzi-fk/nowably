import { initializeApp } from "firebase/app"; // Initialize Firebase
import { getAuth, GoogleAuthProvider } from "firebase/auth"; // Authentication
import { getFirestore } from "firebase/firestore"; // Firestore

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize the services
const auth = getAuth(app); // Firebase Authentication
const db = getFirestore(app); // Firestore
const provider = new GoogleAuthProvider();

// Export the initialized services
export { auth, db, provider };
export default app; // Export the app instance as default

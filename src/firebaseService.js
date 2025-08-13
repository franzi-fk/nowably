import { auth, db, provider } from "@/firebaseConfig"; // Import the initialized auth instance from your firebaseConfig
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  deleteUser,
  reauthenticateWithPopup,
  signInAnonymously,
} from "firebase/auth"; // Modular imports
import { doc, getDoc, setDoc, getDocs } from "firebase/firestore";
import { deleteDemoUserData } from "./firestoreService";

// Create user if it doesn't exist
export async function createUserIfNotExists(user) {
  const userDocRef = doc(db, "users", user.uid);
  const userDoc = await getDoc(userDocRef);

  if (!userDoc.exists()) {
    try {
      await setDoc(userDocRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        createdAt: new Date(),
        role: "user",
      });
    } catch (e) {
      console.error("Error creating user record in Firestore:", e);
    }
  }
}

// Sign in with Google
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider); // Use signInWithPopup from the modular SDK
    return result.user; // Return the authenticated user
  } catch (error) {
    console.error("Error signing in with Google: ", error.message);
    throw error;
  }
};

// Sign out the current user
export const signOutUser = async () => {
  try {
    await signOut(auth); // Use signOut from the modular SDK
  } catch (error) {
    console.error("Error signing out: ", error.message);
    throw error;
  }
};

// Get current authenticated user
export const getCurrentUser = () => {
  return auth.currentUser; // Access currentUser from the initialized auth instance
};

// Delete user account
export async function deleteFirebaseAccount() {
  try {
    // Reauthenticate first
    await reauthenticateUser();

    // Then delete
    await deleteUser(auth.currentUser);
  } catch (error) {
    console.error("Error deleting user from Firebase Auth:", error);
    throw error;
  }
}

// Helper function to reauthenticate user (needed for account deletion)
export async function reauthenticateUser() {
  try {
    const result = await reauthenticateWithPopup(auth.currentUser, provider);
    return result;
  } catch (error) {
    console.error("Reauthentication failed:", error);
    throw error;
  }
}

// Sign in anonymously for demo mode
export async function loginDemo() {
  try {
    const userCredential = await signInAnonymously(auth);
    return userCredential.user;
  } catch (error) {
    console.error("Anonymous sign-in failed:", error);
    throw error;
  }
}

// Get UID of the currently signed-in demo user
export function getCurrentDemoUserId() {
  if (!auth.currentUser) {
    throw new Error("No demo user is signed in");
  }
  return auth.currentUser.uid;
}

// Delete demo user
export async function deleteDemoUser() {
  const user = auth.currentUser;
  if (user && user.isAnonymous) {
    try {
      await deleteUser(user);
    } catch (error) {
      console.error("Failed to delete demo user (Firebase):", error);
      throw error;
    }
  }
}

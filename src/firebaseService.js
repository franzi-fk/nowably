import { auth, db, provider } from "@/firebaseConfig"; // Import the initialized auth instance from your firebaseConfig
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  deleteUser,
  reauthenticateWithPopup,
} from "firebase/auth"; // Modular imports
import { doc, getDoc, setDoc } from "firebase/firestore";

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

// src/components/GoogleSignIn.js
import React from "react";
import { auth, googleProvider, db, storage } from "../../firebase"; // Import storage
import { signInWithPopup } from "firebase/auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Import storage functions

const GoogleSignIn = () => {
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("User signed in:", result.user);

      // Upload the user's profile picture to Firebase Storage
      const storageRef = ref(storage, `profile-pictures/${result.user.uid}`);
      const response = await fetch(result.user.photoURL);
      const blob = await response.blob();
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);

      // Check if the user exists in Firestore
      const userRef = doc(db, 'users', result.user.uid);
      const userSnapshot = await getDoc(userRef);

      // If the user doesn't exist, create a new document in Firestore
      if (!userSnapshot.exists()) {
        const userData = {
          displayName: result.user.displayName,
          email: result.user.email,
          photoURL: downloadURL,  // Store the Firebase Storage URL
          createdAt: new Date(),
          // Add any other data you want to store for each user
        };
        await setDoc(userRef, userData);
        console.log("User added to Firestore:", userData);
      }

    } catch (error) {
      console.error("Google Sign-In Error:", error);
    }
    toast.success("Successfully signed in with Google!");
    navigate("/home");
  };

  return (
    <button onClick={handleGoogleSignIn}>
      Sign In with Google
    </button>
  );
};

export default GoogleSignIn;

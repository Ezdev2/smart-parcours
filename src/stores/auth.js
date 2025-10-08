import { defineStore } from "pinia";
import { ref } from "vue";
import { auth, firestore } from "../config/firebase";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { FirebaseService } from "../services/firebaseService";

export const useAuthStore = defineStore("auth", () => {
  const user = ref(null);
  const loading = ref(true);
  const error = ref(null);

  const signIn = async (email, password) => {
    loading.value = true;
    error.value = null;
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const userData = await FirebaseService.getUserById(
        userCredential.user.uid
      );

      if (userData) {
        user.value = {
          id: userCredential.user.uid,
          email: userCredential.user.email,
          role: userData.role,
          profile: userData.profile,
          createdAt: userData.createdAt,
          lastLogin: new Date(),
          isActive: userData.isActive,
        };

        // Update last login in Firebase
        await FirebaseService.updateLastLogin(userCredential.user.uid);

        loading.value = false;
        return user.value;
      } else {
        throw new Error("User profile not found");
      }
    } catch (err) {
      error.value = err.message;
      loading.value = false;
      throw err;
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
      user.value = null;
      error.value = null;
    } catch (err) {
      error.value = err.message;
    }
  };

  const updateUserProfile = async (profileData) => {
    if (!user.value?.id) {
      throw new Error("No user logged in");
    }

    try {
      // Update in Firebase
      await FirebaseService.updateUserProfile(user.value.id, profileData);

      // Update local store
      user.value = {
        ...user.value,
        profile: {
          ...user.value.profile,
          ...profileData,
        },
      };

      return true;
    } catch (err) {
      console.error("Error updating user profile:", err);
      throw err;
    }
  };

  const refreshUserData = async () => {
    if (!user.value?.id) return;

    try {
      const userData = await FirebaseService.getUserById(user.value.id);
      if (userData) {
        user.value = {
          id: user.value.id,
          email: user.value.email,
          role: userData.role,
          profile: userData.profile,
          createdAt: userData.createdAt,
          lastLogin: user.value.lastLogin,
          isActive: userData.isActive,
        };
      }
    } catch (err) {
      console.error("Error refreshing user data:", err);
    }
  };

  const initializeAuth = () => {
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userData = await FirebaseService.getUserById(firebaseUser.uid);
          if (userData) {
            user.value = {
              id: firebaseUser.uid,
              email: firebaseUser.email,
              role: userData.role,
              profile: userData.profile,
              createdAt: userData.createdAt,
              lastLogin: userData.lastLoginAt || new Date(),
              isActive: userData.isActive,
            };
          }
        } catch (err) {
          console.error("Error loading user data:", err);
          user.value = null;
        }
      } else {
        user.value = null;
      }
      loading.value = false;
    });
  };

  // Computed getters
  const isAuthenticated = () => !!user.value;
  const isStudent = () => user.value?.role === "student";
  const isAdmin = () => user.value?.role === "admin";
  const isTeacher = () => user.value?.role === "teacher";

  return {
    user,
    loading,
    error,
    signIn,
    signOut: signOutUser,
    updateUserProfile,
    refreshUserData,
    initializeAuth,
    isAuthenticated,
    isStudent,
    isAdmin,
    isTeacher,
  };
});

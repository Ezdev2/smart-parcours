import { defineStore } from 'pinia'
import { ref } from 'vue'
import { auth, firestore } from '../config/firebase'
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const loading = ref(true)
  const error = ref(null)

  const signIn = async (email, password) => {
    loading.value = true
    error.value = null
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const userDoc = await getDoc(doc(firestore, 'users', userCredential.user.uid))
      
      if (userDoc.exists()) {
        const userData = userDoc.data()
        user.value = {
          id: userCredential.user.uid,
          email: userCredential.user.email,
          role: userData.role,
          profile: userData.profile,
          createdAt: userData.createdAt.toDate(),
          lastLogin: new Date()
        }
        loading.value = false
        return user.value
      } else {
        throw new Error('User profile not found')
      }
    } catch (err) {
      error.value = err.message
      loading.value = false
      throw err
    }
  }

  const signOutUser = async () => {
    try {
      await signOut(auth)
      user.value = null
    } catch (err) {
      error.value = err.message
    }
  }

  const initializeAuth = () => {
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(firestore, 'users', firebaseUser.uid))
          if (userDoc.exists()) {
            const userData = userDoc.data()
            user.value = {
              id: firebaseUser.uid,
              email: firebaseUser.email,
              role: userData.role,
              profile: userData.profile,
              createdAt: userData.createdAt.toDate(),
              lastLogin: new Date()
            }
          }
        } catch (err) {
          console.error('Error loading user data:', err)
          user.value = null
        }
      } else {
        user.value = null
      }
      loading.value = false
    })
  }

  return {
    user,
    loading,
    error,
    signIn,
    signOut: signOutUser,
    initializeAuth
  }
})
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy 
} from 'firebase/firestore'
import { firestore } from '../config/firebase'

export class FirebaseService {
  // User operations
  static async createUser(userId, userData) {
    const userRef = doc(firestore, 'users', userId)
    await updateDoc(userRef, {
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date()
    })
  }

  static async getUserById(userId) {
    const userDoc = await getDoc(doc(firestore, 'users', userId))
    if (userDoc.exists()) {
      const data = userDoc.data()
      return {
        id: userDoc.id,
        ...data,
        createdAt: data.createdAt.toDate()
      }
    }
    return null
  }

  static async getAllStudents() {
    const q = query(
      collection(firestore, 'users'),
      where('role', '==', 'student'),
      orderBy('profile.lastName')
    )
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate()
    }))
  }

  // Bulletin operations
  static async getBulletinsByStudent(studentId) {
    const q = query(
      collection(firestore, 'bulletins'),
      where('studentId', '==', studentId),
      orderBy('year', 'desc')
    )
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      uploadedAt: doc.data().uploadedAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate()
    }))
  }

  static async createBulletin(bulletinData) {
    const docRef = await addDoc(collection(firestore, 'bulletins'), {
      ...bulletinData,
      uploadedAt: new Date(),
      updatedAt: new Date()
    })
    return docRef.id
  }

  static async updateBulletin(bulletinId, bulletinData) {
    const bulletinRef = doc(firestore, 'bulletins', bulletinId)
    await updateDoc(bulletinRef, {
      ...bulletinData,
      updatedAt: new Date()
    })
  }

  // Recommendation operations
  static async getRecommendationsByStudent(studentId) {
    const q = query(
      collection(firestore, 'recommendations'),
      where('studentId', '==', studentId),
      orderBy('generatedAt', 'desc')
    )
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      generatedAt: doc.data().generatedAt.toDate()
    }))
  }

  static async createRecommendation(recommendationData) {
    const docRef = await addDoc(collection(firestore, 'recommendations'), {
      ...recommendationData,
      generatedAt: new Date()
    })
    return docRef.id
  }

  // Demo data helpers
  static async createDemoData() {
    const demoUsers = [
      {
        id: 'student-demo',
        email: 'eleve@test.com',
        role: 'student',
        profile: {
          firstName: 'Marie',
          lastName: 'Dubois',
          dateOfBirth: '2007-03-15',
          class: 'Première S',
          level: 'Première',
          filieres: ['Sciences', 'Mathématiques'],
          interests: ['Physique', 'Informatique', 'Recherche'],
          averageGrade: 15.2
        }
      },
      {
        id: 'admin-demo',
        email: 'direction@test.com',
        role: 'admin',
        profile: {
          firstName: 'Jean',
          lastName: 'Martin',
          position: 'Directeur'
        }
      }
    ]

    for (const user of demoUsers) {
      const userRef = doc(firestore, 'users', user.id)
      await updateDoc(userRef, {
        ...user,
        createdAt: new Date()
      })
    }
  }
}
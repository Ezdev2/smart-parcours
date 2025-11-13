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
  orderBy,
  setDoc,
  serverTimestamp,
  increment,
  limit,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { firestore, auth } from "../config/firebase";

export class FirebaseService {
  // ============ USER OPERATIONS ============

  /**
   * Créer un utilisateur complet (Auth + Firestore)
   */
  static async createCompleteUser(userData, temporaryPassword) {
    try {
      // 1. Créer l'utilisateur dans Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userData.email,
        temporaryPassword
      );
      const userId = userCredential.user.uid;

      // 2. Créer le profil dans Firestore
      const userProfile = {
        email: userData.email,
        role: userData.role || "student",
        profile: {
          ...userData.profile,
          registrationCode:
            userData.profile.registrationCode ||
            (await this.generateUniqueRegistrationCode(userData.role === "teacher" ? "TEACH" : "STU")),
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isActive: true,
        lastLoginAt: null,
      };

      await setDoc(doc(firestore, "users", userId), userProfile);

      // 3. Envoyer email de réinitialisation pour que l'utilisateur définisse son mot de passe
      await sendPasswordResetEmail(auth, userData.email);

      return { userId, success: true };
    } catch (error) {
      console.error("Error creating complete user:", error);
      throw error;
    }
  }

  /**
     * Créer un étudiant avec toutes les données nécessaires
     * @param {Object} studentData - Données de l'étudiant (firstName, lastName, email, class, level, registrationCode, schoolId, etc.)
     * @param {string} adminId - L'ID de l'admin qui crée l'étudiant
     */
    static async createStudent(studentData, adminId) {
      const temporaryPassword = this.generateTemporaryPassword();
  
      const userData = {
        email: studentData.email,
        role: "student",
        profile: {
          firstName: studentData.firstName,
          lastName: studentData.lastName,
          dateOfBirth: studentData.dateOfBirth || null,
          class: studentData.class, // Storing class ID
          level: await this.extractLevelFromClassId(studentData.class),
          filieres: studentData.filieres || [],
          interests: studentData.interests || [],
          averageGrade: studentData.averageGrade || null,
          registrationCode:
            studentData.registrationCode ||
            (await this.generateUniqueRegistrationCode("STU")),
          school: adminId,
        },
        bulletins: [], // Initialize an empty array for bulletin IDs
      };
  
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          userData.email,
          temporaryPassword
        );
        const userId = userCredential.user.uid;
  
        await setDoc(doc(firestore, "users", userId), {
          ...userData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          isActive: true,
          lastLoginAt: null,
        });
  
        const defaultBulletinData = {
          studentId: userId,
          year: new Date().getFullYear().toString(),
          semester: "Annuel",
          generalAverage: null,
          notes: [],
          comments: "Bulletin initial. À compléter par l'administration.",
          uploadedAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };
        const bulletinRef = await addDoc(
          collection(firestore, "bulletins"),
          defaultBulletinData
        );
  
        await updateDoc(doc(firestore, "users", userId), {
          bulletins: [bulletinRef.id],
          updatedAt: serverTimestamp(),
        });
  
        await sendPasswordResetEmail(auth, userData.email);
  
        console.log(
          `Student ${userId} created with default bulletin ${bulletinRef.id}`
        );
        return {
          userId,
          success: true,
          temporaryPassword,
          bulletinId: bulletinRef.id,
        };
      } catch (error) {
        console.error("Error creating student:", error);
        throw error;
      }
    }

  /**
   * Mettre à jour les détails d'un étudiant (seulement le profil Firestore)
   * @param {string} studentId - L'ID de l'étudiant
   * @param {Object} updateData - Les données à mettre à jour dans le profil de l'étudiant
   */
  static async updateStudent(studentId, updateData) {
    try {
      const studentRef = doc(firestore, "users", studentId);
      const currentStudentDoc = await getDoc(studentRef);

      if (!currentStudentDoc.exists()) {
        throw new Error("Student not found.");
      }

      const currentProfile = currentStudentDoc.data().profile || {};

      const updatedProfile = {
        ...currentProfile,
        ...updateData.profile, // Merge new profile data
        level: await this.extractLevelFromClassId(
          updateData.profile.class || currentProfile.class
        ), // Re-extract level based on potentially new class
      };

      await updateDoc(studentRef, {
        profile: updatedProfile,
        email: updateData.email || currentStudentDoc.data().email, // Allow email update if provided
        updatedAt: serverTimestamp(),
      });
      console.log(`Student ${studentId} updated successfully.`);
      return true;
    } catch (error) {
      console.error("Error updating student:", error);
      throw error;
    }
  }

  /**
   * Supprimer un étudiant (désactiver le compte et le profil)
   * Note: Firebase Auth n'est pas directement supprimé pour éviter des problèmes
   * mais le compte sera "désactivé" dans Firestore.
   * @param {string} studentId - L'ID de l'étudiant à supprimer (désactiver)
   */
  static async deleteStudent(studentId) {
    try {
      const studentRef = doc(firestore, "users", studentId);
      // Désactiver le compte au lieu de le supprimer
      await updateDoc(studentRef, {
        isActive: false,
        updatedAt: serverTimestamp(),
      });
      console.log(`Student ${studentId} deactivated successfully.`);
      return true;
    } catch (error) {
      console.error("Error deleting (deactivating) student:", error);
      throw error;
    }
  }

  /**
   * Obtenir tous les étudiants pour un admin donné
   * @param {string} adminId - L'ID de l'admin pour filtrer les étudiants
   */
  static async getAllStudentsForAdmin(adminId) {
    try {
      const q = query(
        collection(firestore, "users"),
        where("role", "==", "student"),
        where("profile.school", "==", adminId),
        where("isActive", "==", true),
        orderBy("profile.lastName")
      );
      const querySnapshot = await getDocs(q);
      const students = [];
      for (const doc of querySnapshot.docs) {
        const studentData = doc.data();
        const student = {
          id: doc.id,
          ...studentData,
          createdAt: studentData.createdAt?.toDate(),
          updatedAt: studentData.updatedAt?.toDate(),
          lastLoginAt: studentData.lastLoginAt?.toDate(),
        };

        // Fetch class name
        if (student.profile.class) {
          const classInfo = await this.getClassById(student.profile.class);
          student.profile.classDisplayName = classInfo
            ? classInfo.name
            : student.profile.class;
        }

        students.push(student);
      }
      return students;
    } catch (error) {
      console.error("Error getting students for admin:", error);
      throw error;
    }
  }

  /**
   * Obtenir les étudiants par classe pour un admin donné
   * @param {string} className - Le nom de la classe à filtrer (ou ID si on filtre par ID de classe)
   * @param {string} adminId - L'ID de l'admin pour filtrer les étudiants
   */
  static async getStudentsByClassAndAdmin(classId, adminId) {
    try {
      const q = query(
        collection(firestore, "users"),
        where("role", "==", "student"),
        where("profile.school", "==", adminId),
        where("profile.class", "==", classId),
        where("isActive", "==", true),
        orderBy("profile.lastName")
      );
      const querySnapshot = await getDocs(q);
      const students = [];
      for (const doc of querySnapshot.docs) {
        const studentData = doc.data();
        const student = {
          id: doc.id,
          ...studentData,
          createdAt: studentData.createdAt?.toDate(),
          updatedAt: studentData.updatedAt?.toDate(),
          lastLoginAt: studentData.lastLoginAt?.toDate(),
        };

        // Fetch class name
        if (student.profile.class) {
          const classInfo = await this.getClassById(student.profile.class);
          student.profile.classDisplayName = classInfo
            ? classInfo.name
            : student.profile.class;
        }
        students.push(student);
      }
      return students;
    } catch (error) {
      console.error("Error getting students by class for admin:", error);
      throw error;
    }
  }

  /**
   * Extraire le niveau de la classe à partir de son ID
   * @param {string} classId - L'ID de la classe
   * @returns {string} Le niveau de la classe
   */
  static async extractLevelFromClassId(classId) {
    if (!classId) return "Non défini";
    try {
      const classDoc = await this.getClassById(classId);
      return classDoc ? classDoc.level : "Non défini";
    } catch (error) {
      console.error("Error extracting level from class ID:", error);
      return "Non défini";
    }
  }

  /**
   * Créer un admin ou professeur
   */
  static async createAdmin(adminData) {
    const temporaryPassword = this.generateTemporaryPassword();

    const userData = {
      email: adminData.email,
      role: adminData.role || "admin",
      profile: {
        firstName: adminData.firstName,
        lastName: adminData.lastName,
        position: adminData.position,
      },
    };

    return await this.createCompleteUser(userData, temporaryPassword);
  }

  /**
   * Obtenir un utilisateur par ID
   */
  static async getUserById(userId) {
    try {
      const userDoc = await getDoc(doc(firestore, "users", userId));
      if (userDoc.exists()) {
        const data = userDoc.data();
        return {
          id: userDoc.id,
          ...data,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
          lastLoginAt: data.lastLoginAt?.toDate(),
        };
      }
      return null;
    } catch (error) {
      console.error("Error getting user:", error);
      throw error;
    }
  }

  /**
   * Mettre à jour les détails d'un utilisateur (seulement le profil Firestore)
   * Peut être utilisé pour student ou teacher
   */
  static async updateUserProfile(userId, profileData) {
    try {
      const userRef = doc(firestore, "users", userId);
      await updateDoc(userRef, {
        profile: profileData,
        updatedAt: serverTimestamp(),
      });
      return true;
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  }

  /**
   * Mettre à jour la dernière connexion
   */
  static async updateLastLogin(userId) {
    try {
      const userRef = doc(firestore, "users", userId);
      await updateDoc(userRef, {
        lastLoginAt: serverTimestamp(),
      });
      return true;
    } catch (error) {
      console.error("Error updating last login:", error);
      throw error;
    }
  }

  /**
   * Obtenir tous les étudiants
   */
  static async getAllStudents() {
    try {
      const q = query(
        collection(firestore, "users"),
        where("role", "==", "student"),
        where("isActive", "==", true),
        orderBy("profile.lastName")
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
        lastLoginAt: doc.data().lastLoginAt?.toDate(),
      }));
    } catch (error) {
      console.error("Error getting students:", error);
      throw error;
    }
  }

  /**
   * Obtenir les étudiants par classe
   */
  static async getStudentsByClass(className) {
    try {
      const q = query(
        collection(firestore, "users"),
        where("role", "==", "student"),
        where("profile.class", "==", className),
        where("isActive", "==", true),
        orderBy("profile.lastName")
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      }));
    } catch (error) {
      console.error("Error getting students by class:", error);
      throw error;
    }
  }

  /**
   * Obtenir tous les professeurs
   */
  static async getAllTeachers() {
    try {
      const q = query(
        collection(firestore, "users"),
        where("role", "==", "teacher"),
        where("isActive", "==", true),
        orderBy("profile.lastName")
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      }));
    } catch (error) {
      console.error("Error getting teachers:", error);
      throw error;
    }
  }

  /**
   * Créer un profil professeur
   */
  static async createTeacher(teacherData, adminId) {
    const temporaryPassword = this.generateTemporaryPassword();

    const userData = {
      email: teacherData.email,
      role: "teacher",
      profile: {
        firstName: teacherData.firstName,
        lastName: teacherData.lastName,
        registrationCode: teacherData.registrationCode ||
          (await this.generateUniqueRegistrationCode("TEACH")),
        school: adminId, // Link teacher to the admin's school
        classes: teacherData.classes || []
      }
    };

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userData.email,
        temporaryPassword
      );
      const userId = userCredential.user.uid;

      await setDoc(doc(firestore, "users", userId), {
        ...userData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isActive: true,
        lastLoginAt: null,
      });

      await sendPasswordResetEmail(auth, userData.email);

      return { userId, success: true, temporaryPassword };
    } catch (error) {
      console.error("Error creating teacher:", error);
      throw error;
    }
  }

  /**
   * Récuperer la liste des proffeseurs d'une école (admin)
   */
  static async getAllTeachersForAdmin(adminId) {
    try {
      const q = query(
        collection(firestore, "users"),
        where("role", "==", "teacher"),
        where("profile.school", "==", adminId),
        where("isActive", "==", true),
        orderBy("profile.lastName")
      );
      const querySnapshot = await getDocs(q);
      const teachers = [];

      for (const doc of querySnapshot.docs) {
        const teacherData = doc.data();
        const teacher = {
          id: doc.id,
          ...teacherData,
          createdAt: teacherData.createdAt?.toDate(),
          updatedAt: teacherData.updatedAt?.toDate(),
          lastLoginAt: teacherData.lastLoginAt?.toDate(),
        };

        // Enrichir avec les noms des classes
        if (teacher.profile.classes && teacher.profile.classes.length > 0) {
          const classPromises = teacher.profile.classes.map(id => this.getClassById(id));
          const fetchedClasses = await Promise.all(classPromises);
          teacher.profile.classNames = fetchedClasses
            .filter(cls => cls !== null)
            .map(cls => cls.name);
        } else {
          teacher.profile.classNames = [];
        }

        teachers.push(teacher);
      }
      return teachers;
    } catch (error) {
      console.error("Error getting teachers for admin:", error);
      throw error;
    }
  }

  /**
   * Récuperer la liste des étudiants par proffeseur
   */
  static async getStudentsForTeacher(teacherId) {
    try {
      const teacher = await this.getUserById(teacherId);
      if (!teacher || !teacher.profile.classes || teacher.profile.classes.length === 0) {
        return []; // If teacher not found or no classes assigned, return empty array
      }

      // Firestore 'in' query allows up to 10 items. If a teacher has more classes,
      // you'd need to split this into multiple queries. For simplicity, assuming <=10 classes for now.
      const q = query(
        collection(firestore, "users"),
        where("role", "==", "student"),
        where("profile.school", "==", teacher.profile.school),
        where("profile.class", "in", teacher.profile.classes), // Filter by assigned classes
        where("isActive", "==", true),
        orderBy("profile.lastName")
      );

      const querySnapshot = await getDocs(q);
      const students = [];

      for (const doc of querySnapshot.docs) {
        const studentData = doc.data();
        const student = {
          id: doc.id,
          ...studentData,
          createdAt: studentData.createdAt?.toDate(),
          updatedAt: studentData.updatedAt?.toDate(),
          lastLoginAt: studentData.lastLoginAt?.toDate(),
        };

        if (student.profile.class) {
          const classInfo = await this.getClassById(student.profile.class);
          student.profile.classDisplayName = classInfo ? classInfo.name : student.profile.class;
        }

        students.push(student);
      }
      return students;
    } catch (error) {
      console.error("Error getting students for teacher:", error);
      throw error;
    }
  }

  /**
   * Supprimer un utilisateur (désactiver le compte et le profil)
   * Note: Firebase Auth n'est pas directement supprimé pour éviter des problèmes
   * mais le compte sera "désactivé" dans Firestore.
   */
  static async deactivateUser(userId) {
    try {
      const userRef = doc(firestore, "users", userId);
      await updateDoc(userRef, {
        isActive: false,
        updatedAt: serverTimestamp(),
      });
      return true;
    } catch (error) {
      console.error("Error deactivating user:", error);
      throw error;
    }
  }

  // ============ BULLETIN OPERATIONS ============

  /**
   * Obtenir les bulletins d'un étudiant
   */
  static async getBulletinsByStudent(studentId) {
    try {
      const q = query(
        collection(firestore, "bulletins"),
        where("studentId", "==", studentId),
        orderBy("year", "desc"),
        orderBy("semester", "desc")
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        uploadedAt: doc.data().uploadedAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
        subjects: doc.data().subjects || [],
        classId: doc.data().classId || null,
      }));
    } catch (error) {
      console.error("Error getting bulletins:", error);
      throw error;
    }
  }

  /**
   * Obtenir un bulletin par ID
   */
  static async getBulletinById(bulletinId) {
    try {
      const bulletinDoc = await getDoc(doc(firestore, "bulletins", bulletinId));
      if (bulletinDoc.exists()) {
        const data = bulletinDoc.data();
        return {
          id: bulletinDoc.id,
          ...data,
          uploadedAt: data.uploadedAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
          subjects: data.subjects || [],
          classId: data.classId || null,
        };
      }
      return null;
    } catch (error) {
      console.error("Error getting bulletin:", error);
      throw error;
    }
  }

  /**
   * Obtenir tous les bulletins (pour admin)
   */
  static async getAllBulletins() {
    try {
      const q = query(
        collection(firestore, "bulletins"),
        orderBy("uploadedAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        uploadedAt: doc.data().uploadedAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      }));
    } catch (error) {
      console.error("Error getting all bulletins:", error);
      throw error;
    }
  }

  /**
   * Créer un bulletin
   * @param {Object} bulletinData - Les données du bulletin. Doit inclure `classId` et `professeurPrincipalName`.
   */
  static async createBulletin(bulletinData) {
    try {
      const docRef = await addDoc(collection(firestore, "bulletins"), {
        studentId: bulletinData.studentId,
        classId: bulletinData.classId,
        year: bulletinData.year || new Date().getFullYear().toString(),
        semester: bulletinData.semester || "Annuel",
        generalAverage: bulletinData.generalAverage || null,
        generalComment: bulletinData.generalComment || "",
        classRank: bulletinData.classRank || null,
        totalStudents: bulletinData.totalStudents || null,
        notes: [],
        subjects: bulletinData.subjects || [],
        professeurPrincipal: bulletinData.professeurPrincipalName || null,
        absencesComment: bulletinData.absencesComment || "",
        uploadedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      await this.createNotification(bulletinData.studentId, {
        type: "bulletin",
        title: "Nouveau bulletin disponible",
        message: `Votre bulletin ${bulletinData.semester} ${bulletinData.year} est disponible.`,
        relatedDocId: docRef.id,
      });

      await this.calculateAndUpdateStudentOverallAverage(bulletinData.studentId);

      return docRef.id;
    } catch (error) {
      console.error("Error creating bulletin:", error);
      throw error;
    }
  }

  /**
   * Mettre à jour un bulletin
   * @param {string} bulletinId - L'ID du bulletin.
   * @param {Object} bulletinData - Les données du bulletin. Doit inclure `classId` et `professeurPrincipalName`.
   */
  static async updateBulletin(bulletinId, bulletinData) {
    try {
      const bulletinRef = doc(firestore, "bulletins", bulletinId);
      await updateDoc(bulletinRef, {
        classId: bulletinData.classId,
        year: bulletinData.year,
        semester: bulletinData.semester,
        generalAverage: bulletinData.generalAverage || null,
        generalComment: bulletinData.generalComment || "",
        classRank: bulletinData.classRank || null,
        totalStudents: bulletinData.totalStudents || null,
        subjects: bulletinData.subjects || [],
        professeurPrincipal: bulletinData.professeurPrincipalName || null,
        absencesComment: bulletinData.absencesComment || "",
        updatedAt: serverTimestamp(),
      });

      await this.calculateAndUpdateStudentOverallAverage(bulletinData.studentId);

      return true;
    } catch (error) {
      console.error("Error updating bulletin:", error);
      throw error;
    }
  }

  /**
   * Supprimer un bulletin
   */
  static async deleteBulletin(bulletinId) {
    try {
      const bulletinToDelete = await this.getBulletinById(bulletinId);
      if (!bulletinToDelete) {
        throw new Error("Bulletin not found for deletion.");
      }
      const studentId = bulletinToDelete.studentId;

      await deleteDoc(doc(firestore, "bulletins", bulletinId));

      await this.calculateAndUpdateStudentOverallAverage(studentId);

      return true;
    } catch (error) {
      console.error("Error deleting bulletin:", error);
      throw error;
    }
  }

  /**
   * Obtenir le nombre d'étudiants dans une classe spécifique pour une école donnée.
   * Cette fonction est essentielle pour le champ 'totalStudents' du bulletin.
   */
  static async getStudentCountInClass(classId, schoolId) {
    try {
      const q = query(
        collection(firestore, "users"),
        where("role", "==", "student"),
        where("profile.class", "==", classId),
        where("profile.school", "==", schoolId),
        where("isActive", "==", true)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.size;
    } catch (error) {
      console.error("Error getting student count in class:", error);
      return 0;
    }
  }

  /**
   * Calcule la moyenne générale de l'étudiant sur tous ses bulletins
   * et met à jour le champ `profile.averageGrade` dans le document `users`.
   * @param {string} studentId L'ID de l'étudiant.
   */
  static async calculateAndUpdateStudentOverallAverage(studentId) {
    try {
      const studentBulletins = await this.getBulletinsByStudent(studentId);

      let totalWeightedGrades = 0;
      let totalCoefficients = 0;

      studentBulletins.forEach((bulletin) => {
        // Ensure subjects is an array and iterate through it
        (bulletin.subjects || []).forEach((subject) => {
          const grade = parseFloat(subject.grade);
          const coefficient = parseFloat(subject.coefficient);

          if (
            !isNaN(grade) &&
            !isNaN(coefficient) &&
            grade >= 0 &&
            grade <= 20 &&
            coefficient > 0
          ) {
            totalWeightedGrades += grade * coefficient;
            totalCoefficients += coefficient;
          }
        });
      });

      let overallAverage = null;
      if (totalCoefficients > 0) {
        overallAverage = parseFloat((totalWeightedGrades / totalCoefficients).toFixed(2));
      }

      // Update the student's profile with the new overall average
      const studentRef = doc(firestore, "users", studentId);
      const studentDoc = await getDoc(studentRef);

      if (studentDoc.exists()) {
        const currentProfile = studentDoc.data().profile || {};
        await updateDoc(studentRef, {
          "profile.averageGrade": overallAverage,
          updatedAt: serverTimestamp(),
        });
        console.log(`Student ${studentId} average grade updated to: ${overallAverage}`);
      } else {
        console.warn(`Student document ${studentId} not found for overall average update.`);
      }
    } catch (error) {
      console.error(`Error calculating and updating overall average for student ${studentId}:`, error);
      const studentRef = doc(firestore, "users", studentId);
      const studentDoc = await getDoc(studentRef);
      if (studentDoc.exists()) {
        await updateDoc(studentRef, {
          "profile.averageGrade": null,
          updatedAt: serverTimestamp(),
        });
      }
    }
  }

  // ============ RECOMMENDATION OPERATIONS ============

  /**
   * Obtenir les recommandations d'un étudiant (existantes)
   */
  static async getRecommendationsByStudent(studentId) {
    try {
      const q = query(
        collection(firestore, "recommendations"),
        where("studentId", "==", studentId),
        orderBy("generatedAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        generatedAt: doc.data().generatedAt?.toDate(),
        reviewedAt: doc.data().reviewedAt?.toDate(),
        // Ensure arrays and objects exist
        suggestedPaths: doc.data().suggestedPaths || [],
        strengths: doc.data().strengths || [],
        improvementAreas: doc.data().improvementAreas || [],
        academicProfile: doc.data().academicProfile || null,
      }));
    } catch (error) {
      console.error("Error getting recommendations:", error);
      throw error;
    }
  }

  /**
   * Créer une recommandation
   * Note: The structure needs to be exactly as defined for Firebase to accept it.
   */
  static async createRecommendation(recommendationData) {
    try {
      const docRef = await addDoc(collection(firestore, "recommendations"), {
        // Ensure all top-level fields are passed directly or with defaults
        studentId: recommendationData.studentId,
        type: recommendationData.type || 'orientation',
        title: recommendationData.title || 'Recommandation Personnalisée',
        content: recommendationData.content || '',
        strengths: recommendationData.strengths || [],
        improvementAreas: recommendationData.improvementAreas || [],
        suggestedPaths: recommendationData.suggestedPaths || [],
        academicProfile: recommendationData.academicProfile || null, // <<< NEW: Add academicProfile here >>>
        priority: recommendationData.priority || 'medium',
        status: recommendationData.status || 'pending',
        generatedBy: recommendationData.generatedBy || 'system',

        generatedAt: serverTimestamp(),
        reviewedAt: null,
        reviewedBy: null,
      });

      await this.createNotification(recommendationData.studentId, {
        type: "recommendation",
        title: `Nouvelle recommandation: ${recommendationData.title}`,
        message: `Une nouvelle recommandation a été générée pour vous.`,
        relatedDocId: docRef.id,
      });

      return docRef.id;
    } catch (error) {
      console.error("Error creating recommendation:", error);
      throw error;
    }
  }

  /**
   * Mettre à jour une recommandation
   * Note: If you have an admin UI to edit recommendations,
   * ensure academicProfile is passed in updateData as well.
   */
  static async updateRecommendation(recommendationId, updateData) {
    try {
      const recommendationRef = doc(
        firestore,
        "recommendations",
        recommendationId
      );
      await updateDoc(recommendationRef, {
        // Spread all updateData fields, ensuring academicProfile is included if present
        ...updateData,
        reviewedAt: serverTimestamp(),
      });
      return true;
    } catch (error) {
      console.error("Error updating recommendation:", error);
      throw error;
    }
  }

  /**
   * Obtenir toutes les recommandations (pour admin)
   */
  static async getAllRecommendations() {
    try {
      const q = query(
        collection(firestore, "recommendations"),
        orderBy("generatedAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        generatedAt: doc.data().generatedAt?.toDate(),
        reviewedAt: doc.data().reviewedAt?.toDate(),
      }));
    } catch (error) {
      console.error("Error getting all recommendations:", error);
      throw error;
    }
  }

  /**
   * Vérifier le nombre de recommandations générées par un étudiant cette semaine.
   * Limite: 3 par étudiant par semaine.
   */
  static async getWeeklyRecommendationCount(studentId) {
    try {
      const now = new Date();
      // Calculate the start of the current week (e.g., Monday 00:00:00)
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1)); // Adjust to Monday
      startOfWeek.setHours(0, 0, 0, 0);

      const q = query(
        collection(firestore, "recommendations"),
        where("studentId", "==", studentId),
        where("generatedAt", ">=", startOfWeek),
        orderBy("generatedAt", "desc") // orderBy is needed for where(range) queries
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.size;
    } catch (error) {
      console.error("Error getting weekly recommendation count:", error);
      throw error;
    }
  }

  // ============ CLASS OPERATIONS ============

  /**
   * Obtenir toutes les classes (version simplifiée sans orderBy)
   */
  static async getAllClasses() {
    try {
      // Première tentative avec orderBy
      try {
        const q = query(
          collection(firestore, "classes"),
          orderBy("level"),
          orderBy("name")
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
        }));
      } catch (indexError) {
        console.warn(
          "Index manquant pour la requête orderBy, utilisation d'une requête simple:",
          indexError
        );
        // Fallback sans orderBy si l'index n'existe pas
        const querySnapshot = await getDocs(collection(firestore, "classes"));
        const classes = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
        }));
        // Tri côté client
        return classes.sort((a, b) => {
          if (a.level !== b.level) {
            const levelOrder = { Seconde: 1, Première: 2, Terminale: 3 };
            return (levelOrder[a.level] || 999) - (levelOrder[b.level] || 999);
          }
          return a.name.localeCompare(b.name);
        });
      }
    } catch (error) {
      console.error("Error getting classes:", error);
      throw error;
    }
  }

  /**
   * Obtenir une classe par ID
   */
  static async getClassById(classId) {
    try {
      const classDoc = await getDoc(doc(firestore, "classes", classId));
      if (classDoc.exists()) {
        const data = classDoc.data();
        return {
          id: classDoc.id,
          ...data,
          createdAt: data.createdAt?.toDate(),
        };
      }
      return null;
    } catch (error) {
      console.error("Error getting class:", error);
      throw error;
    }
  }

  /**
   * Créer une classe
   */
  static async createClass(classData) {
    try {
      const docRef = await addDoc(collection(firestore, "classes"), {
        name: classData.name,
        level: classData.level,
        academicYear: classData.academicYear,
        schedule: classData.schedule || {},
        createdAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Error creating class:", error);
      throw error;
    }
  }

  /**
   * Mettre à jour une classe
   */
  static async updateClass(classId, classData) {
    try {
      const classRef = doc(firestore, "classes", classId);
      await updateDoc(classRef, classData);
      return true;
    } catch (error) {
      console.error("Error updating class:", error);
      throw error;
    }
  }

  // ============ SUBJECT OPERATIONS ============

  /**
   * Obtenir toutes les matières
   */
  static async getAllSubjects() {
    try {
      const querySnapshot = await getDocs(collection(firestore, "subjects"));
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error getting subjects:", error);
      throw error;
    }
  }

  /**
   * Obtenir une matière par ID
   */
  static async getSubjectById(subjectId) {
    try {
      const subjectDoc = await getDoc(doc(firestore, "subjects", subjectId));
      if (subjectDoc.exists()) {
        return { id: subjectDoc.id, ...subjectDoc.data() };
      }
      return null;
    } catch (error) {
      console.error("Error getting subject by ID:", error);
      throw error;
    }
  }

  /**
   * Créer une matière
   */
  static async createSubject(subjectData) {
    try {
      const docRef = await addDoc(collection(firestore, "subjects"), {
        name: subjectData.name,
        code: subjectData.code,
        coefficient: subjectData.coefficient,
      });
      return docRef.id;
    } catch (error) {
      console.error("Error creating subject:", error);
      throw error;
    }
  }

  /**
   * Mettre à jour une matière
   */
  static async updateSubject(subjectId, subjectData) {
    try {
      const subjectRef = doc(firestore, "subjects", subjectId);
      await updateDoc(subjectRef, subjectData);
      return true;
    } catch (error) {
      console.error("Error updating subject:", error);
      throw error;
    }
  }

  /**
   * Supprimer une matière
   */
  static async deleteSubject(subjectId) {
    try {
      await deleteDoc(doc(firestore, "subjects", subjectId));
      return true;
    } catch (error) {
      console.error("Error deleting subject:", error);
      throw error;
    }
  }

  // ============ NOTIFICATION OPERATIONS ============

  /**
   * Créer une notification
   */
  static async createNotification(userId, notificationData) {
    try {
      const docRef = await addDoc(collection(firestore, "notifications"), {
        userId,
        ...notificationData,
        isRead: false,
        createdAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Error creating notification:", error);
      throw error;
    }
  }

  /**
   * Obtenir les notifications d'un utilisateur
   */
  static async getUserNotifications(userId) {
    try {
      const q = query(
        collection(firestore, "notifications"),
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
      }));
    } catch (error) {
      console.error("Error getting notifications:", error);
      throw error;
    }
  }

  /**
   * Marquer une notification comme lue
   */
  static async markNotificationAsRead(notificationId) {
    try {
      const notificationRef = doc(firestore, "notifications", notificationId);
      await updateDoc(notificationRef, {
        isRead: true,
      });
      return true;
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw error;
    }
  }

  /**
   * Marquer toutes les notifications comme lues
   */
  static async markAllNotificationsAsRead(userId) {
    try {
      const q = query(
        collection(firestore, "notifications"),
        where("userId", "==", userId),
        where("isRead", "==", false)
      );
      const querySnapshot = await getDocs(q);

      const updatePromises = querySnapshot.docs.map((doc) =>
        updateDoc(doc.ref, { isRead: true })
      );

      await Promise.all(updatePromises);
      return true;
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      throw error;
    }
  }

  /**
   * Supprimer une notification
   */
  static async deleteNotification(notificationId) {
    try {
      await deleteDoc(doc(firestore, "notifications", notificationId));
      return true;
    } catch (error) {
      console.error("Error deleting notification:", error);
      throw error;
    }
  }

  // ============ SETTINGS OPERATIONS ============

  /**
   * Récupérer ou créer les paramètres système pour un admin
   */
  static async getOrCreateSettingsForAdmin(adminId) {
    try {
      const q = query(
        collection(firestore, "settings"),
        where("admin", "==", adminId)
      );
      const querySnapshot = await getDocs(q);

      // Si on trouve un paramètre existant → on le retourne
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const data = doc.data();

        return {
          id: doc.id,
          ...data,
          // Convert Firestore Timestamps to JavaScript Date objects if they exist
          createdAt: data.createdAt ? data.createdAt.toDate() : null,
          updatedAt: data.updatedAt ? data.updatedAt.toDate() : null,
        };
      }

      // Sinon → on crée les paramètres par défaut pour cet admin
      const currentYear = new Date().getFullYear(); // Use client-side date for default
      const defaultSettings = {
        name: "Nom de l'établissement",
        admin: adminId,
        academicYear: `${currentYear}-${currentYear + 1}`,
        classes: [],
        subjects: [],
        themeColor: "#003366",
        logoUrl: "https://picsum.photos/200/100",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(
        collection(firestore, "settings"),
        defaultSettings
      );

      // Fetch the newly created document to get the actual server timestamps
      const newDocSnapshot = await getDoc(docRef);
      const newDocData = newDocSnapshot.data();

      return {
        id: newDocSnapshot.id,
        ...newDocData,
        createdAt: newDocData.createdAt ? newDocData.createdAt.toDate() : null,
        updatedAt: newDocData.updatedAt ? newDocData.updatedAt.toDate() : null,
      };
    } catch (error) {
      console.error("Error getting or creating settings for admin:", error);
      throw error;
    }
  }

  /**
   * Mettre à jour les paramètres système
   */
  static async updateSettings(settingsId, settingsData) {
    try {
      const settingsRef = doc(firestore, "settings", settingsId);
      await updateDoc(settingsRef, {
        ...settingsData,
        updatedAt: serverTimestamp(),
      });
      console.log("Settings updated successfully!");
    } catch (error) {
      console.error("Error updating settings:", error);
      throw error;
    }
  }

  // get a single setting if update requires it
  static async getSettingsById(settingsId) {
    try {
      const docRef = doc(firestore, "settings", settingsId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt ? data.createdAt.toDate() : null,
          updatedAt: data.updatedAt ? data.updatedAt.toDate() : null,
        };
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error fetching settings by ID:", error);
      throw error;
    }
  }

  // ============ UTILITY FUNCTIONS ============

  /**
   * Générer un code d'inscription unique
   */
  static generateRegistrationCode(prefix = "STU") {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 3).toUpperCase();
    return `${prefix}${timestamp}${random}`;
  }

  /**
   * Générer un mot de passe temporaire
   */
  static generateTemporaryPassword() {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  /**
   * Extraire le niveau de la classe
   */
  static extractLevelFromClass(className) {
    const levelMap = {
      "6ème": "Collège",
      "5ème": "Collège",
      "4ème": "Collège",
      "3ème": "Collège",
      Seconde: "Seconde",
      Première: "Première",
      Terminale: "Terminale",
    };

    for (const [key, value] of Object.entries(levelMap)) {
      if (className.includes(key)) {
        return value;
      }
    }
    return "Non défini";
  }

  /**
   * Vérifier si un code d'inscription existe déjà
   */
  static async isRegistrationCodeUnique(code) {
    try {
      const q = query(
        collection(firestore, "users"),
        where("profile.registrationCode", "==", code)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.empty;
    } catch (error) {
      console.error("Error checking registration code:", error);
      return false;
    }
  }

  /**
   * Générer un code d'inscription unique (avec vérification)
   */
  static async generateUniqueRegistrationCode(prefix = "STU") {
    let code = this.generateRegistrationCode(prefix);
    let isUnique = await this.isRegistrationCodeUnique(code);

    while (!isUnique) {
      code = this.generateRegistrationCode(prefix);
      isUnique = await this.isRegistrationCodeUnique(code);
    }

    return code;
  }

  // ============ ANALYTICS & STATISTICS ============

  /**
   * Obtenir les statistiques des étudiants (existing, but ensure profile.level is correctly populated)
   */
  static async getStudentStatistics(adminId) {
    try {
      const students = await this.getAllStudentsForAdmin(adminId);
      const totalStudents = students.length;

      const classCounts = students.reduce((acc, student) => {
        const className = student.profile.classDisplayName || student.profile.class;
        acc[className] = (acc[className] || 0) + 1;
        return acc;
      }, {});

      // For dashboard's overall average calculation (student's profile.averageGrade)
      const overallAverages = students
        .filter(s => s.profile.averageGrade !== undefined && s.profile.averageGrade !== null)
        .map(s => parseFloat(s.profile.averageGrade));

        
        

      const globalAverage =
        overallAverages.length > 0
          ? overallAverages.reduce((sum, grade) => sum + grade, 0) /
            overallAverages.length
          : 0;

      // Group students by level to calculate average per level
      const averagesByLevel = students.reduce((acc, student) => {
          const level = student.profile.level;
          const overallAverage = student.profile.averageGrade !== undefined && student.profile.averageGrade !== null ? parseFloat(student.profile.averageGrade) : null;

          if (level && overallAverage !== null) {
              if (!acc[level]) {
                  acc[level] = { sum: 0, count: 0 };
              }
              acc[level].sum += overallAverage;
              acc[level].count += 1;
          }
          
          return acc;
      }, {});

      const finalAveragesByLevel = {};
      for (const level in averagesByLevel) {
          if (averagesByLevel[level].count > 0) {
              finalAveragesByLevel[level] = parseFloat((averagesByLevel[level].sum / averagesByLevel[level].count).toFixed(2));
          }
      }

      return {
        totalStudents,
        classCounts,
        globalAverage: globalAverage !== 0 ? parseFloat(globalAverage.toFixed(2)) : 0,
        studentsWithOverallGrades: overallAverages.length,
        averagesByLevel: finalAveragesByLevel
      };
    } catch (error) {
      console.error("Error getting student statistics:", error);
      throw error;
    }
  }

  /**
   * Obtenir le nombre d'étudiants dans une classe spécifique pour une école donnée.
   * Cette fonction est essentielle pour le champ 'totalStudents' du bulletin.
   * @param {string} classId - L'ID de la classe.
   * @param {string} schoolId - L'ID de l'école (ID de l'admin).
   * @returns {number} Le nombre total d'étudiants correspondant aux critères.
   */
  static async getStudentCountInClass(classId, schoolId) {
    try {
      const q = query(
        collection(firestore, "users"),
        where("role", "==", "student"),
        where("profile.class", "==", classId),
        where("profile.school", "==", schoolId),
        where("isActive", "==", true) // Seulement les étudiants actifs
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.size; // Returns the number of documents
    } catch (error) {
      console.error("Error getting student count in class:", error);
      return 0;
    }
  }

  /**
   * Obtenir le tableau de bord admin
   */
  static async getAdminDashboard(adminId) { // Pass adminId to filter data
    try {
      const [studentStats, bulletins, recommendations, classes, teachers] = await Promise.all(
        [
          this.getStudentStatistics(adminId),
          this.getAllBulletins(),
          this.getAllRecommendations(),
          this.getAllClasses(),
          this.getAllTeachersForAdmin(adminId),
        ]
      );

      const studentsForAdmin = await this.getAllStudentsForAdmin(adminId);
      const studentIdsForAdmin = new Set(studentsForAdmin.map(s => s.id));

      const bulletinsForAdmin = bulletins.filter(b => studentIdsForAdmin.has(b.studentId));
      const recommendationsForAdmin = recommendations.filter(r => studentIdsForAdmin.has(r.studentId));

      return {
        totalStudents: studentsForAdmin.length,
        totalTeachers: teachers.length,
        totalBulletins: bulletinsForAdmin.length,
        totalRecommendations: recommendationsForAdmin.length,
        totalClasses: classes.length,
        classDistribution: studentStats.classCounts,
        averagesByLevel: studentStats.averagesByLevel,
        globalAverage: studentStats.globalAverage
      };
    } catch (error) {
      console.error("Error getting admin dashboard:", error);
      throw error;
    }
  }

  // ============ SEARCH OPERATIONS ============

  /**
   * Rechercher des étudiants
   */
  static async searchStudents(searchTerm) {
    try {
      const students = await this.getAllStudents();
      const lowercaseSearch = searchTerm.toLowerCase();

      return students.filter(
        (student) =>
          student.profile.firstName.toLowerCase().includes(lowercaseSearch) ||
          student.profile.lastName.toLowerCase().includes(lowercaseSearch) ||
          student.email.toLowerCase().includes(lowercaseSearch) ||
          student.profile.registrationCode
            .toLowerCase()
            .includes(lowercaseSearch) ||
          student.profile.class.toLowerCase().includes(lowercaseSearch)
      );
    } catch (error) {
      console.error("Error searching students:", error);
      throw error;
    }
  }
}

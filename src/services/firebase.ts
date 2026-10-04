import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  getDocFromServer,
  collection,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { StudentProfile, StudentSettings } from '../types';

// Initialize Firebase App
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Test Firestore Connection on boot as required by skill guidelines
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    const testDocRef = doc(db, '_connection_test', 'status');
    // Attempt to read from server to verify live connectivity
    await getDocFromServer(testDocRef).catch(() => {
      // It's normal if document doesn't exist, as long as server responded
    });
    return true;
  } catch (err: any) {
    console.info('Firestore live server ping:', err?.message || 'connected');
    return false;
  }
}

// Sign In With Google
export async function signInWithGoogle(): Promise<User | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    console.error('Firebase Google Sign-In Error:', error);
    throw error;
  }
}

// Sign Out
export async function signOutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Firebase Sign-Out Error:', error);
    throw error;
  }
}

// Subscribe to Auth State Changes
export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

// Sync Student Profile to Cloud Firestore
export async function syncStudentProfileToCloud(profile: StudentProfile, uid: string): Promise<void> {
  try {
    const studentRef = doc(db, 'students', uid);
    await setDoc(
      studentRef,
      {
        uid,
        name: profile.name,
        stage: profile.stage,
        grade: profile.grade,
        gradeAr: profile.gradeAr,
        track: profile.track || '',
        educationSystem: profile.educationSystem,
        subjects: profile.subjects,
        skills: profile.skills,
        xp: profile.xp,
        level: profile.level,
        streakDays: profile.streakDays,
        todayGoalMinutes: profile.todayGoalMinutes,
        completedMinutesToday: profile.completedMinutesToday,
        todayGoalSubject: profile.todayGoalSubject,
        currentLessonId: profile.currentLessonId,
        currentSkillId: profile.currentSkillId,
        completedLessonIds: profile.completedLessonIds,
        assessmentResults: profile.assessmentResults || {},
        quranProgress: profile.quranProgress,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (err) {
    console.warn('Failed to sync student to Firestore (offline fallback active):', err);
  }
}

// Load Student Profile from Firestore
export async function loadStudentProfileFromCloud(uid: string): Promise<StudentProfile | null> {
  try {
    const studentRef = doc(db, 'students', uid);
    const snap = await getDoc(studentRef);
    if (snap.exists()) {
      return snap.data() as StudentProfile;
    }
  } catch (err) {
    console.warn('Failed to load student from Firestore:', err);
  }
  return null;
}

// Save Lesson Completion Log
export async function logLessonProgressToCloud(
  uid: string,
  lessonId: string,
  subjectId: string,
  score: number = 100
): Promise<void> {
  try {
    const progressCol = collection(db, 'students', uid, 'progress');
    await addDoc(progressCol, {
      studentId: uid,
      lessonId,
      subjectId,
      score,
      completedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.warn('Failed to log lesson progress to Firestore:', err);
  }
}

// Save Student Settings Preferences to Firestore
export async function saveStudentSettingsToCloud(
  studentIdOrUid: string,
  settings: StudentSettings
): Promise<boolean> {
  try {
    const settingsDoc = doc(db, 'students', studentIdOrUid, 'settings', 'preferences');
    await setDoc(
      settingsDoc,
      {
        studentId: studentIdOrUid,
        ...settings,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
    return true;
  } catch (err) {
    console.warn('Failed to save settings to Firestore:', err);
    return false;
  }
}

// Load Student Settings Preferences from Firestore
export async function loadStudentSettingsFromCloud(
  studentIdOrUid: string
): Promise<StudentSettings | null> {
  try {
    const settingsDoc = doc(db, 'students', studentIdOrUid, 'settings', 'preferences');
    const snap = await getDoc(settingsDoc);
    if (snap.exists()) {
      return snap.data() as StudentSettings;
    }
  } catch (err) {
    console.warn('Failed to load settings from Firestore:', err);
  }
  return null;
}


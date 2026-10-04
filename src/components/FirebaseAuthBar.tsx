import React, { useState, useEffect } from 'react';
import { User, LogIn, LogOut, Cloud, CloudCheck, AlertCircle, RefreshCw } from 'lucide-react';
import {
  signInWithGoogle,
  signOutUser,
  onAuthChange,
  syncStudentProfileToCloud,
  loadStudentProfileFromCloud,
  testFirestoreConnection,
} from '../services/firebase';
import { StudentProfile } from '../types';

interface FirebaseAuthBarProps {
  currentStudent: StudentProfile;
  onProfileSynced?: (profile: StudentProfile) => void;
}

export const FirebaseAuthBar: React.FC<FirebaseAuthBarProps> = ({
  currentStudent,
  onProfileSynced,
}) => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'local' | 'error'>('local');

  useEffect(() => {
    testFirestoreConnection();
    const unsubscribe = onAuthChange(async (user) => {
      setCurrentUser(user);
      if (user) {
        setIsSyncing(true);
        try {
          // Check if cloud profile exists
          const cloudData = await loadStudentProfileFromCloud(user.uid);
          if (cloudData && onProfileSynced) {
            onProfileSynced(cloudData);
          } else {
            // First time: sync local profile to cloud
            await syncStudentProfileToCloud(currentStudent, user.uid);
          }
          setSyncStatus('synced');
        } catch {
          setSyncStatus('error');
        } finally {
          setIsSyncing(false);
        }
      } else {
        setSyncStatus('local');
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    setIsSyncing(true);
    try {
      const user = await signInWithGoogle();
      if (user) {
        await syncStudentProfileToCloud(currentStudent, user.uid);
        setSyncStatus('synced');
      }
    } catch (err: any) {
      console.warn('Google sign-in canceled or failed:', err);
      setSyncStatus('error');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
      setCurrentUser(null);
      setSyncStatus('local');
    } catch (err) {
      console.warn('Sign out error:', err);
    }
  };

  const handleManualSync = async () => {
    if (!currentUser) return;
    setIsSyncing(true);
    try {
      await syncStudentProfileToCloud(currentStudent, currentUser.uid);
      setSyncStatus('synced');
    } catch {
      setSyncStatus('error');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="px-4 py-2 bg-slate-950/90 border-b border-slate-800/60 flex items-center justify-between text-xs">
      {currentUser ? (
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            {currentUser.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt={currentUser.displayName || 'User'}
                className="w-6 h-6 rounded-full border border-emerald-500/50"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px]">
                {currentUser.displayName?.charAt(0) || 'U'}
              </div>
            )}
            <div className="text-right leading-none">
              <span className="text-[11px] font-bold text-slate-200 block truncate max-w-[120px]">
                {currentUser.displayName || 'طالب مسجل'}
              </span>
              <span className="text-[9px] text-emerald-400 flex items-center gap-1 mt-0.5">
                <Cloud size={10} />
                <span>متزامن مع سحابة Firestore</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleManualSync}
              disabled={isSyncing}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-200 transition"
              title="مزامنة فورية"
            >
              <RefreshCw size={13} className={isSyncing ? 'animate-spin text-emerald-400' : ''} />
            </button>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] transition"
            >
              <LogOut size={11} />
              <span>خروج</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
            <Cloud size={13} className="text-slate-500" />
            <span>حفظ البيانات سحابياً (Firebase):</span>
          </div>

          <button
            onClick={handleSignIn}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[11px] transition shadow-sm"
          >
            {isSyncing ? (
              <RefreshCw size={11} className="animate-spin" />
            ) : (
              <svg className="w-3 h-3" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span>دخول Google</span>
          </button>
        </div>
      )}
    </div>
  );
};

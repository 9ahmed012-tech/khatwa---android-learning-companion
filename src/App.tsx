/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import { AndroidFrame } from './components/AndroidFrame';
import { Navigation, TabKey } from './components/Navigation';
import { ProfileSwitcher } from './components/ProfileSwitcher';
import { FirebaseAuthBar } from './components/FirebaseAuthBar';
import { OnboardingModal } from './components/OnboardingModal';
import { HomeScreen } from './screens/HomeScreen';
import { StudyScreen } from './screens/StudyScreen';
import { AssessmentScreen } from './screens/AssessmentScreen';
import { AITutorScreen } from './screens/AITutorScreen';
import { SkillsScreen } from './screens/SkillsScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { ExploreScreen } from './screens/ExploreScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { LifeWellnessScreen } from './screens/LifeWellnessScreen';
import { IslamicKnowledgeScreen } from './screens/IslamicKnowledgeScreen';
import { GamesScreen } from './screens/GamesScreen';
import { StudentProfile } from './types';
import {
  getInitialProfiles,
  getActiveStudentId,
  setActiveStudentId,
  saveActiveProfile,
} from './services/storageService';

export default function App() {
  const [profiles, setProfiles] = useState<Record<string, StudentProfile>>(() => getInitialProfiles());
  const [activeId, setActiveId] = useState<string>(() => getActiveStudentId());
  const [activeTab, setActiveTab] = useState<TabKey>('home');
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);

  // Cross-screen navigation params
  const [studySubjectId, setStudySubjectId] = useState<string | undefined>(undefined);
  const [studyLessonId, setStudyLessonId] = useState<string | undefined>(undefined);
  const [tutorSubjectName, setTutorSubjectName] = useState<string | undefined>(undefined);

  const currentStudent = profiles[activeId] || Object.values(profiles)[0];

  // Save current student ID when changed
  const handleSwitchStudent = (newId: string) => {
    setActiveId(newId);
    setActiveStudentId(newId);
  };

  // Update profile in memory and storage
  const handleProfileUpdate = (updated: StudentProfile) => {
    setProfiles((prev) => ({
      ...prev,
      [updated.id]: updated,
    }));
    saveActiveProfile(updated);
  };

  // Navigation callbacks
  const handleNavigateToStudy = (subjectId?: string, lessonId?: string) => {
    setStudySubjectId(subjectId);
    setStudyLessonId(lessonId);
    setActiveTab('study');
  };

  const handleNavigateToTutor = (subjectName?: string) => {
    setTutorSubjectName(subjectName);
    setActiveTab('tutor');
  };

  const handleNavigateToAssessment = () => {
    setActiveTab('assessment');
  };

  const handleNavigateToSkills = () => {
    setActiveTab('skills');
  };

  const weakCount = Object.values(currentStudent.assessmentResults).reduce(
    (acc, res) => acc + (res.weakAreas?.length || 0),
    0
  );

  return (
    <AndroidFrame activeTabTitle={activeTab}>
      <div className="flex flex-col h-full bg-slate-900 text-slate-100">
        {/* Android Top App Bar */}
        <header className="shrink-0 px-4 py-3 bg-slate-950/70 border-b border-slate-800/80 flex items-center justify-between z-30">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-black text-slate-950 text-base shadow-sm">
              خـ
            </div>
            <div>
              <span className="text-xs font-black tracking-tight text-slate-100 block">خُـطـوة</span>
              <span className="text-[10px] text-emerald-400 block -mt-0.5">رفيق التعلّم الذكي</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab('settings')}
              className={`p-2 rounded-xl transition ${
                activeTab === 'settings'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-slate-800/60 hover:bg-slate-700 text-slate-300'
              }`}
              title="الإعدادات والتنبيهات"
            >
              <SettingsIcon size={16} />
            </button>

            <ProfileSwitcher
              currentStudent={currentStudent}
              allProfiles={profiles}
              onSwitchStudent={handleSwitchStudent}
              onOpenOnboarding={() => setShowOnboarding(true)}
            />
          </div>
        </header>

        {/* Firebase Authentication & Cloud Sync Bar */}
        <FirebaseAuthBar
          currentStudent={currentStudent}
          onProfileSynced={(cloudProfile) => {
            handleProfileUpdate(cloudProfile);
          }}
        />

        {/* Dynamic Screen Viewport */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'home' && (
            <HomeScreen
              student={currentStudent}
              onNavigateToStudy={handleNavigateToStudy}
              onNavigateToAssessment={handleNavigateToAssessment}
              onNavigateToTutor={handleNavigateToTutor}
              onNavigateToSkills={handleNavigateToSkills}
              onNavigateToSection={(sec) => setActiveTab(sec)}
              onProfileUpdate={handleProfileUpdate}
            />
          )}

          {activeTab === 'study' && (
            <StudyScreen
              student={currentStudent}
              selectedSubjectId={studySubjectId}
              initialLessonId={studyLessonId}
              onProfileUpdate={handleProfileUpdate}
              onNavigateToTutor={handleNavigateToTutor}
            />
          )}

          {activeTab === 'assessment' && (
            <AssessmentScreen
              student={currentStudent}
              onProfileUpdate={handleProfileUpdate}
              onNavigateToStudy={handleNavigateToStudy}
              onNavigateToTutor={handleNavigateToTutor}
            />
          )}

          {activeTab === 'tutor' && (
            <AITutorScreen
              student={currentStudent}
              initialSubjectName={tutorSubjectName}
              onNavigateToStudy={handleNavigateToStudy}
            />
          )}

          {activeTab === 'skills' && (
            <SkillsScreen
              student={currentStudent}
              onProfileUpdate={handleProfileUpdate}
              onNavigateToTutor={handleNavigateToTutor}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsScreen
              student={currentStudent}
              onBack={() => setActiveTab('home')}
            />
          )}

          {activeTab === 'explore' && (
            <ExploreScreen
              student={currentStudent}
              onNavigate={(section) => {
                if (section === 'study') setActiveTab('study');
                else if (section === 'tutor') setActiveTab('tutor');
                else if (section === 'skills') setActiveTab('skills');
                else if (section === 'life') setActiveTab('life');
                else if (section === 'islamic') setActiveTab('islamic');
                else if (section === 'games') setActiveTab('games');
              }}
            />
          )}

          {activeTab === 'profile' && (
            <ProfileScreen
              student={currentStudent}
              onNavigateToSettings={() => setActiveTab('settings')}
              onNavigateToExplore={() => setActiveTab('explore')}
            />
          )}

          {activeTab === 'life' && (
            <LifeWellnessScreen
              student={currentStudent}
              onProfileUpdate={handleProfileUpdate}
              onBack={() => setActiveTab('explore')}
            />
          )}

          {activeTab === 'islamic' && (
            <IslamicKnowledgeScreen
              student={currentStudent}
              onProfileUpdate={handleProfileUpdate}
              onBack={() => setActiveTab('explore')}
            />
          )}

          {activeTab === 'games' && (
            <GamesScreen
              student={currentStudent}
              onProfileUpdate={handleProfileUpdate}
              onBack={() => setActiveTab('explore')}
            />
          )}
        </div>

        {/* Bottom Material 3 Android Navigation */}
        <Navigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
          weakCount={weakCount}
        />

        {/* 8-Step Onboarding Modal */}
        <OnboardingModal
          isOpen={showOnboarding}
          onClose={() => setShowOnboarding(false)}
          onComplete={(newProfile) => {
            setProfiles((prev) => ({
              ...prev,
              [newProfile.id]: newProfile,
            }));
            saveActiveProfile(newProfile);
            setActiveId(newProfile.id);
            setActiveStudentId(newProfile.id);
            setShowOnboarding(false);
          }}
          onSelectPreset={(presetId) => {
            setActiveId(presetId);
            setActiveStudentId(presetId);
            setShowOnboarding(false);
          }}
        />
      </div>
    </AndroidFrame>
  );
}

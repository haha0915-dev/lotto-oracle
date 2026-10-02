/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { ActiveTab, Language, LottoSet, NotificationSettings, UserProfile } from './types';
import { translations } from './data/translations';
import {
  INITIAL_USER,
  INITIAL_PREDICTION,
  INITIAL_HISTORY,
  INITIAL_NOTIFICATIONS
} from './data/initialData';
import { TopAppBar } from './components/TopAppBar';
import { BottomNavBar } from './components/BottomNavBar';
import { HomeScreen } from './components/HomeScreen';
import { HistoryScreen } from './components/HistoryScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { LoginScreen } from './components/LoginScreen';
import { Modals } from './components/Modals';
import { isSupabaseConfigured, supabase } from './supabase';

export default function App() {
  const [authUser, setAuthUser] = useState<SupabaseUser | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const isLoggedIn = authUser !== null || isGuest;

  // Navigation tab
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');

  // Language setting ('ko' by default as requested in prompt)
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('oracle_lang');
    return (saved === 'en' || saved === 'ko') ? saved : 'ko';
  });

  // User profile
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('oracle_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return INITIAL_USER;
  });

  // Current Prediction on Home
  const [currentPrediction, setCurrentPrediction] = useState<LottoSet>(() => {
    const saved = localStorage.getItem('oracle_current_pred');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return INITIAL_PREDICTION;
  });

  // History (Strict maximum 5 items as specified in design & mockups)
  const [history, setHistory] = useState<LottoSet[]>(() => {
    const saved = localStorage.getItem('oracle_history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed.slice(0, 5);
      } catch {
        // fallback
      }
    }
    return INITIAL_HISTORY;
  });

  // Notification settings
  const [notifications, setNotifications] = useState<NotificationSettings>(INITIAL_NOTIFICATIONS);

  // Daily counter
  const [todaysPredictions, setTodaysPredictions] = useState<number>(12);

  // Active modal
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedBall, setSelectedBall] = useState<number | null>(null);

  // History menu dropdown
  const [isHistoryMenuOpen, setIsHistoryMenuOpen] = useState(false);

  // Floating Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const t = translations[language];

  useEffect(() => {
    if (!supabase) {
      setIsAuthLoading(false);
      return;
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthUser(session?.user ?? null);
      if (session?.user) setIsGuest(false);
      setIsAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!authUser) return;

    const metadata = authUser.user_metadata;
    setUser(prev => ({
      ...prev,
      email: authUser.email ?? prev.email,
      name: metadata.full_name ?? metadata.name ?? prev.name,
      avatarUrl: metadata.avatar_url ?? metadata.picture ?? prev.avatarUrl
    }));
  }, [authUser]);

  // Save app data to localStorage
  useEffect(() => {
    localStorage.setItem('oracle_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('oracle_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('oracle_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('oracle_current_pred', JSON.stringify(currentPrediction));
  }, [currentPrediction]);

  // Show auto-dismissing toast
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(prev => (prev === message ? null : prev));
    }, 2800);
  };

  const handleEmailAuth = async (email: string, password: string, isSignUp: boolean) => {
    if (!supabase) {
      showToast(language === 'ko' ? 'Supabase 환경변수를 설정해 주세요.' : 'Set the Supabase environment variables first.');
      return;
    }

    const { data, error } = isSignUp
      ? await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin }
        })
      : await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      showToast(error.message);
      return;
    }

    if (isSignUp && !data.session) {
      showToast(language === 'ko' ? '가입 확인 이메일을 확인해 주세요.' : 'Check your email to confirm your account.');
    } else {
      showToast(language === 'ko' ? '오라클에 오신 것을 환영합니다.' : 'Welcome to the Oracle.');
    }
  };

  const handleOAuthLogin = async (provider: 'google' | 'kakao') => {
    if (!supabase) {
      showToast(language === 'ko' ? 'Supabase 환경변수를 설정해 주세요.' : 'Set the Supabase environment variables first.');
      return;
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin,
        queryParams: provider === 'kakao'
          ? { scope: 'profile_image profile_nickname' }
          : undefined
      }
    });

    if (error) showToast(error.message);
  };

  const handleGuestLogin = () => {
    setUser(prev => ({ ...prev, email: 'guest@oracle.io' }));
    setIsGuest(true);
  };

  // Generate new prediction handler
  const handleGenerateNew = (newSet: LottoSet) => {
    setCurrentPrediction(newSet);
    setTodaysPredictions(prev => prev + 1);
  };

  // Save current set to history (Enforcing MAX 5 rule: prepends new, drops oldest if > 5)
  const handleSaveCurrentSet = (setToSave: LottoSet) => {
    const alreadySaved = history.some(h => h.id === setToSave.id);
    if (alreadySaved) {
      showToast(language === 'ko' ? '이미 이력에 저장된 번호입니다.' : 'This set is already saved.');
      return;
    }

    setHistory(prev => {
      const willReplace = prev.length >= 5;
      const updated = [setToSave, ...prev.slice(0, 4)];
      if (willReplace) {
        showToast(
          language === 'ko'
            ? `번호가 저장되었습니다. (가장 오래된 번호가 교체되었습니다)`
            : `Set saved. (Oldest entry was replaced)`
        );
      } else {
        showToast(t.setSaved);
      }
      return updated;
    });
  };

  // Delete individual set from history
  const handleDeleteSet = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  // Load a set from history to the home screen current prediction
  const handleSelectSetToCurrent = (set: LottoSet) => {
    setCurrentPrediction(set);
    setActiveTab('home');
    showToast(language === 'ko' ? '이 번호가 홈 화면 예측으로 불러와졌습니다.' : 'Set loaded to Current Prediction.');
  };

  // Clear all history
  const handleConfirmClearHistory = () => {
    setHistory([]);
    showToast(language === 'ko' ? '모든 이력이 초기화되었습니다.' : 'All history cleared.');
  };

  // User Profile update
  const handleUpdateUser = (updated: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...updated }));
  };

  // Ball inspection
  const handleSelectBall = (ballNum: number) => {
    setSelectedBall(ballNum);
    setActiveModal('ball');
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-[#111318] flex items-center justify-center" role="status">
        <span className="inline-block w-6 h-6 border-2 border-[#ffd700] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If user is logged out, render the Login Screen
  if (!isLoggedIn) {
    return (
      <div className="relative min-h-screen bg-[#111318]">
        <LoginScreen
          onEmailAuth={handleEmailAuth}
          onOAuthLogin={handleOAuthLogin}
          onGuestLogin={handleGuestLogin}
          language={language}
          onLanguageChange={setLanguage}
          onShowToast={showToast}
        />

        {/* Global Toast */}
        {toastMessage && (
          <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-[#1e2024]/95 text-[#ffd700] border border-[#ffd700]/30 px-5 py-2.5 rounded-full shadow-2xl backdrop-blur-md text-xs sm:text-sm font-semibold flex items-center gap-2 animate-bounce">
            <span className="material-symbols-outlined text-sm fill-1">auto_awesome</span>
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111318] text-[#e2e2e8] font-body relative overflow-x-hidden selection:bg-[#ffd700]/30 selection:text-white">
      {/* Fixed Top Bar */}
      <TopAppBar
        currentTab={activeTab}
        language={language}
        onLanguageChange={setLanguage}
        onOpenNotifications={() => setActiveModal('notifications')}
        onOpenHistoryMenu={() => setIsHistoryMenuOpen(prev => !prev)}
        hasUnreadNotifications={true}
      />

      {/* History Menu Dropdown */}
      {isHistoryMenuOpen && activeTab === 'history' && (
        <div 
          className="fixed top-16 right-6 z-50 bg-[#1e2024] border border-white/10 rounded-2xl p-2 shadow-2xl space-y-1 w-44 backdrop-blur-xl animate-fade-in"
          onClick={() => setIsHistoryMenuOpen(false)}
        >
          <button
            onClick={() => {
              setHistory(INITIAL_HISTORY);
              showToast(language === 'ko' ? '샘플 기록 5개로 복원되었습니다.' : 'Reset to sample 5 sets.');
            }}
            className="w-full text-left px-3 py-2 text-xs font-semibold text-[#e2e2e8] hover:bg-white/5 rounded-xl flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm text-[#ffd700]">refresh</span>
            <span>{language === 'ko' ? '샘플 복원' : 'Reset Samples'}</span>
          </button>

          <button
            onClick={() => setActiveModal('clearConfirm')}
            className="w-full text-left px-3 py-2 text-xs font-semibold text-[#ffb4ab] hover:bg-[#93000a]/20 rounded-xl flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm fill-1">delete_sweep</span>
            <span>{t.clearAll}</span>
          </button>
        </div>
      )}

      {/* Main Tab Views */}
      <div className="w-full">
        {activeTab === 'home' && (
          <HomeScreen
            currentPrediction={currentPrediction}
            onGenerateNew={handleGenerateNew}
            onSaveCurrentSet={handleSaveCurrentSet}
            language={language}
            onShowToast={showToast}
            onOpenProTip={() => setActiveModal('protip')}
            onSelectBall={handleSelectBall}
            todaysPredictionCount={todaysPredictions}
          />
        )}

        {activeTab === 'history' && (
          <HistoryScreen
            history={history}
            onDeleteSet={handleDeleteSet}
            onSelectSetToCurrent={handleSelectSetToCurrent}
            language={language}
            onShowToast={showToast}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileScreen
            user={user}
            language={language}
            onLanguageChange={setLanguage}
            onOpenNotificationsModal={() => setActiveModal('notifications')}
            onOpenPrivacyModal={() => setActiveModal('privacy')}
            onOpenSupportModal={() => setActiveModal('support')}
            onOpenEditProfileModal={() => setActiveModal('editProfile')}
            onLogout={async () => {
              if (authUser && supabase) {
                const { error } = await supabase.auth.signOut();
                if (error) {
                  showToast(error.message);
                  return;
                }
              }
              setAuthUser(null);
              setIsGuest(false);
              showToast(language === 'ko' ? '로그아웃되었습니다.' : 'Logged out.');
            }}
            onShowToast={showToast}
          />
        )}
      </div>

      {/* Fixed Bottom Navigation Bar */}
      <BottomNavBar
        currentTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setIsHistoryMenuOpen(false);
        }}
        language={language}
      />

      {/* Interactive Modals */}
      <Modals
        activeModal={activeModal}
        onClose={() => {
          setActiveModal(null);
          setSelectedBall(null);
        }}
        language={language}
        notifications={notifications}
        onUpdateNotifications={setNotifications}
        user={user}
        onUpdateUser={handleUpdateUser}
        selectedBall={selectedBall}
        onConfirmClearHistory={handleConfirmClearHistory}
        onShowToast={showToast}
      />

      {/* Global Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#1e2024]/95 text-[#ffd700] border border-[#ffd700]/30 px-5 py-2.5 rounded-full shadow-2xl backdrop-blur-md text-xs sm:text-sm font-semibold flex items-center gap-2">
          <span className="material-symbols-outlined text-sm fill-1">auto_awesome</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

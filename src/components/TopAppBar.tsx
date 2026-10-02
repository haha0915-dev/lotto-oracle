import React from 'react';
import { ActiveTab, Language } from '../types';
import { translations } from '../data/translations';

interface TopAppBarProps {
  currentTab: ActiveTab;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenNotifications: () => void;
  onOpenHistoryMenu?: () => void;
  hasUnreadNotifications?: boolean;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  currentTab,
  language,
  onLanguageChange,
  onOpenNotifications,
  onOpenHistoryMenu,
  hasUnreadNotifications = true
}) => {
  const t = translations[language];

  return (
    <header className="fixed top-0 w-full z-50 bg-[#111318]/90 backdrop-blur-md flex items-center justify-between px-6 h-16 max-w-2xl left-1/2 -translate-x-1/2 transition-colors">
      {/* Brand Zone: Clean Logo & Wordmark */}
      <div className="flex items-center gap-2 select-none">
        <span 
          className="material-symbols-outlined text-[#ffd700] text-2xl fill-1 animate-pulse"
          data-icon="auto_awesome"
        >
          auto_awesome
        </span>
        <h1 className="font-headline text-2xl font-extrabold tracking-tight text-[#ffd700]">
          {t.appName}
        </h1>
      </div>

      {/* Action Zone */}
      <div className="flex items-center gap-3">
        {/* Quick Language Switch Pill */}
        <button
          onClick={() => onLanguageChange(language === 'ko' ? 'en' : 'ko')}
          className="px-2.5 py-1 text-xs font-semibold rounded-full bg-[#1e2024] text-[#d0c6ab] hover:text-[#ffd700] hover:bg-[#282a2e] transition-colors border border-white/5"
          title="Toggle Language"
        >
          {language === 'ko' ? 'EN' : '한국어'}
        </button>

        {currentTab === 'history' && onOpenHistoryMenu ? (
          <button
            onClick={onOpenHistoryMenu}
            aria-label="History Options"
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#8a8d91] hover:text-[#e2e2e8] hover:bg-[#1e2024] active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-2xl">more_vert</span>
          </button>
        ) : (
          <button
            onClick={onOpenNotifications}
            aria-label={t.notifications}
            className="relative w-10 h-10 rounded-full flex items-center justify-center text-[#8a8d91] hover:text-[#e2e2e8] hover:bg-[#1e2024] active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-2xl">notifications</span>
            {hasUnreadNotifications && (
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#ffd700] shadow-[0_0_8px_#ffd700]" />
            )}
          </button>
        )}
      </div>
    </header>
  );
};

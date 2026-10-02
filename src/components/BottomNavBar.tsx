import React from 'react';
import { ActiveTab, Language } from '../types';
import { translations } from '../data/translations';

interface BottomNavBarProps {
  currentTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  language: Language;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  currentTab,
  onTabChange,
  language
}) => {
  const t = translations[language];

  const navItems = [
    {
      id: 'home' as ActiveTab,
      label: t.navHome,
      icon: 'home'
    },
    {
      id: 'history' as ActiveTab,
      label: t.navHistory,
      icon: 'history'
    },
    {
      id: 'profile' as ActiveTab,
      label: t.navProfile,
      icon: 'person'
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-2xl mx-auto flex justify-around items-center px-6 pb-6 pt-3 bg-[#111318]/80 backdrop-blur-xl rounded-t-[3rem] z-40 shadow-[0_-8px_32px_rgba(0,0,0,0.4)] border-t border-white/10">
      {navItems.map((item) => {
        const isActive = currentTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`flex flex-col items-center justify-center transition-all duration-300 ease-out active:scale-90 ${
              isActive
                ? 'text-[#ffd700] bg-[#ffd700]/10 rounded-full px-5 py-1.5'
                : 'text-[#8a8d91] hover:text-white px-3 py-1'
            }`}
          >
            <span
              className={`material-symbols-outlined text-2xl transition-transform ${
                isActive ? 'fill-1 scale-105' : ''
              }`}
            >
              {item.icon}
            </span>
            <span className="font-body text-[11px] font-semibold uppercase tracking-wider mt-0.5">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

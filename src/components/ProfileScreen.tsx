import React from 'react';
import { UserProfile, Language } from '../types';
import { translations } from '../data/translations';
import { HOTLINKED_ASSETS } from '../data/initialData';

interface ProfileScreenProps {
  user: UserProfile;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenNotificationsModal: () => void;
  onOpenPrivacyModal: () => void;
  onOpenSupportModal: () => void;
  onOpenEditProfileModal: () => void;
  onLogout: () => void;
  onShowToast: (msg: string) => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  user,
  language,
  onLanguageChange,
  onOpenNotificationsModal,
  onOpenPrivacyModal,
  onOpenSupportModal,
  onOpenEditProfileModal,
  onLogout,
  onShowToast
}) => {
  const t = translations[language];

  const handleThemeToggle = () => {
    onShowToast(language === 'ko' ? '골든 오라클은 프리미엄 다크 테마에 최적화되어 있습니다.' : 'Golden Oracle is permanently tuned to the prestigious dark aesthetic.');
  };

  return (
    <main className="pt-20 pb-32 px-5 sm:px-6 max-w-2xl mx-auto space-y-8 min-h-screen">
      {/* Profile Header Section */}
      <section className="relative pt-2">
        <div className="flex items-center gap-5 sm:gap-6 p-1">
          <div className="relative shrink-0">
            <div className="w-22 h-22 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-[#ffd700] p-1 bg-[#1a1c20] shadow-xl">
              <img
                src={user.avatarUrl || HOTLINKED_ASSETS.avatar}
                alt={user.name}
                className="w-full h-full object-cover rounded-full"
                onError={(e) => {
                  // Fallback avatar icon if network fails
                  (e.currentTarget as HTMLElement).style.display = 'none';
                }}
              />
            </div>

            <button
              onClick={onOpenEditProfileModal}
              title={t.editProfile}
              aria-label={t.editProfile}
              className="absolute bottom-0 right-0 gold-gradient text-[#705e00] p-2 rounded-full shadow-lg border-4 border-[#111318] active:scale-90 transition-transform cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm fill-1 block" data-icon="edit">
                edit
              </span>
            </button>
          </div>

          <div className="space-y-1.5 min-w-0">
            <h2 className="font-headline text-2xl sm:text-3xl font-extrabold tracking-tight text-[#e2e2e8] truncate">
              {user.name}
            </h2>
            <p className="font-body text-xs sm:text-sm text-[#999077] font-medium">
              {language === 'ko' ? user.membershipKo : user.membershipEn}
            </p>
            <div className="inline-flex items-center px-3 py-1 bg-[#25a55a]/20 text-[#66dd8b] rounded-full text-[10px] font-bold uppercase tracking-wider border border-[#25a55a]/30">
              {t.verifiedAccount}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-2 gap-3.5">
        <div className="bg-[#1a1c20] p-4 sm:p-5 rounded-2xl space-y-1.5 border-l-4 border-[#ffd700] shadow-md border-t border-r border-b border-white/5">
          <p className="text-[#999077] text-[10px] sm:text-xs font-semibold uppercase tracking-widest font-label">
            {t.totalWins}
          </p>
          <p className="font-headline text-2xl sm:text-3xl font-extrabold text-[#e2e2e8]">
            {user.totalWins}
          </p>
        </div>

        <div className="bg-[#1a1c20] p-4 sm:p-5 rounded-2xl space-y-1.5 border-l-4 border-[#66dd8b] shadow-md border-t border-r border-b border-white/5">
          <p className="text-[#999077] text-[10px] sm:text-xs font-semibold uppercase tracking-widest font-label">
            {t.oracleRank}
          </p>
          <p className="font-headline text-2xl sm:text-3xl font-extrabold text-[#e2e2e8]">
            {user.oracleRank}
          </p>
        </div>
      </div>

      {/* Settings Groups */}
      <div className="space-y-7">
        {/* Preferences Group */}
        <div className="space-y-2.5">
          <h3 className="font-headline text-xs font-bold uppercase tracking-[0.2em] text-[#999077] px-1">
            {t.accountPreferences}
          </h3>

          <div className="bg-[#1a1c20] rounded-2xl overflow-hidden border border-white/5 shadow-md divide-y divide-white/5">
            {/* Notifications Row */}
            <button
              onClick={onOpenNotificationsModal}
              className="w-full flex items-center justify-between p-4 sm:p-5 hover:bg-[#282a2e] transition-colors group active:bg-[#333539] text-left cursor-pointer"
            >
              <div className="flex items-center gap-3.5 sm:gap-4">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#333539] text-[#ffd700]">
                  <span className="material-symbols-outlined" data-icon="notifications">
                    notifications
                  </span>
                </div>
                <span className="font-body font-semibold text-sm sm:text-base text-[#e2e2e8]">
                  {t.notificationPreferences}
                </span>
              </div>
              <span className="material-symbols-outlined text-[#999077] group-hover:translate-x-1 transition-transform">
                chevron_right
              </span>
            </button>

            {/* Theme Row */}
            <button
              onClick={handleThemeToggle}
              className="w-full flex items-center justify-between p-4 sm:p-5 hover:bg-[#282a2e] transition-colors group active:bg-[#333539] text-left cursor-pointer"
            >
              <div className="flex items-center gap-3.5 sm:gap-4">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#333539] text-[#ffd700]">
                  <span className="material-symbols-outlined" data-icon="dark_mode">
                    dark_mode
                  </span>
                </div>
                <div>
                  <span className="font-body font-semibold text-sm sm:text-base text-[#e2e2e8] block">
                    {t.theme}
                  </span>
                  <span className="text-xs text-[#999077]">
                    {t.currentlyDark}
                  </span>
                </div>
              </div>
              <span className="material-symbols-outlined text-[#999077] group-hover:translate-x-1 transition-transform">
                chevron_right
              </span>
            </button>

            {/* Language Row */}
            <button
              onClick={() => {
                const nextLang = language === 'ko' ? 'en' : 'ko';
                onLanguageChange(nextLang);
                onShowToast(nextLang === 'ko' ? '언어가 한국어로 변경되었습니다.' : 'Language changed to English (US).');
              }}
              className="w-full flex items-center justify-between p-4 sm:p-5 hover:bg-[#282a2e] transition-colors group active:bg-[#333539] text-left cursor-pointer"
            >
              <div className="flex items-center gap-3.5 sm:gap-4">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#333539] text-[#ffd700]">
                  <span className="material-symbols-outlined" data-icon="language">
                    language
                  </span>
                </div>
                <div>
                  <span className="font-body font-semibold text-sm sm:text-base text-[#e2e2e8] block">
                    {t.language}
                  </span>
                  <span className="text-xs text-[#999077]">
                    {t.currentLanguageName} (탭하여 전환 / Tap to switch)
                  </span>
                </div>
              </div>
              <span className="material-symbols-outlined text-[#999077] group-hover:translate-x-1 transition-transform">
                chevron_right
              </span>
            </button>
          </div>
        </div>

        {/* Security & Support Group */}
        <div className="space-y-2.5">
          <h3 className="font-headline text-xs font-bold uppercase tracking-[0.2em] text-[#999077] px-1">
            {t.privacyAndSecurity}
          </h3>

          <div className="bg-[#1a1c20] rounded-2xl overflow-hidden border border-white/5 shadow-md divide-y divide-white/5">
            {/* Privacy Policy */}
            <button
              onClick={onOpenPrivacyModal}
              className="w-full flex items-center justify-between p-4 sm:p-5 hover:bg-[#282a2e] transition-colors group active:bg-[#333539] text-left cursor-pointer"
            >
              <div className="flex items-center gap-3.5 sm:gap-4">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#333539] text-[#66dd8b]">
                  <span className="material-symbols-outlined" data-icon="shield">
                    shield
                  </span>
                </div>
                <span className="font-body font-semibold text-sm sm:text-base text-[#e2e2e8]">
                  {t.privacyPolicy}
                </span>
              </div>
              <span className="material-symbols-outlined text-[#999077] group-hover:translate-x-1 transition-transform">
                chevron_right
              </span>
            </button>

            {/* Support Center */}
            <button
              onClick={onOpenSupportModal}
              className="w-full flex items-center justify-between p-4 sm:p-5 hover:bg-[#282a2e] transition-colors group active:bg-[#333539] text-left cursor-pointer"
            >
              <div className="flex items-center gap-3.5 sm:gap-4">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#333539] text-[#66dd8b]">
                  <span className="material-symbols-outlined" data-icon="help">
                    help
                  </span>
                </div>
                <span className="font-body font-semibold text-sm sm:text-base text-[#e2e2e8]">
                  {t.supportCenter}
                </span>
              </div>
              <span className="material-symbols-outlined text-[#999077] group-hover:translate-x-1 transition-transform">
                chevron_right
              </span>
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="pt-2">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2.5 p-4 sm:p-5 rounded-2xl border-2 border-[#ffb4ab]/25 text-[#ffb4ab] hover:bg-[#93000a]/15 transition-colors active:scale-95 duration-200 font-headline font-bold text-base cursor-pointer shadow-md"
          >
            <span className="material-symbols-outlined" data-icon="logout">
              logout
            </span>
            <span>{t.logout}</span>
          </button>

          <p className="text-center text-[10px] text-[#999077] mt-6 font-medium tracking-[0.3em] uppercase opacity-40">
            {t.version}
          </p>
        </div>
      </div>
    </main>
  );
};

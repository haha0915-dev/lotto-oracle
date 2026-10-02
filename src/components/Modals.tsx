import React, { useState } from 'react';
import { Language, NotificationSettings, UserProfile } from '../types';
import { translations } from '../data/translations';

interface ModalsProps {
  activeModal: string | null;
  onClose: () => void;
  language: Language;
  notifications: NotificationSettings;
  onUpdateNotifications: (settings: NotificationSettings) => void;
  user: UserProfile;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  selectedBall: number | null;
  onConfirmClearHistory: () => void;
  onShowToast: (msg: string) => void;
}

export const Modals: React.FC<ModalsProps> = ({
  activeModal,
  onClose,
  language,
  notifications,
  onUpdateNotifications,
  user,
  onUpdateUser,
  selectedBall,
  onConfirmClearHistory,
  onShowToast
}) => {
  const t = translations[language];
  const [userName, setUserName] = useState(user.name);

  if (!activeModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-md bg-[#1a1c20] border border-white/10 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 text-[#e2e2e8] relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label={t.close}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#333539] flex items-center justify-center text-[#d0c6ab] hover:text-white transition-colors"
        >
          <span className="material-symbols-outlined text-base">close</span>
        </button>

        {/* Modal: Notifications */}
        {activeModal === 'notifications' && (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#ffd700]/10 flex items-center justify-center text-[#ffd700]">
                <span className="material-symbols-outlined fill-1">notifications</span>
              </div>
              <h3 className="font-headline text-xl font-bold">
                {t.notificationPreferences}
              </h3>
            </div>

            <div className="space-y-4 pt-1 divide-y divide-white/5">
              <div className="flex items-center justify-between pt-2">
                <div>
                  <p className="font-semibold text-sm">
                    {language === 'ko' ? '추첨 시간 알림' : 'Draw Time Reminders'}
                  </p>
                  <p className="text-xs text-[#999077]">
                    {language === 'ko' ? '추첨 1시간 전 번호 생성 알림' : 'Alert 1 hour before scheduled draw'}
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.drawReminders}
                  onChange={(e) => onUpdateNotifications({ ...notifications, drawReminders: e.target.checked })}
                  className="w-5 h-5 accent-[#ffd700] rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between pt-3">
                <div>
                  <p className="font-semibold text-sm">
                    {language === 'ko' ? '행운의 요일 알림' : 'Lucky Day Forecast Alerts'}
                  </p>
                  <p className="text-xs text-[#999077]">
                    {language === 'ko' ? '목성의 기운이 강한 날 푸시 알림' : 'Push notifications on high fortune resonance'}
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.luckyDayAlerts}
                  onChange={(e) => onUpdateNotifications({ ...notifications, luckyDayAlerts: e.target.checked })}
                  className="w-5 h-5 accent-[#ffd700] rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between pt-3">
                <div>
                  <p className="font-semibold text-sm">
                    {language === 'ko' ? '추출 효과음 및 진동' : 'Sound Effects & Haptics'}
                  </p>
                  <p className="text-xs text-[#999077]">
                    {language === 'ko' ? '번호 생성 시 골든 오브 오디오' : 'Audio ambience when consulting the Oracle'}
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.soundEffects}
                  onChange={(e) => onUpdateNotifications({ ...notifications, soundEffects: e.target.checked })}
                  className="w-5 h-5 accent-[#ffd700] rounded cursor-pointer"
                />
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onShowToast(t.savedChanges);
              }}
              className="w-full gold-gradient text-[#221b00] font-headline font-bold py-3.5 rounded-full shadow-lg mt-2 cursor-pointer"
            >
              {t.close}
            </button>
          </div>
        )}

        {/* Modal: Pro Tip Guide */}
        {activeModal === 'protip' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#ffd700]/10 flex items-center justify-center text-[#ffd700]">
                <span className="material-symbols-outlined fill-1">auto_awesome</span>
              </div>
              <div>
                <h3 className="font-headline text-lg font-bold">
                  {t.proTipDetailTitle}
                </h3>
                <span className="text-xs text-[#66dd8b] font-bold">
                  {t.proTip}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#d0c6ab] leading-relaxed">
              {t.proTipDetailDesc}
            </p>

            <div className="bg-[#111318] p-4 rounded-2xl border border-white/5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#999077]">{language === 'ko' ? '행운 지수 피크' : 'Fortune Index Peak'}</span>
                <span className="text-[#ffd700] font-bold">19:00 ~ 19:45</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#999077]">{language === 'ko' ? '추천 보너스 색상' : 'Resonant Hue'}</span>
                <span className="text-[#66dd8b] font-bold">{language === 'ko' ? '에메랄드 그린' : 'Emerald Green'}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full gold-gradient text-[#221b00] font-headline font-bold py-3.5 rounded-full shadow-lg mt-3 cursor-pointer"
            >
              {t.close}
            </button>
          </div>
        )}

        {/* Modal: Ball Detail */}
        {activeModal === 'ball' && selectedBall !== null && (
          <div className="space-y-4 text-center">
            <div className="mx-auto w-20 h-20 rounded-full bg-[#66dd8b] text-[#003919] flex items-center justify-center font-headline font-extrabold text-3xl shadow-[0_0_25px_rgba(102,221,139,0.4)] border border-[#ffd700]/30">
              {selectedBall.toString().padStart(2, '0')}
            </div>

            <h3 className="font-headline text-xl font-bold">
              {language === 'ko' ? `번호 ${selectedBall}의 행운 오라` : `Aura of Ball #${selectedBall}`}
            </h3>

            <p className="text-xs sm:text-sm text-[#d0c6ab] leading-relaxed px-2">
              {language === 'ko'
                ? `오라클 난수 조화율에 따르면, ${selectedBall}번은 균형과 잠재적 승리의 흐름을 가지고 있습니다. 최근 100회 추첨 빈도와 조화롭게 공명합니다.`
                : `According to Oracle harmonic variance, #${selectedBall} embodies high harmonic equilibrium and positive astrological resonance.`}
            </p>

            <button
              onClick={onClose}
              className="w-full gold-gradient text-[#221b00] font-headline font-bold py-3 rounded-full mt-2 cursor-pointer"
            >
              {t.close}
            </button>
          </div>
        )}

        {/* Modal: Edit Profile */}
        {activeModal === 'editProfile' && (
          <div className="space-y-4">
            <h3 className="font-headline text-xl font-bold">{t.editProfile}</h3>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#999077]" htmlFor="username-input">
                {t.nameLabel}
              </label>
              <input
                id="username-input"
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full bg-[#0c0e12] border border-white/10 rounded-xl p-3 text-[#e2e2e8] text-sm focus:border-[#ffd700] outline-none"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={onClose}
                className="flex-1 bg-[#282a2e] text-white font-semibold py-3 rounded-full cursor-pointer"
              >
                {t.close}
              </button>
              <button
                onClick={() => {
                  if (userName.trim()) {
                    onUpdateUser({ name: userName.trim() });
                    onShowToast(t.savedChanges);
                  }
                  onClose();
                }}
                className="flex-1 gold-gradient text-[#221b00] font-headline font-bold py-3 rounded-full cursor-pointer"
              >
                {t.save}
              </button>
            </div>
          </div>
        )}

        {/* Modal: Privacy Policy */}
        {activeModal === 'privacy' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#66dd8b] text-2xl">shield</span>
              <h3 className="font-headline text-xl font-bold">{t.privacyPolicy}</h3>
            </div>
            <div className="text-xs sm:text-sm text-[#d0c6ab] space-y-2 max-h-60 overflow-y-auto pr-2 leading-relaxed">
              <p>
                {language === 'ko'
                  ? '로또 오라클은 귀하의 개인정보를 소중히 보호합니다. 본 애플리케이션에서 생성된 모든 행운 번호 및 기록은 사용자의 로컬 환경에 안전하게 암호화 보관되며 제3자에게 판매되지 않습니다.'
                  : 'Lotto Oracle honors your digital privacy. All generated fortune sequences and preferences are stored locally in your secure environment and never sold to third parties.'}
              </p>
              <p>
                {language === 'ko'
                  ? '최대 5개의 최근 이력이 유지되며, 새로운 번호 생성 시 가장 오래된 기록부터 안전하게 덮어쓰기 처리됩니다.'
                  : 'Up to 5 recent generations are retained; newer calculations automatically supersede legacy entries to maintain optimal local focus.'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-full gold-gradient text-[#221b00] font-headline font-bold py-3 rounded-full cursor-pointer"
            >
              {t.close}
            </button>
          </div>
        )}

        {/* Modal: Support Center */}
        {activeModal === 'support' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#66dd8b] text-2xl">help</span>
              <h3 className="font-headline text-xl font-bold">{t.supportCenter}</h3>
            </div>
            <div className="text-xs sm:text-sm text-[#d0c6ab] space-y-3 leading-relaxed">
              <div>
                <p className="font-bold text-white">Q. {language === 'ko' ? '오라클 번호는 어떻게 계산되나요?' : 'How are Oracle numbers calculated?'}</p>
                <p className="text-xs text-[#999077]">{language === 'ko' ? '역대 당첨 통계와 무작위 엔트로피 정밀 알고리즘을 결합하여 예측합니다.' : 'By synthesizing historical statistical draw distributions with cryptographic randomness.'}</p>
              </div>
              <div>
                <p className="font-bold text-white">Q. {language === 'ko' ? '고객 문의 이메일' : 'Contact Support'}</p>
                <p className="text-xs text-[#ffd700]">support@oracle-fortune.app</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-full gold-gradient text-[#221b00] font-headline font-bold py-3 rounded-full cursor-pointer"
            >
              {t.close}
            </button>
          </div>
        )}

        {/* Modal: Clear History Confirmation */}
        {activeModal === 'clearConfirm' && (
          <div className="space-y-4 text-center">
            <span className="material-symbols-outlined text-[#ffb4ab] text-4xl">delete_forever</span>
            <h3 className="font-headline text-lg font-bold">{t.clearConfirm}</h3>
            <div className="flex gap-2 pt-2">
              <button
                onClick={onClose}
                className="flex-1 bg-[#282a2e] text-white font-semibold py-3 rounded-full cursor-pointer"
              >
                {t.close}
              </button>
              <button
                onClick={() => {
                  onConfirmClearHistory();
                  onClose();
                }}
                className="flex-1 bg-[#ffb4ab] text-[#690005] font-headline font-bold py-3 rounded-full cursor-pointer"
              >
                {t.clearAll}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

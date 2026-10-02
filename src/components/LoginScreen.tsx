import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/translations';
import { HOTLINKED_ASSETS } from '../data/initialData';

interface LoginScreenProps {
  onEmailAuth: (email: string, password: string, isSignUp: boolean) => Promise<void>;
  onOAuthLogin: (provider: 'google' | 'kakao') => Promise<void>;
  onGuestLogin: () => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onShowToast: (msg: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onEmailAuth,
  onOAuthLogin,
  onGuestLogin,
  language,
  onLanguageChange,
  onShowToast
}) => {
  const t = translations[language];
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const runAuthAction = async (action: () => Promise<void>) => {
    setIsSubmitting(true);
    try {
      await action();
    } catch (error) {
      onShowToast(error instanceof Error ? error.message : 'Authentication failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await runAuthAction(() => onEmailAuth(email, password, isSignUp));
  };

  return (
    <div className="bg-mesh font-body text-[#e2e2e8] min-h-screen flex flex-col justify-between relative selection:bg-[#ffd700]/30 overflow-x-hidden">
      {/* Top Header */}
      <header className="w-full z-50 flex items-center justify-between px-6 h-20 max-w-md mx-auto">
        <div className="flex items-center gap-2">
          <span 
            className="material-symbols-outlined text-[#ffd700] text-3xl fill-1 animate-pulse"
            data-icon="auto_awesome"
          >
            auto_awesome
          </span>
          <span className="font-headline font-extrabold text-2xl tracking-tighter text-[#ffd700]">
            {t.appName}
          </span>
        </div>

        {/* Quick Language Toggle */}
        <button
          type="button"
          onClick={() => onLanguageChange(language === 'ko' ? 'en' : 'ko')}
          className="px-3 py-1 text-xs font-semibold rounded-full bg-[#1e2024] text-[#d0c6ab] hover:text-[#ffd700] border border-white/10 transition-colors"
        >
          {language === 'ko' ? 'English' : '한국어'}
        </button>
      </header>

      {/* Main Form Section */}
      <main className="flex-grow flex flex-col items-center justify-center px-6 pt-4 pb-12 max-w-md mx-auto w-full z-10">
        {/* Hero Section */}
        <div className="w-full text-center mb-8">
          <div className="relative inline-block mb-5">
            <div className="absolute inset-0 bg-[#ffd700]/20 blur-3xl rounded-full" />
            <div className="relative w-24 h-24 bg-[#333539] rounded-full flex items-center justify-center shadow-2xl border border-white/5">
              <span 
                className="material-symbols-outlined text-5xl text-[#ffd700] fill-1"
                data-icon="stars"
              >
                stars
              </span>
            </div>
          </div>
          <h1 className="font-headline text-3xl sm:text-4xl font-extrabold tracking-tight mb-2 text-[#e2e2e8]">
            {isSignUp 
              ? (language === 'ko' ? '새 계정 생성' : 'Create Account') 
              : t.welcomeBack}
          </h1>
          <p className="text-[#d0c6ab] text-sm font-medium">
            {t.welcomeSubtitle}
          </p>
        </div>

        {/* Login Card */}
        <div className="w-full glass-panel p-7 sm:p-8 rounded-3xl shadow-2xl border border-white/5 space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Form Group: Email */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold tracking-wide ml-1 text-[#e2e2e8]/80" htmlFor="email">
                {t.emailAddress}
              </label>
              <div className="relative">
                <span 
                  className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#d0c6ab] text-xl"
                  data-icon="mail"
                >
                  mail
                </span>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.emailPlaceholder}
                  className="w-full bg-[#0c0e12] border-none rounded-full py-3.5 pl-12 pr-6 text-[#e2e2e8] placeholder:text-[#d0c6ab]/40 focus:ring-2 focus:ring-[#ffd700]/40 focus:bg-[#333539] transition-all duration-300 text-sm outline-none"
                  required
                />
              </div>
            </div>

            {/* Form Group: Password */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center ml-1">
                <label className="block text-sm font-semibold tracking-wide text-[#e2e2e8]/80" htmlFor="password">
                  {t.password}
                </label>
                {!isSignUp && (
                  <button
                    type="button"
                      onClick={() => onShowToast(language === 'ko' ? '비밀번호 재설정은 아직 연결되지 않았습니다.' : 'Password reset is not connected yet.')}
                    className="text-xs font-bold text-[#ffd700]/80 hover:text-[#ffd700] transition-colors"
                  >
                    {t.forgotPassword}
                  </button>
                )}
              </div>
              <div className="relative">
                <span 
                  className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#d0c6ab] text-xl"
                  data-icon="lock"
                >
                  lock
                </span>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t.passwordPlaceholder}
                  className="w-full bg-[#0c0e12] border-none rounded-full py-3.5 pl-12 pr-6 text-[#e2e2e8] placeholder:text-[#d0c6ab]/40 focus:ring-2 focus:ring-[#ffd700]/40 focus:bg-[#333539] transition-all duration-300 text-sm outline-none"
                  required
                />
              </div>
            </div>

            {/* Action: Sign In */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full gold-gradient text-[#221b00] font-headline font-bold text-base sm:text-lg py-3.5 rounded-full shadow-lg shadow-[#ffd700]/10 hover:shadow-[#ffd700]/25 active:scale-[0.98] transition-all duration-200 mt-2 cursor-pointer flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span className="inline-block w-5 h-5 border-2 border-[#221b00] border-t-transparent rounded-full animate-spin" />
              ) : isSignUp ? (
                language === 'ko' ? '계정 생성하기' : 'Create Account'
              ) : (
                t.signIn
              )}
            </button>
          </form>

          {/* Social/Alternative Login */}
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#4d4732]/30" />
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold">
              <span className="bg-[#1e2024]/90 px-4 text-[#d0c6ab]/70 rounded-full">
                {t.orContinueWith}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => runAuthAction(() => onOAuthLogin('google'))}
              className="flex items-center justify-center gap-2.5 bg-[#1a1c20] hover:bg-[#282a2e] py-3 rounded-full border border-white/5 transition-colors active:scale-95 cursor-pointer"
            >
              <img
                src={HOTLINKED_ASSETS.googleLogo}
                alt="Google"
                className="w-4 h-4 object-contain"
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = 'none';
                }}
              />
              <span className="text-xs sm:text-sm font-bold">{t.google}</span>
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => runAuthAction(() => onOAuthLogin('kakao'))}
              className="flex items-center justify-center gap-2 bg-[#1a1c20] hover:bg-[#282a2e] py-3 rounded-full border border-white/5 transition-colors active:scale-95 cursor-pointer"
            >
              <MessageCircle size={16} className="text-[#191919]" fill="#FEE500" />
              <span className="text-xs sm:text-sm font-bold">Kakao</span>
            </button>
          </div>

          {/* One-Click Guest Experience */}
          <div className="pt-1 text-center">
            <button
              type="button"
              onClick={onGuestLogin}
              className="text-xs text-[#ffd700] hover:underline font-semibold tracking-wide"
            >
              ✨ {t.guestSignIn}
            </button>
          </div>
        </div>

        {/* Footer Link */}
        <p className="mt-6 text-[#d0c6ab] text-sm font-medium">
          {isSignUp 
            ? (language === 'ko' ? '이미 계정이 있으신가요?' : 'Already have an account?') 
            : t.newToOracle}
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-[#66dd8b] font-bold hover:underline underline-offset-4 ml-1.5 cursor-pointer"
          >
            {isSignUp 
              ? (language === 'ko' ? '로그인하기' : 'Sign In') 
              : t.createAccount}
          </button>
        </p>
      </main>

      {/* Decorative Aura Element */}
      <div className="fixed bottom-0 left-0 w-full h-1/3 pointer-events-none z-0 opacity-40 overflow-hidden">
        <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-[#ffd700]/10 rounded-full blur-[100px]" />
        <div className="absolute top-[20%] right-[-10%] w-72 h-72 bg-[#25a55a]/10 rounded-full blur-[100px]" />
      </div>
    </div>
  );
};

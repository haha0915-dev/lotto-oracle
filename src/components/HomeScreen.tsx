import React, { useState, useEffect } from 'react';
import { LottoSet, Language } from '../types';
import { translations } from '../data/translations';
import { HOTLINKED_ASSETS } from '../data/initialData';

interface HomeScreenProps {
  currentPrediction: LottoSet;
  onGenerateNew: (newSet: LottoSet) => void;
  onSaveCurrentSet: (set: LottoSet) => void;
  language: Language;
  onShowToast: (msg: string) => void;
  onOpenProTip: () => void;
  onSelectBall: (num: number) => void;
  todaysPredictionCount: number;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  currentPrediction,
  onGenerateNew,
  onSaveCurrentSet,
  language,
  onShowToast,
  onOpenProTip,
  onSelectBall,
  todaysPredictionCount
}) => {
  const t = translations[language];
  const [isGenerating, setIsGenerating] = useState(false);
  const [animatedNumbers, setAnimatedNumbers] = useState<number[]>(currentPrediction.numbers);

  // Sync state when currentPrediction updates
  useEffect(() => {
    setAnimatedNumbers(currentPrediction.numbers);
  }, [currentPrediction]);

  // Generate sophisticated lottery numbers (1 to 45 standard Korean/International lotto)
  const handleGenerate = () => {
    if (isGenerating) return;
    setIsGenerating(true);

    // Dynamic rolling numbers animation
    let tickCount = 0;
    const interval = setInterval(() => {
      tickCount++;
      const randomTemps = Array.from({ length: 6 }, () => Math.floor(Math.random() * 45) + 1);
      setAnimatedNumbers(randomTemps);

      if (tickCount >= 10) {
        clearInterval(interval);
        // Generate distinct 6 numbers sorted
        const numSet = new Set<number>();
        while (numSet.size < 6) {
          numSet.add(Math.floor(Math.random() * 45) + 1);
        }
        const sortedNumbers = Array.from(numSet).sort((a, b) => a - b);
        const luckyIndex = Math.floor(Math.random() * 6); // Pick 1 lucky resonance ball
        const luckScore = Math.floor(Math.random() * 9) + 91; // 91% to 99%

        const newSet: LottoSet = {
          id: `pred-${Date.now()}`,
          numbers: sortedNumbers,
          luckyIndex,
          timestamp: Date.now(),
          timeKo: `오늘, ${new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}`,
          timeEn: `Today, ${new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`,
          luckScore,
          drawId: `#${Math.floor(840 + Math.random() * 5)}-${['X', 'Z', 'Ω', 'A', 'S'][Math.floor(Math.random() * 5)]}`
        };

        setAnimatedNumbers(sortedNumbers);
        setIsGenerating(false);
        onGenerateNew(newSet);
        onShowToast(language === 'ko' ? '새로운 행운의 번호가 추출되었습니다!' : 'New lucky prediction generated!');
      }
    }, 75);
  };

  const handleShare = async () => {
    const formatted = animatedNumbers.map(n => n.toString().padStart(2, '0')).join(', ');
    const shareText = `🔮 Lotto Oracle Prediction [${currentPrediction.drawId}]: ${formatted} (Score: ${currentPrediction.luckScore}%)`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Lotto Oracle Prediction',
          text: shareText
        });
        return;
      } catch {
        // fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(shareText);
      onShowToast(t.copiedToClipboard);
    } catch {
      onShowToast(formatted);
    }
  };

  return (
    <main className="pt-20 pb-32 px-5 sm:px-6 max-w-lg mx-auto min-h-screen flex flex-col items-center">
      {/* Hero Section / Branding */}
      <div className="w-full mb-8 text-center pt-2">
        <div className="inline-block px-4 py-1.5 rounded-full bg-[#25a55a]/10 border border-[#66dd8b]/20 mb-3 shadow-[0_0_12px_rgba(102,221,139,0.15)]">
          <span className="text-[#66dd8b] font-label text-[11px] font-bold uppercase tracking-widest">
            {t.oracleSystemActive}
          </span>
        </div>
        <h2 className="font-headline text-3xl sm:text-4xl font-extrabold tracking-tight mb-3 leading-tight text-[#e2e2e8]">
          {t.heroTitlePart1} <br />
          {t.heroTitlePart2}
        </h2>
        <p className="text-[#d0c6ab] font-body text-xs sm:text-sm max-w-[290px] mx-auto leading-relaxed">
          {t.heroSubtitle}
        </p>
      </div>

      {/* Main Interaction Area (Asymmetric Bento) */}
      <div className="w-full space-y-6">
        {/* Generate Action Card */}
        <div className="w-full bg-[#1a1c20] rounded-3xl p-7 flex flex-col items-center justify-center relative overflow-hidden group border border-white/5 shadow-2xl">
          {/* Subtle Ambient Decorative Glows */}
          <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#ffd700]/10 rounded-full blur-3xl group-hover:bg-[#ffd700]/15 transition-colors pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#66dd8b]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Big Golden Orb Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            aria-label={t.generateLuckyNumbers}
            className={`gold-gradient-glow w-44 h-44 sm:w-48 sm:h-48 rounded-full flex flex-col items-center justify-center text-[#705e00] active:scale-90 transition-all duration-300 relative z-10 border-4 border-white/30 cursor-pointer select-none ${
              isGenerating ? 'scale-95 animate-spin' : 'hover:scale-105'
            }`}
          >
            <span
              className="material-symbols-outlined text-4xl sm:text-5xl mb-1 fill-1"
              data-icon="auto_fix_high"
            >
              auto_fix_high
            </span>
            <span className="font-headline font-extrabold text-sm sm:text-base text-center px-6 leading-tight text-[#221b00]">
              {isGenerating ? t.generating : t.generateLuckyNumbers}
            </span>
          </button>
        </div>

        {/* Numbers Display Section */}
        <div className="w-full space-y-5">
          <div className="flex justify-between items-center px-1">
            <h3 className="font-headline text-lg font-bold text-[#e2e2e8]">
              {t.currentPrediction}
            </h3>
            <span className="text-xs font-label text-[#d0c6ab] font-medium tracking-wide">
              {t.drawNumberPrefix}{currentPrediction.drawId}
            </span>
          </div>

          {/* Number Orbs Row */}
          <div className="flex justify-between items-center w-full gap-2 sm:gap-2.5">
            {animatedNumbers.map((num, idx) => {
              const isLucky = idx === (currentPrediction.luckyIndex ?? 2);
              const formattedNum = num.toString().padStart(2, '0');

              return (
                <button
                  key={`${idx}-${num}`}
                  onClick={() => onSelectBall(num)}
                  title={`번호 ${num} 운세 분석`}
                  className={`flex flex-col items-center gap-1 transition-transform active:scale-90 cursor-pointer ${
                    isGenerating ? 'animate-bounce' : 'animate-ball-appear'
                  }`}
                  style={{ animationDelay: `${idx * 60}ms` }}
                >
                  <div
                    className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-headline font-bold text-base sm:text-lg transition-all duration-300 ${
                      isLucky
                        ? 'bg-[#66dd8b] text-[#003919] border border-[#ffd700]/40 shadow-[0_0_18px_rgba(102,221,139,0.45)] ring-2 ring-[#ffd700]/20'
                        : 'bg-[#333539] text-[#e2e2e8] border border-[#4d4732]/30 orb-glow hover:bg-[#66dd8b] hover:text-[#003919]'
                    }`}
                  >
                    <span>{formattedNum}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Action Bar */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => onSaveCurrentSet(currentPrediction)}
              className="flex-1 bg-[#25a55a] hover:bg-[#208f4e] h-13 rounded-full flex items-center justify-center gap-2 text-[#003115] font-headline font-bold text-sm sm:text-base active:scale-95 transition-all shadow-lg shadow-[#25a55a]/20 cursor-pointer"
            >
              <span className="material-symbols-outlined text-xl fill-1" data-icon="bookmark">
                bookmark
              </span>
              <span>{t.saveThisSet}</span>
            </button>

            <button
              onClick={handleShare}
              aria-label={t.share}
              className="w-13 h-13 rounded-full bg-[#282a2e] hover:bg-[#333539] flex items-center justify-center text-[#ffe16d] border border-white/5 active:scale-95 transition-all cursor-pointer shadow-md"
            >
              <span className="material-symbols-outlined text-xl">share</span>
            </button>
          </div>
        </div>

        {/* Stats Bento Grid */}
        <div className="grid grid-cols-2 gap-3.5 mt-6">
          <div className="bg-[#1e2024] rounded-2xl p-4 sm:p-5 border border-white/5 shadow-md">
            <p className="text-[10px] font-label font-bold uppercase tracking-wider text-[#d0c6ab] mb-1">
              {t.luckScore}
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-headline font-extrabold text-[#66dd8b]">
                {currentPrediction.luckScore}%
              </span>
              <span className="text-[10px] sm:text-xs text-[#d0c6ab] font-medium">
                {currentPrediction.luckScore >= 95 ? t.exceptional : t.veryHigh}
              </span>
            </div>
          </div>

          <div className="bg-[#1e2024] rounded-2xl p-4 sm:p-5 border border-white/5 shadow-md">
            <p className="text-[10px] font-label font-bold uppercase tracking-wider text-[#d0c6ab] mb-1">
              {t.todaysPredictions}
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-headline font-extrabold text-[#ffd700]">
                {todaysPredictionCount}
              </span>
              <span className="text-[10px] sm:text-xs text-[#d0c6ab] font-medium">
                {t.today}
              </span>
            </div>
          </div>
        </div>

        {/* Decorative Golden Waves Banner */}
        <div
          onClick={onOpenProTip}
          className="w-full h-36 sm:h-40 rounded-2xl relative overflow-hidden mt-4 group cursor-pointer shadow-lg border border-white/5"
        >
          <img
            src={HOTLINKED_ASSETS.goldenWavesBanner}
            alt="Golden Energy Waves"
            className="w-full h-full object-cover opacity-65 group-hover:scale-105 transition-transform duration-700"
            onError={(e) => {
              // Fallback to elegant CSS gradient if external asset is blocked
              (e.currentTarget as HTMLElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111318] via-black/30 to-transparent" />

          <div className="absolute bottom-3.5 left-4 right-4 flex justify-between items-center">
            <span className="text-xs font-bold text-white/90 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 flex items-center gap-1.5">
              <span>{t.proTip}</span>
            </span>
            <div className="w-7 h-7 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-[#ffd700] border border-white/10">
              <span className="material-symbols-outlined text-sm">info</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

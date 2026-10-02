import React from 'react';
import { LottoSet, Language } from '../../types';
import { translations } from '../../data/translations';

interface HistoryScreenProps {
  history: LottoSet[];
  onDeleteSet: (id: string) => void;
  onSelectSetToCurrent?: (set: LottoSet) => void;
  language: Language;
  onShowToast: (msg: string) => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({
  history,
  onDeleteSet,
  onSelectSetToCurrent,
  language,
  onShowToast
}) => {
  const t = translations[language];

  const handleCopySet = (set: LottoSet) => {
    const formatted = set.numbers.map(n => n.toString().padStart(2, '0')).join(', ');
    navigator.clipboard?.writeText(formatted);
    onShowToast(`${formatted} ${language === 'ko' ? '복사되었습니다.' : 'copied to clipboard.'}`);
  };

  return (
    <main className="pt-20 pb-32 px-5 sm:px-6 max-w-2xl mx-auto min-h-screen">
      {/* Header Section */}
      <div className="mb-8 pt-2">
        <h2 className="font-headline text-3xl sm:text-4xl font-extrabold tracking-tight mb-2 text-[#e2e2e8]">
          {t.history}
        </h2>
        <p className="text-[#d0c6ab] text-xs sm:text-sm font-medium">
          {t.historySubtitle}
        </p>
      </div>

      {/* History List */}
      {history.length === 0 ? (
        <div className="bg-[#1a1c20] rounded-2xl p-10 text-center border border-white/5 space-y-3">
          <span className="material-symbols-outlined text-4xl text-[#ffd700]">
            history_toggle_off
          </span>
          <h3 className="font-headline text-lg font-bold text-[#e2e2e8]">
            {t.emptyHistory}
          </h3>
          <p className="text-xs text-[#d0c6ab] max-w-xs mx-auto">
            {t.emptyHistoryDesc}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((set, index) => {
            // Alternating surface container tone as specified in design constitution
            const isAltTone = index % 2 === 1;
            const containerBg = isAltTone ? 'bg-[#282a2e]' : 'bg-[#1a1c20]';

            return (
              <div
                key={set.id}
                className={`${containerBg} rounded-2xl p-5 sm:p-6 relative overflow-hidden group border border-white/5 transition-all shadow-md`}
              >
                {/* Actions on card: Copy & Delete */}
                <div className="absolute top-3 sm:top-4 right-3 sm:right-4 flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleCopySet(set)}
                    aria-label="Copy set"
                    title={language === 'ko' ? '번호 복사' : 'Copy Set'}
                    className="text-[#d0c6ab] hover:text-[#ffd700] hover:bg-white/5 p-2 rounded-full transition-colors active:scale-90"
                  >
                    <span className="material-symbols-outlined text-lg">content_copy</span>
                  </button>

                  <button
                    onClick={() => {
                      onDeleteSet(set.id);
                      onShowToast(t.setDeleted);
                    }}
                    aria-label={t.deleteSet}
                    title={t.deleteSet}
                    className="text-[#ffb4ab] hover:bg-[#93000a]/20 p-2 rounded-full transition-colors active:scale-90"
                  >
                    <span className="material-symbols-outlined text-lg fill-1">delete</span>
                  </button>
                </div>

                <div className="flex flex-col gap-4">
                  {/* Timestamp & Tag Header */}
                  <div className="flex items-center justify-between pr-20">
                    <div className="flex items-center gap-2 text-[#d0c6ab]">
                      <span className="material-symbols-outlined text-sm">schedule</span>
                      <span className="text-xs font-semibold uppercase tracking-wider font-label">
                        {language === 'ko' ? set.timeKo : set.timeEn}
                      </span>
                    </div>
                  </div>

                  {/* Balls Row */}
                  <div className="flex flex-wrap gap-2 sm:gap-3 items-center">
                    {set.numbers.map((num, ballIdx) => {
                      const isHighlighted = ballIdx === (set.luckyIndex ?? -1);
                      const formatted = num.toString().padStart(2, '0');

                      return (
                        <div
                          key={ballIdx}
                          onClick={() => onSelectSetToCurrent && onSelectSetToCurrent(set)}
                          className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-headline font-bold text-base sm:text-lg shadow-inner select-none cursor-pointer transition-transform hover:scale-105 active:scale-95 ${
                            isHighlighted
                              ? 'bg-[#25a55a] text-[#003115] ring-2 ring-[#ffd700]/30 shadow-[0_0_12px_rgba(102,221,139,0.3)]'
                              : 'bg-[#333539] text-[#ffe16d]'
                          }`}
                        >
                          {formatted}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Storage Limit Reached Info Box */}
      <div className="mt-8 p-5 sm:p-6 glass-card rounded-2xl flex items-start gap-4 border border-white/5 shadow-xl">
        <span
          className="material-symbols-outlined text-[#ffd700] text-2xl shrink-0 mt-0.5"
          data-icon="info"
        >
          info
        </span>
        <div className="space-y-1">
          <p className="text-sm font-semibold text-[#fff6df]">
            {t.storageLimitReached}
          </p>
          <p className="text-xs text-[#d0c6ab] leading-relaxed">
            {t.storageLimitDesc}
          </p>
        </div>
      </div>
    </main>
  );
};

import React, { useState } from 'react';
import { X, Sparkles, MessageCircle } from 'lucide-react';

interface MascotGuideProps {
  message: string;
  onOpenTutorial?: () => void;
}

export const MascotGuide: React.FC<MascotGuideProps> = ({
  message,
  onOpenTutorial,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) {
    return (
      <button
        type="button"
        data-testid="mascot-open-button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-5 right-5 z-40 w-12 h-12 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/40 hover:scale-105 active:scale-95 transition-all text-xl"
        title="Buka Maskot Si Siaga"
      >
        🐵
      </button>
    );
  }

  return (
    <div
      data-testid="mascot-guide-container"
      className="fixed bottom-4 right-4 z-40 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-5 duration-300"
    >
      {/* Mascot Header */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white">
        <div className="flex items-center gap-1.5 font-heading font-extrabold text-xs tracking-wide">
          <span className="text-base">🐵</span>
          <span>Si Siaga — Maskot Panduan</span>
        </div>
        <button
          type="button"
          data-testid="mascot-close-button"
          onClick={() => setIsOpen(false)}
          className="text-white/80 hover:text-white hover:bg-white/20 p-1 rounded-lg transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Mascot Body & Speech Bubble */}
      <div className="p-3.5 flex items-center gap-3">
        {/* Animated Mascot Illustration SVG */}
        <div className="w-16 h-16 shrink-0 flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full select-none">
            {/* Tail */}
            <path
              className="mascot-tail"
              d="M30 65 Q10 75 18 85 Q26 95 34 78"
              fill="none"
              stroke="#D97724"
              strokeWidth="5"
              strokeLinecap="round"
            />
            {/* Body */}
            <ellipse cx="50" cy="62" rx="20" ry="22" fill="#EA580C" />
            <ellipse cx="50" cy="64" rx="13" ry="14" fill="#FDBA74" />

            {/* Head */}
            <circle cx="50" cy="36" r="19" fill="#EA580C" />
            {/* Ears */}
            <circle cx="33" cy="28" r="8" fill="#EA580C" />
            <circle cx="33" cy="28" r="5" fill="#FDBA74" />
            <circle cx="67" cy="28" r="8" fill="#EA580C" />
            <circle cx="67" cy="28" r="5" fill="#FDBA74" />

            {/* Face Mask */}
            <ellipse cx="50" cy="38" rx="14" ry="12" fill="#FDBA74" />

            {/* Eyes */}
            <circle cx="44" cy="34" r="3" fill="#1E293B" />
            <circle cx="56" cy="34" r="3" fill="#1E293B" />
            <circle cx="45" cy="33" r="1" fill="#FFFFFF" />
            <circle cx="57" cy="33" r="1" fill="#FFFFFF" />

            {/* Nose & Smile */}
            <ellipse cx="50" cy="39" rx="2" ry="1.5" fill="#7C2D12" />
            <path
              d="M46 42 Q50 46 54 42"
              fill="none"
              stroke="#7C2D12"
              strokeWidth="1.8"
              strokeLinecap="round"
            />

            {/* Rescuer Helmet */}
            <path
              d="M32 30 Q50 14 68 30 Q68 22 50 16 Q32 22 32 30 Z"
              fill="#FBBF24"
            />
            <circle cx="50" cy="22" r="3" fill="#EF4444" />
          </svg>
        </div>

        {/* Message */}
        <div className="flex-1 min-w-0">
          <p
            data-testid="mascot-speech-text"
            className="text-xs text-slate-700 leading-snug font-medium"
          >
            {message}
          </p>
          {onOpenTutorial && (
            <button
              type="button"
              onClick={onOpenTutorial}
              className="mt-1.5 text-[11px] font-bold text-amber-700 hover:text-amber-800 hover:underline flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-amber-500" />
              Buka Tutorial Bermain
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

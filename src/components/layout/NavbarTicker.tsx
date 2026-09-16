import React, { useState, useEffect } from 'react';
import { Activity, ShieldCheck, TrendingUp, Sparkles, MapPin, Satellite } from 'lucide-react';
import { useLocationContext } from '../../context/LocationContext';
import { RegionGpsSelector } from './RegionGpsSelector';

interface NavbarTickerProps {
  onOpenAiCopilot: () => void;
  onOpenTracker: () => void;
  currentLang: 'EN' | 'HI' | 'MR';
  onSelectLang: (lang: 'EN' | 'HI' | 'MR') => void;
}

export const NavbarTicker: React.FC<NavbarTickerProps> = ({
  onOpenAiCopilot,
  onOpenTracker,
  currentLang,
  onSelectLang,
}) => {
  const { currentData } = useLocationContext();
  const [tickerIndex, setTickerIndex] = useState(0);

  const mandiList = currentData.mandiTicker || [];

  useEffect(() => {
    setTickerIndex(0);
  }, [currentData.stateCode]);

  useEffect(() => {
    if (mandiList.length === 0) return;
    const interval = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % mandiList.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [mandiList.length]);

  const activeItem = mandiList[tickerIndex] || mandiList[0];

  return (
    <div className="bg-stone-950 text-stone-200 border-b border-stone-800 text-[11px] py-1.5 px-3 sm:px-4 select-none relative z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-4">
        {/* Left: Region & GPS Selector (Prominently displaying Madhya Pradesh or GPS detected location) */}
        <div className="flex items-center gap-2 shrink-0">
          <RegionGpsSelector compact={true} />
          <span className="text-stone-600 hidden xl:inline">•</span>
          <span className="font-mono text-emerald-400 font-semibold uppercase tracking-wider text-[10px] hidden xl:inline">
            Telemetry Synced
          </span>
        </div>

        {/* Center: Live Mandi Commodity Ticker dynamically tied to the active state */}
        {activeItem && (
          <div className="flex-1 flex items-center justify-center overflow-hidden">
            <div className="flex items-center gap-2 font-mono text-[11px] bg-stone-900/95 px-3 py-0.5 rounded-full border border-stone-800 shadow-xs">
              <TrendingUp className="w-3 h-3 text-amber-400 shrink-0" />
              <span className="text-stone-400 text-[10px] uppercase font-sans hidden md:inline">
                {currentData.stateCode} Mandi Index:
              </span>
              <span className="font-bold text-white truncate max-w-[130px] sm:max-w-none">
                {activeItem.commodity}
              </span>
              <span className="text-stone-400 text-[10px] hidden sm:inline">({activeItem.mandi})</span>
              <span className="font-bold text-emerald-400">{activeItem.price}</span>
              <span
                className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                  activeItem.isUp ? 'text-emerald-300 bg-emerald-950/80 border border-emerald-800/60' : 'text-amber-300 bg-amber-950/80 border border-amber-800/60'
                }`}
              >
                {activeItem.change}
              </span>
            </div>
          </div>
        )}

        {/* Right: Quick Tools (AI Assistant + Quick Track + Language) */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenAiCopilot}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700/60 hover:bg-emerald-900 transition-colors text-[10px] font-semibold"
            title="Open Agri-AI Kisan Intelligence Assistant"
          >
            <Sparkles className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span className="hidden sm:inline">Kisan AI</span>
            <span className="sm:hidden">AI</span>
          </button>

          <button
            onClick={onOpenTracker}
            className="hidden md:flex items-center gap-1 text-stone-300 hover:text-white px-2.5 py-1 rounded-full bg-stone-900 border border-stone-800 hover:border-stone-700 transition-colors text-[10px]"
          >
            <ShieldCheck className="w-3 h-3 text-amber-400" />
            <span>Trace Batch</span>
          </button>

          {/* Language Selector Pills */}
          <div className="flex items-center bg-stone-900 rounded-full p-0.5 border border-stone-800 text-[10px] font-medium font-mono">
            <button
              onClick={() => onSelectLang('EN')}
              className={`px-1.5 py-0.5 rounded-full transition-colors ${
                currentLang === 'EN' ? 'bg-emerald-800 text-white font-bold' : 'text-stone-400 hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => onSelectLang('HI')}
              className={`px-1.5 py-0.5 rounded-full transition-colors ${
                currentLang === 'HI' ? 'bg-emerald-800 text-white font-bold' : 'text-stone-400 hover:text-white'
              }`}
            >
              हिन्दी
            </button>
            <button
              onClick={() => onSelectLang('MR')}
              className={`px-1.5 py-0.5 rounded-full transition-colors ${
                currentLang === 'MR' ? 'bg-emerald-800 text-white font-bold' : 'text-stone-400 hover:text-white'
              }`}
            >
              मराठी
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavbarTicker;

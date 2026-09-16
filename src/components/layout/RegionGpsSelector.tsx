import React, { useState } from 'react';
import { useLocationContext, REGIONS_DATA } from '../../context/LocationContext';
import { MapPin, Navigation, Check, Globe, RefreshCw, X, Radio, ChevronDown, Satellite } from 'lucide-react';

interface RegionGpsSelectorProps {
  compact?: boolean;
}

export const RegionGpsSelector: React.FC<RegionGpsSelectorProps> = ({ compact = false }) => {
  const {
    activeState,
    currentData,
    isGpsActive,
    gpsStatusMessage,
    detectedCoords,
    setState,
    detectLocationViaGps,
  } = useLocationContext();

  const [isOpen, setIsOpen] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);

  const handleGpsDetect = async () => {
    setIsDetecting(true);
    await detectLocationViaGps();
    setIsDetecting(false);
  };

  const handleSelectState = (stateCode: 'MP' | 'MH' | 'PB' | 'GJ' | 'UP') => {
    setState(stateCode);
    setIsOpen(false);
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full transition-all border text-left cursor-pointer group ${
          isGpsActive
            ? 'bg-sky-950/80 border-sky-500/60 text-sky-200 hover:bg-sky-900/80'
            : 'bg-emerald-950/80 border-emerald-500/50 text-emerald-200 hover:bg-emerald-900/80'
        } ${compact ? 'text-[10px]' : 'text-xs'}`}
        title="Change Agro-Grid Region or Auto-Detect via GPS"
      >
        <span className="relative flex h-2 w-2">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              isGpsActive ? 'bg-sky-400' : 'bg-emerald-400'
            }`}
          />
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${
              isGpsActive ? 'bg-sky-500' : 'bg-emerald-500'
            }`}
          />
        </span>

        <MapPin className={`w-3 h-3 ${isGpsActive ? 'text-sky-400' : 'text-emerald-400'} shrink-0`} />

        <div className="flex items-center gap-1">
          <span className="font-bold text-white tracking-tight">
            {currentData.stateName}
          </span>
          <span className="text-[10px] text-stone-400 hidden lg:inline font-mono">
            ({currentData.stateCode})
          </span>
        </div>

        {isGpsActive && (
          <span className="px-1.5 py-0.2 rounded text-[9px] bg-sky-900 text-sky-200 font-mono font-bold hidden sm:inline">
            GPS LIVE
          </span>
        )}

        <ChevronDown className="w-3 h-3 text-stone-400 group-hover:text-stone-200 transition-transform" />
      </button>

      {/* Regional Selection & GPS Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div
            className="bg-stone-900 border border-stone-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl relative text-white"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-stone-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-950/80 border border-emerald-700/60 text-emerald-400 flex items-center justify-center">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-heading text-white">
                    Select Agro-Grid & Regional Location
                  </h3>
                  <p className="text-xs text-stone-400">
                    Currently Active: <strong className="text-emerald-400">{currentData.stateName}</strong> (Default)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* GPS Auto-Detect Banner */}
            <div className="my-5 p-4 rounded-2xl bg-stone-950 border border-stone-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-sky-950 text-sky-400 border border-sky-800 flex items-center justify-center shrink-0">
                  <Satellite className={`w-4 h-4 ${isDetecting ? 'animate-spin' : ''}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">
                      Satellite Geolocation
                    </span>
                    {isGpsActive && (
                      <span className="text-[10px] font-mono text-sky-300 bg-sky-950 px-2 py-0.5 rounded border border-sky-800">
                        Signal Locked
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-stone-400 font-mono mt-0.5">
                    {gpsStatusMessage}
                  </p>
                  {detectedCoords && (
                    <span className="text-[10px] text-emerald-400 font-mono block mt-0.5">
                      Coordinates: {detectedCoords.lat.toFixed(4)}° N, {detectedCoords.lng.toFixed(4)}° E
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={handleGpsDetect}
                disabled={isDetecting}
                className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:bg-sky-800 text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-md shrink-0 w-full sm:w-auto justify-center"
              >
                <Navigation className={`w-3.5 h-3.5 ${isDetecting ? 'animate-spin' : ''}`} />
                <span>{isDetecting ? 'Detecting...' : 'Use Live GPS'}</span>
              </button>
            </div>

            {/* Supported Regional Agro Grids */}
            <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 font-mono block">
                Available Agricultural Hubs
              </span>

              {Object.values(REGIONS_DATA).map((region) => {
                const isSelected = activeState === region.stateCode;

                return (
                  <div
                    key={region.stateCode}
                    onClick={() => handleSelectState(region.stateCode as any)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-emerald-950/70 border-emerald-500 shadow-md shadow-emerald-950/60'
                        : 'bg-stone-950/60 border-stone-800 hover:bg-stone-850 hover:border-stone-700'
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-mono font-bold text-xs mt-0.5 ${
                          isSelected
                            ? 'bg-emerald-900 text-emerald-200 border border-emerald-700'
                            : 'bg-stone-800 text-stone-400 border border-stone-700'
                        }`}
                      >
                        {region.stateCode}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold font-heading text-white">
                            {region.stateName}
                          </h4>
                          <span className="text-xs text-stone-400 font-hindi">
                            ({region.stateHindi})
                          </span>
                          {region.stateCode === 'MP' && (
                            <span className="text-[10px] font-mono font-bold bg-amber-950 text-amber-300 px-2 py-0.5 rounded border border-amber-800/80">
                              User Location
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-stone-400 truncate mt-0.5">
                          {region.agroZone}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-stone-400">
                          <span className="text-emerald-400 font-medium">
                            Key Crops: {region.mandiTicker.slice(0, 2).map((m) => m.commodity).join(', ')}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center">
                      {isSelected ? (
                        <div className="w-6 h-6 rounded-full bg-emerald-500 text-stone-950 flex items-center justify-center font-bold">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-stone-700" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Modal Footer Note */}
            <div className="mt-5 pt-4 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400 font-mono">
              <span>All mandi rates, reefer routes & weather update instantly.</span>
              <button
                onClick={() => setIsOpen(false)}
                className="text-stone-300 hover:text-white underline font-sans"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RegionGpsSelector;

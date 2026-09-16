import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ShieldCheck, QrCode, ArrowRight, Truck, CheckCircle2, AlertCircle } from 'lucide-react';
import { demoTraceabilityRecord } from '../../data/demoData';

interface NavbarTrackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NavbarTrackModal: React.FC<NavbarTrackModalProps> = ({ isOpen, onClose }) => {
  const [batchIdInput, setBatchIdInput] = useState('AGRI-2026-00421');
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = batchIdInput.trim() || 'AGRI-2026-00421';
    onClose();
    navigate(`/verify/${cleanId}`);
  };

  const isDemoMatch = batchIdInput.trim().toUpperCase() === demoTraceabilityRecord.batchId.toUpperCase();

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-stone-950/70 backdrop-blur-sm animate-in fade-in duration-150">
      {/* Background click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-stone-900 border border-stone-750 text-white rounded-3xl shadow-2xl overflow-hidden z-10">
        {/* Header */}
        <div className="px-6 py-4 bg-stone-950 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-950 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-heading text-white">Instant Agri-Traceability Inspector</h3>
              <p className="text-[11px] text-stone-400">Verify agricultural batch provenance & cold-chain custody</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {/* Search Input Form */}
          <form onSubmit={handleTrackSubmit} className="space-y-3">
            <label className="text-xs font-semibold text-stone-300 block">
              Enter Batch ID or Scan QR Code
            </label>
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                value={batchIdInput}
                onChange={(e) => setBatchIdInput(e.target.value)}
                placeholder="e.g. AGRI-2026-00421"
                className="w-full pl-10 pr-24 py-3 rounded-2xl bg-stone-950 border border-stone-700 text-white placeholder-stone-500 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                autoFocus
              />
              <button
                type="submit"
                className="absolute right-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-1 shadow-sm"
              >
                <span>Verify</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* Preset Quick-Fill Chips */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-stone-400 text-[11px]">Pilot Batches:</span>
            <button
              onClick={() => setBatchIdInput('AGRI-2026-00421')}
              className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-750 text-emerald-400 font-mono text-[11px] border border-stone-700 transition-colors"
            >
              AGRI-2026-00421 (Grapes)
            </button>
            <button
              onClick={() => setBatchIdInput('AGRI-2026-00422')}
              className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-750 text-amber-400 font-mono text-[11px] border border-stone-700 transition-colors"
            >
              AGRI-2026-00422 (Onions)
            </button>
          </div>

          {/* Instant Inspection Preview Card */}
          {isDemoMatch ? (
            <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-3">
              <div className="flex items-center justify-between pb-2.5 border-b border-stone-850">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold text-white font-mono">{demoTraceabilityRecord.batchId}</span>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800">
                  <CheckCircle2 className="w-3 h-3" /> VERIFIED ON-CHAIN
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div>
                  <span className="text-[10px] text-stone-500 uppercase block">Commodity</span>
                  <span className="font-semibold text-stone-200">{demoTraceabilityRecord.crop}</span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-500 uppercase block">Origin Farm</span>
                  <span className="font-semibold text-stone-200">{demoTraceabilityRecord.farmer}</span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-500 uppercase block">Quality Grade</span>
                  <span className="font-semibold text-emerald-400 font-mono">{demoTraceabilityRecord.qualityGrade}</span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-500 uppercase block">Ledger Block</span>
                  <span className="font-semibold text-stone-200 font-mono">#{demoTraceabilityRecord.blockNumber}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  navigate(`/verify/${demoTraceabilityRecord.batchId}`);
                }}
                className="w-full py-2.5 mt-1 bg-stone-800 hover:bg-stone-750 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border border-stone-700 transition-colors"
              >
                <span>View Full Immutable Audit Ledger</span>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
              </button>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 text-center py-5">
              <AlertCircle className="w-6 h-6 text-amber-400 mx-auto mb-2" />
              <p className="text-xs text-stone-300">
                Ready to verify batch <span className="font-mono text-white font-bold">{batchIdInput}</span>
              </p>
              <button
                onClick={handleTrackSubmit}
                className="mt-3 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl inline-flex items-center gap-1.5"
              >
                <span>Lookup on Ledger</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Link } from 'react-router-dom';
import { demoTraceabilityRecord } from '../../data/demoData';
import { CheckCircle2, QrCode, Shield, ArrowRight, ExternalLink, Link2, FileCode2 } from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

export const BlockchainTraceabilitySection: React.FC = () => {
  const visualSteps = [
    { name: 'Farm', emoji: '🌾', hash: '0x1a8f...645', detail: 'Harvest Logged' },
    { name: 'Storage', emoji: '📦', hash: '0x2b90...56a', detail: 'Pre-cooled 2.4°C' },
    { name: 'Monitoring', emoji: '🌡️', hash: '0x3c01...67b', detail: 'Zero Breaches' },
    { name: 'Transport', emoji: '🚚', hash: '0x4d12...78c', detail: 'Reefer En Route' },
    { name: 'Market', emoji: '🏪', hash: '0x5e23...89d', detail: 'Mandi Verified' },
  ];

  return (
    <section id="traceability" className="py-20 lg:py-28 bg-stone-900 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-700/80 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            Module: Verifiable Provenance & QR
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight">
            Every journey leaves a verifiable trail.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-stone-300 leading-relaxed">
            By recording state transitions as cryptographic checkpoints, buyers and consumers can verify produce provenance with a single camera scan.
          </p>
        </div>

        {/* Traceability Spotlight Card */}
        <div className="max-w-5xl mx-auto bg-stone-850 rounded-3xl border border-stone-700 p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Batch Details & Visual Timeline */}
            <div className="lg:col-span-8 space-y-6">
              {/* Batch Metadata Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-stone-750">
                <div>
                  <span className="text-xs font-mono text-stone-400 block">Batch ID:</span>
                  <span className="text-xl sm:text-2xl font-bold font-mono text-emerald-400 tracking-wider">
                    {demoTraceabilityRecord.batchId}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-stone-400">Status:</span>
                  <Badge variant="emerald" size="md" className="bg-emerald-950 border-emerald-500 text-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mr-1" />
                    VERIFIED ✓
                  </Badge>
                </div>
              </div>

              {/* Crop & Origin Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-stone-900/90 p-4 rounded-2xl border border-stone-800">
                <div>
                  <span className="text-stone-500 block">Produce Variety</span>
                  <span className="font-semibold text-stone-200">{demoTraceabilityRecord.crop}</span>
                </div>
                <div>
                  <span className="text-stone-500 block">Farmer / Origin</span>
                  <span className="font-semibold text-stone-200">{demoTraceabilityRecord.farmer} (Nashik)</span>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <span className="text-stone-500 block">Quantity & Grade</span>
                  <span className="font-semibold text-emerald-400">
                    {demoTraceabilityRecord.quantityKg} kg • {demoTraceabilityRecord.qualityGrade}
                  </span>
                </div>
              </div>

              {/* 5-Step Visual Chain: Farm -> Storage -> Monitoring -> Transport -> Market */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-stone-400 block mb-3">
                  Verifiable Checkpoint Chain
                </span>

                <div className="grid grid-cols-5 gap-2 text-center">
                  {visualSteps.map((step, idx) => (
                    <div
                      key={step.name}
                      className="p-2 sm:p-3 rounded-xl bg-stone-900/90 border border-stone-750 flex flex-col items-center justify-between"
                    >
                      <span className="text-xl sm:text-2xl mb-1">{step.emoji}</span>
                      <span className="text-xs font-bold text-white uppercase">{step.name}</span>
                      <span className="text-[10px] text-stone-400 truncate w-full mt-1 hidden sm:block">
                        {step.detail}
                      </span>
                      <span className="text-[9px] font-mono text-emerald-400/90 mt-1 block">
                        {step.hash}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Architecture Principle Note */}
              <div className="p-3.5 rounded-xl bg-stone-900/90 border border-stone-800 flex items-start gap-3 text-xs text-stone-400">
                <Link2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong className="text-stone-200">Architecture Discipline:</strong> Do not put the complete database on blockchain.
                  Only cryptographic hash attestations, tamper-evident checkpoint timestamps, and temperature compliance proofs are stored on-chain.
                </p>
              </div>
            </div>

            {/* Right: QR Code Visual & Verification Trigger */}
            <div className="lg:col-span-4 flex flex-col items-center text-center p-6 rounded-2xl bg-stone-900 border border-stone-750">
              {/* QR Code Container */}
              <div className="p-4 bg-white rounded-2xl shadow-xl border border-stone-300 mb-4 inline-block">
                {/* Clean SVG QR Representation */}
                <svg
                  className="w-40 h-40"
                  viewBox="0 0 100 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Outer corner markers */}
                  <rect x="5" y="5" width="26" height="26" fill="#1c1917" rx="3" />
                  <rect x="9" y="9" width="18" height="18" fill="#ffffff" rx="2" />
                  <rect x="13" y="13" width="10" height="10" fill="#047857" rx="1" />

                  <rect x="69" y="5" width="26" height="26" fill="#1c1917" rx="3" />
                  <rect x="73" y="9" width="18" height="18" fill="#ffffff" rx="2" />
                  <rect x="77" y="13" width="10" height="10" fill="#047857" rx="1" />

                  <rect x="5" y="69" width="26" height="26" fill="#1c1917" rx="3" />
                  <rect x="9" y="73" width="18" height="18" fill="#ffffff" rx="2" />
                  <rect x="13" y="77" width="10" height="10" fill="#047857" rx="1" />

                  {/* Internal data matrix blocks */}
                  <rect x="36" y="8" width="6" height="6" fill="#1c1917" />
                  <rect x="46" y="8" width="8" height="6" fill="#1c1917" />
                  <rect x="58" y="12" width="6" height="6" fill="#047857" />
                  <rect x="36" y="20" width="8" height="8" fill="#1c1917" />
                  <rect x="48" y="24" width="6" height="6" fill="#1c1917" />

                  <rect x="8" y="36" width="6" height="8" fill="#1c1917" />
                  <rect x="18" y="40" width="8" height="6" fill="#047857" />
                  <rect x="8" y="50" width="6" height="6" fill="#1c1917" />
                  <rect x="18" y="52" width="6" height="8" fill="#1c1917" />

                  {/* Center wheat emblem badge */}
                  <circle cx="50" cy="50" r="14" fill="#065f46" />
                  <text
                    x="50"
                    y="55"
                    fontSize="13"
                    textAnchor="middle"
                    fill="#ffffff"
                    fontFamily="sans-serif"
                    fontWeight="bold"
                  >
                    🌾
                  </text>

                  {/* Lower data blocks */}
                  <rect x="36" y="68" width="8" height="6" fill="#1c1917" />
                  <rect x="48" y="72" width="6" height="8" fill="#047857" />
                  <rect x="38" y="82" width="6" height="6" fill="#1c1917" />
                  <rect x="68" y="40" width="6" height="8" fill="#1c1917" />
                  <rect x="78" y="38" width="8" height="6" fill="#1c1917" />
                  <rect x="68" y="52" width="8" height="8" fill="#047857" />
                  <rect x="80" y="54" width="6" height="6" fill="#1c1917" />
                  <rect x="68" y="68" width="6" height="6" fill="#1c1917" />
                  <rect x="78" y="70" width="8" height="6" fill="#1c1917" />
                  <rect x="72" y="82" width="8" height="8" fill="#1c1917" />
                  <rect x="84" y="82" width="6" height="6" fill="#047857" />
                </svg>
              </div>

              <span className="text-xs font-bold text-white mb-1">
                Scan with any Smartphone
              </span>
              <p className="text-[11px] text-stone-400 mb-4 max-w-xs">
                Inspect live immutable audit history, sensor readings, and harvest coordinates.
              </p>

              <Link to={`/verify/${demoTraceabilityRecord.batchId}`} className="w-full">
                <Button
                  variant="primary"
                  size="md"
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
                  rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
                >
                  Open Batch Verification
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlockchainTraceabilitySection;

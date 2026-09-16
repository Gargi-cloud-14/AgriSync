import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import heroBgImage from '../../assets/images/agri_hero_bg_1789588101160.jpg';
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Warehouse,
  Truck,
  Store,
  Sprout,
  Cpu,
  Info,
  Clock,
  Sparkles,
  Layers,
  MapPin,
  Satellite,
  Navigation,
} from 'lucide-react';
import { Button } from '../common/Button';
import { useLocationContext } from '../../context/LocationContext';
import { RegionGpsSelector } from '../layout/RegionGpsSelector';

interface PipelineNode {
  id: string;
  name: string;
  label: string;
  sublabel: string;
  metric: string;
  location: string;
  status: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  borderActive: string;
  bgActive: string;
}

export const HeroSection: React.FC = () => {
  const [activeStage, setActiveStage] = useState<number>(0);
  const shouldReduceMotion = useReducedMotion();
  const { currentData, isGpsActive } = useLocationContext();

  const pipelineStages: PipelineNode[] = [
    {
      id: 'farm',
      name: 'FARM',
      label: 'Harvest Logged',
      sublabel: 'Field Origin',
      metric: currentData.traceability.crop,
      location: `${currentData.traceability.farmName}, ${currentData.stateName}`,
      status: 'Harvest Verified',
      icon: Sprout,
      accentColor: 'text-emerald-400',
      borderActive: 'border-emerald-500',
      bgActive: 'bg-emerald-950/70',
    },
    {
      id: 'storage',
      name: 'STORAGE',
      label: 'Cold Pre-Cooling',
      sublabel: 'Capacity Allocated',
      metric: `Target: ${currentData.iot.targetTempRange} / ${currentData.iot.targetHumidityRange}`,
      location: currentData.iot.facilityName,
      status: 'Intake Accepted',
      icon: Warehouse,
      accentColor: 'text-sky-400',
      borderActive: 'border-sky-500',
      bgActive: 'bg-sky-950/70',
    },
    {
      id: 'monitoring',
      name: 'MONITORING',
      label: 'IoT Telemetry',
      sublabel: 'Continuous Sensing',
      metric: `${currentData.iot.storageUnitId}: ${currentData.iot.temperature}°C / ${currentData.iot.humidity}% RH`,
      location: `${currentData.iot.facilityName} Sensor Array`,
      status: currentData.iot.storageStatus,
      icon: Cpu,
      accentColor: 'text-teal-400',
      borderActive: 'border-teal-500',
      bgActive: 'bg-teal-950/70',
    },
    {
      id: 'transport',
      name: 'TRANSPORT',
      label: 'Smart Transit',
      sublabel: 'Cold Reefer Freight',
      metric: `${currentData.transport.vehicleNumber} (${currentData.transport.cargoTempC}°C Cargo)`,
      location: `${currentData.transport.origin} → ${currentData.transport.destination}`,
      status: 'En Route',
      icon: Truck,
      accentColor: 'text-amber-400',
      borderActive: 'border-amber-500',
      bgActive: 'bg-amber-950/70',
    },
    {
      id: 'traceability',
      name: 'TRACEABILITY',
      label: 'Cryptographic Trail',
      sublabel: 'Batch Verification',
      metric: `Batch ${currentData.traceability.batchId}`,
      location: 'AgriSync Decentralized Audit Ledger',
      status: 'Proof Sealed',
      icon: ShieldCheck,
      accentColor: 'text-emerald-400',
      borderActive: 'border-emerald-500',
      bgActive: 'bg-emerald-950/70',
    },
    {
      id: 'market',
      name: 'MARKET',
      label: 'Mandi Terminal',
      sublabel: 'Direct Settlement',
      metric: currentData.transport.destination,
      location: 'Wholesale APMC Terminal Gate #4',
      status: 'Ready for Settlement',
      icon: Store,
      accentColor: 'text-amber-300',
      borderActive: 'border-amber-500',
      bgActive: 'bg-amber-950/70',
    },
  ];

  return (
    <section
      id="hero"
      className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32 bg-stone-950 text-white"
    >
      {/* Real Farmer + Industry Level Agricultural AI Background - Prominently Visible */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
        <img
          src={heroBgImage}
          alt="Authentic Indian agricultural landscape with farmer, modern cold chain, solar arrays, and reefer transport"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center scale-100 transform opacity-85 sm:opacity-95 filter contrast-110 brightness-95"
        />
        {/* Calibrated atmospheric gradient overlays to preserve pristine contrast for typography while keeping the farmer, field & cold-chain infrastructure clearly visible */}
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/80 via-stone-950/45 to-stone-950/95" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/75 via-transparent to-stone-950/75" />

        {/* AI Supply Chain Mesh & Telemetry Matrix */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'radial-gradient(#10b981 1.5px, transparent 1.5px), linear-gradient(0deg, rgba(16, 185, 129, 0.08) 1px, transparent 1px)',
            backgroundSize: '32px 32px, 100% 48px',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Public Network & Regional Agro-Grid Indicator Badge */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-2 mb-6"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/85 border border-emerald-500/50 text-emerald-300 text-xs font-semibold tracking-wide backdrop-blur-md shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Digital Agriculture Infrastructure for Rural India</span>
            <span className="text-emerald-500">•</span>
            <span className="text-stone-300 font-mono">EPICS Academic Initiative</span>
          </div>

          {/* Dynamic Region & GPS Location Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-900/90 border border-stone-700 text-stone-200 text-xs font-mono backdrop-blur-md shadow-xs">
            <RegionGpsSelector />
          </div>
        </motion.div>

        {/* Main Display Typography */}
        <div className="text-center max-w-4xl mx-auto">
          <motion.h1
            initial={shouldReduceMotion ? false : { opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold font-heading tracking-tight leading-[1.08] text-white"
          >
            FROM FARM TO MARKET.{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-200 bg-clip-text text-transparent block sm:inline">
              CONNECTED. SMART. TOGETHER.
            </span>
          </motion.h1>

          <motion.p
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-stone-200 max-w-2xl mx-auto leading-relaxed font-normal"
          >
            AgriSync connects farmers, storage providers, transporters and buyers in{' '}
            <strong className="text-emerald-400 font-semibold">{currentData.stateName}</strong>{' '}
            through one intelligent agricultural supply-chain platform.
          </motion.p>

          {/* Action CTA Buttons */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/register" className="w-full sm:w-auto">
              <Button
                variant="primary"
                size="lg"
                className="w-full sm:w-auto px-8 py-4 text-base font-bold shadow-xl shadow-emerald-950/70 border border-emerald-400/40 hover:scale-102 transition-all"
              >
                Join Agricultural Network
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>

            <a href="#pipeline" className="w-full sm:w-auto">
              <Button
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto px-7 py-4 text-base font-semibold bg-stone-900/90 text-white border-stone-700 hover:bg-stone-850 hover:border-emerald-500/50 backdrop-blur-md transition-all"
              >
                Explore Live Pipeline
              </Button>
            </a>
          </motion.div>

          {/* Core Trust Indicators */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs font-semibold text-stone-300"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Free for Marginal Farmers</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Open IoT Hardware & ESP32 Telemetry</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Verifiable Blockchain Ledger</span>
            </div>
          </motion.div>
        </div>

        {/* INTERACTIVE 6-STAGE VISUAL SUPPLY PIPELINE */}
        <motion.div
          id="pipeline"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="mt-16 sm:mt-20 max-w-5xl mx-auto"
        >
          <div className="bg-stone-900/90 backdrop-blur-xl border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            {/* Header with Active Regional Grid */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-800 gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <h3 className="text-lg sm:text-xl font-bold font-heading text-white tracking-tight">
                    Synchronized 6-Stage Supply Chain
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-700/60 font-bold">
                    {currentData.stateCode} GRID
                  </span>
                </div>
                <p className="text-xs text-stone-300 mt-1 font-mono">
                  Active Corridor: {currentData.transport.origin} → {currentData.transport.destination}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-stone-400 font-mono hidden md:inline">
                  Batch: <strong className="text-white font-bold">{currentData.transport.batchId}</strong>
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-700/50">
                  LIVE PIPELINE
                </span>
              </div>
            </div>

            {/* Pipeline Stage Buttons & Connecting Flow Indicator */}
            <div className="relative mt-8">
              {/* Connecting Pathway Line */}
              <div className="hidden lg:block absolute top-1/2 left-8 right-8 h-0.5 bg-stone-800 -translate-y-1/2 z-0 overflow-hidden">
                {!shouldReduceMotion && (
                  <motion.div
                    className="w-24 h-full bg-gradient-to-r from-transparent via-emerald-400 to-transparent"
                    animate={{ x: ['-100%', '1100%'] }}
                    transition={{
                      duration: 4.5,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  />
                )}
              </div>

              {/* 6 Connected Nodes Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 relative z-10">
                {pipelineStages.map((stage, idx) => {
                  const isSelected = activeStage === idx;
                  const Icon = stage.icon;

                  return (
                    <button
                      key={stage.id}
                      onClick={() => setActiveStage(idx)}
                      className={`relative flex flex-col items-center text-center p-3 sm:p-4 rounded-2xl transition-all cursor-pointer border group ${
                        isSelected
                          ? `${stage.bgActive} ${stage.borderActive} shadow-lg shadow-emerald-950/60 scale-102`
                          : 'bg-stone-900/90 border-stone-800 hover:bg-stone-850 hover:border-stone-700'
                      }`}
                    >
                      {/* Node Icon Circle */}
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2.5 transition-all shadow-inner ${
                          isSelected
                            ? 'bg-stone-950 border border-white/20 text-white'
                            : 'bg-stone-800/80 border border-stone-700 text-stone-400 group-hover:text-stone-200'
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${isSelected ? stage.accentColor : 'text-stone-300'}`} />
                      </div>

                      <div className="flex items-center gap-1 mb-0.5">
                        <span className="text-[11px] sm:text-xs font-bold font-heading text-white tracking-wider uppercase">
                          {stage.name}
                        </span>
                      </div>

                      <span className="text-[11px] text-stone-300 font-medium truncate w-full">
                        {stage.label}
                      </span>

                      {/* Small Status Indicator Pill */}
                      <span className="mt-2 text-[9px] font-mono px-2 py-0.5 rounded-full bg-stone-950/80 text-stone-400 border border-stone-800">
                        {stage.status}
                      </span>

                      {/* Active Indicator Arrow Pip */}
                      {isSelected && (
                        <div className="absolute -bottom-1.5 w-3 h-3 bg-emerald-400 rotate-45 rounded-xs" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Stage Inspection Detail Drawer */}
            <div className="mt-6 p-4 rounded-2xl bg-stone-950/90 border border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-300">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <span className="px-2.5 py-1 rounded-md bg-emerald-950 border border-emerald-700 text-emerald-400 font-bold uppercase tracking-wider text-[10px] font-mono">
                  Step {activeStage + 1} of 6: {pipelineStages[activeStage].name}
                </span>
                <span className="text-white font-medium text-xs sm:text-sm">
                  {pipelineStages[activeStage].label} —{' '}
                  <span className="text-emerald-300 font-semibold">{pipelineStages[activeStage].metric}</span>
                </span>
              </div>
              <div className="flex items-center gap-2 text-stone-400 text-xs shrink-0">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>
                  Checkpoint: <strong className="text-white">{pipelineStages[activeStage].location}</strong>
                </span>
              </div>
            </div>

            {/* 3 FLOATING CONTEXTUAL INFORMATION CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              {/* Card 1: Storage Available */}
              <motion.div
                animate={shouldReduceMotion ? {} : { y: [0, -5, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                className="p-4 rounded-2xl bg-stone-850/90 border border-stone-750 shadow-md hover:border-emerald-500/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                      <Warehouse className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">Storage Chamber</span>
                      <span className="text-[10px] text-stone-400 truncate max-w-[130px] block">
                        {currentData.iot.facilityName}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-400 font-mono block">
                      {currentData.iot.temperature}°C
                    </span>
                    <span className="text-[9px] uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800">
                      {currentData.iot.storageStatus}
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-stone-300 leading-relaxed mt-2 font-mono">
                  Chamber {currentData.iot.storageUnitId}: Staged at {currentData.iot.humidity}% RH, CO2 {currentData.iot.co2Ppm} ppm.
                </p>
              </motion.div>

              {/* Card 2: Transport */}
              <motion.div
                animate={shouldReduceMotion ? {} : { y: [0, -6, 0] }}
                transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
                className="p-4 rounded-2xl bg-stone-850/90 border border-stone-750 shadow-md hover:border-sky-500/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-sky-950 border border-sky-500/40 flex items-center justify-center text-sky-400">
                      <Truck className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">Reefer Transport</span>
                      <span className="text-[10px] text-stone-400 font-mono">
                        {currentData.transport.vehicleNumber}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-sky-400 font-mono block">
                      {currentData.transport.distanceKm} km
                    </span>
                    <span className="text-[9px] uppercase tracking-wider text-sky-400 bg-sky-950/80 px-1.5 py-0.5 rounded border border-sky-800 font-mono">
                      {currentData.transport.estimatedTravelTimeMin}m ETA
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-stone-300 leading-relaxed mt-2">
                  Driver: {currentData.transport.driverName} • Route synchronized from {currentData.transport.origin.slice(0, 24)}...
                </p>
              </motion.div>

              {/* Card 3: Traceability */}
              <motion.div
                animate={shouldReduceMotion ? {} : { y: [0, -5, 0] }}
                transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
                className="p-4 rounded-2xl bg-stone-850/90 border border-stone-750 shadow-md hover:border-emerald-500/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                      <ShieldCheck className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">Verified Batch</span>
                      <span className="text-[10px] text-stone-400 font-mono">
                        {currentData.traceability.batchId}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-400 font-mono block">
                      {currentData.traceability.qualityGrade}
                    </span>
                    <span className="text-[9px] uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800">
                      Sealed
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-stone-300 leading-relaxed mt-2 font-mono truncate">
                  Farmer: {currentData.traceability.farmer} • {currentData.traceability.crop}
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;

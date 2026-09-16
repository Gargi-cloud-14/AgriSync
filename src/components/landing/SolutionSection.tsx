import React from 'react';
import { demoSolutions } from '../../data/demoData';
import { Wheat, PackageCheck, Truck, Store, Check, ArrowRight, ShieldCheck, Thermometer, Radio, Award } from 'lucide-react';
import { Card } from '../common/Card';
import { Link } from 'react-router-dom';
import { AGRI_IMAGES } from '../../assets/images';

export const SolutionSection: React.FC = () => {
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'FARMER':
        return <Wheat className="w-5 h-5 text-emerald-400" />;
      case 'STORAGE_PROVIDER':
        return <PackageCheck className="w-5 h-5 text-amber-400" />;
      case 'TRANSPORTER':
        return <Truck className="w-5 h-5 text-sky-400" />;
      case 'BUYER':
      default:
        return <Store className="w-5 h-5 text-teal-400" />;
    }
  };

  const getRoleDashboardLink = (role: string) => {
    switch (role) {
      case 'STORAGE_PROVIDER':
        return '/storage';
      case 'TRANSPORTER':
        return '/transporter';
      case 'BUYER':
        return '/buyer';
      case 'FARMER':
      default:
        return '/farmer';
    }
  };

  const getRoleVisual = (role: string) => {
    switch (role) {
      case 'FARMER':
        return {
          image: AGRI_IMAGES.farmerHarvest,
          badge: 'Stage 01: Producer Harvest',
          status: 'QR Crate Tagging Active',
          statusIcon: Radio,
          alt: 'Indian farmer in vineyard inspecting harvest with digital QR tags',
        };
      case 'STORAGE_PROVIDER':
        return {
          image: AGRI_IMAGES.coldStorage,
          badge: 'Stage 02: Industrial Cold Hub',
          status: 'Chamber Setpoint: 2.4°C • 90% RH',
          statusIcon: Thermometer,
          alt: 'Modern industrial cold storage warehouse with IoT climate display',
        };
      case 'TRANSPORTER':
        return {
          image: AGRI_IMAGES.reeferTruck,
          badge: 'Stage 03: Reefer Logistics',
          status: 'Continuous Cold Custody',
          statusIcon: Truck,
          alt: 'Refrigerated container truck loading at agricultural logistics terminal',
        };
      case 'BUYER':
      default:
        return {
          image: AGRI_IMAGES.mandiInspection,
          badge: 'Stage 04: Mandi Verification',
          status: 'Quality Proof • Direct Pay',
          statusIcon: Award,
          alt: 'Agricultural quality testing and provenance inspection table',
        };
    }
  };

  return (
    <section id="features" className="py-20 lg:py-28 bg-stone-900 text-white relative overflow-hidden border-b border-stone-800">
      {/* Background Subtle Mesh & Glow */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#10b981 1.5px, transparent 1.5px)',
          backgroundSize: '32px 32px',
        }}
      />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-950/40 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-sky-950/30 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/90 border border-emerald-700/60 px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Unified Agricultural Ecosystem
          </span>
          <h2 className="mt-4 text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight">
            One Platform. Synchronizing Every Stakeholder.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-stone-300 leading-relaxed">
            By connecting producers, industrial cold storage, highway reefer fleets, and wholesale mandis through live IoT telemetry and verifiable cryptographic proofs.
          </p>

          {/* Stepper Chain Indicator */}
          <div className="mt-8 inline-flex flex-wrap items-center justify-center gap-2 sm:gap-3 p-2 rounded-2xl bg-stone-950/80 border border-stone-800 text-xs sm:text-sm font-semibold">
            <span className="px-3 py-1 rounded-xl bg-emerald-900/80 text-emerald-300 border border-emerald-700/50 flex items-center gap-1.5">
              <span>🌾</span> 1. Farmer / Producer
            </span>
            <span className="text-stone-600 font-mono">→</span>
            <span className="px-3 py-1 rounded-xl bg-amber-900/80 text-amber-300 border border-amber-700/50 flex items-center gap-1.5">
              <span>❄️</span> 2. Cold Storage Hub
            </span>
            <span className="text-stone-600 font-mono">→</span>
            <span className="px-3 py-1 rounded-xl bg-sky-900/80 text-sky-300 border border-sky-700/50 flex items-center gap-1.5">
              <span>🚛</span> 3. Reefer Logistics
            </span>
            <span className="text-stone-600 font-mono">→</span>
            <span className="px-3 py-1 rounded-xl bg-teal-900/80 text-teal-300 border border-teal-700/50 flex items-center gap-1.5">
              <span>🏪</span> 4. Wholesale Mandi
            </span>
          </div>
        </div>

        {/* 4 Professional Role Cards with Authentic Google-Quality Imagery */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7">
          {demoSolutions.map((sol) => {
            const visual = getRoleVisual(sol.role);
            const StatusIcon = visual.statusIcon;

            return (
              <div
                key={sol.role}
                className="flex flex-col justify-between bg-stone-850 border border-stone-750 hover:border-emerald-500/80 rounded-3xl overflow-hidden transition-all duration-200 group hover:-translate-y-1.5 shadow-xl"
              >
                {/* Visual Header Image Window */}
                <div className="relative h-48 w-full overflow-hidden bg-stone-900">
                  <img
                    src={visual.image}
                    alt={visual.alt}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter contrast-105"
                  />
                  {/* Subtle Gradient Scrim on Image */}
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/30 to-transparent" />

                  {/* Stage Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-stone-950/80 backdrop-blur-md text-emerald-400 border border-stone-700 shadow-sm">
                      {visual.badge}
                    </span>
                  </div>

                  {/* Role Icon Circle */}
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-xl bg-stone-950/80 backdrop-blur-md border border-stone-700 flex items-center justify-center">
                    {getRoleIcon(sol.role)}
                  </div>

                  {/* Live Telemetry Status Strip at bottom of image */}
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-950/90 backdrop-blur-md border border-stone-800 text-[11px] font-mono text-stone-200">
                    <StatusIcon className="w-3.5 h-3.5 text-emerald-400 shrink-0 animate-pulse" />
                    <span className="truncate">{visual.status}</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold font-heading text-white mb-1 group-hover:text-emerald-300 transition-colors">
                      {sol.title}
                    </h3>
                    <p className="text-xs text-stone-400 mb-5 font-medium leading-relaxed">
                      {sol.subtitle}
                    </p>

                    <ul className="space-y-2.5 mb-6">
                      {sol.benefits.map((b, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs text-stone-300">
                          <div className="w-4 h-4 rounded-full bg-emerald-950 border border-emerald-600/50 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-2.5 h-2.5" />
                          </div>
                          <span className="leading-snug">{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Footer Action */}
                  <div className="pt-4 border-t border-stone-750 mt-auto">
                    <Link
                      to={getRoleDashboardLink(sol.role)}
                      className="w-full py-2.5 px-3 rounded-xl bg-stone-800 hover:bg-emerald-600 text-stone-200 hover:text-white text-xs font-semibold flex items-center justify-between transition-colors border border-stone-700 hover:border-emerald-500"
                    >
                      <span>Open {sol.title.split(' ')[0]} Hub</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;
